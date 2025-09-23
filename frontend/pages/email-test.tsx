import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth-context';
import { EmailTestingService, EmailTestResult } from '../lib/email-test-utils';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AdminRoute from '../components/AdminRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  Mail,
  Shield,
  Key,
  Link,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  RefreshCw,
  Send,
  Clock,
  User,
  FileText,
  Activity
} from 'lucide-react';

export default function EmailTest() {
  const { user } = useAuth();
  const [emailService] = useState(() => new EmailTestingService());
  const [testResults, setTestResults] = useState<EmailTestResult[]>([]);
  const [testEmail, setTestEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [actionCode, setActionCode] = useState('');
  const [emailLink, setEmailLink] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({});
  const [testReport, setTestReport] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('tests');

  useEffect(() => {
    // Check if returning from email link
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    const oobCode = urlParams.get('oobCode');

    if (mode && oobCode) {
      setActionCode(oobCode);
      console.log('Detected action code from URL:', { mode, oobCode });
    }

    // Check if this is an email link sign-in
    if (window.location.href.includes('auth/action')) {
      setEmailLink(window.location.href);
    }

  }, []);

  const runTest = async (testName: string, testFunction: () => Promise<EmailTestResult>) => {
    setIsLoading({ ...isLoading, [testName]: true });
    try {
      const result = await testFunction();
      setTestResults([...emailService.getTestResults()]);

      // Show notification
      if (result.success) {
        console.log(`✅ ${testName} successful:`, result);
      } else {
        console.error(`❌ ${testName} failed:`, result);
      }
    } catch (error) {
      console.error(`Error running ${testName}:`, error);
    } finally {
      setIsLoading({ ...isLoading, [testName]: false });
    }
  };

  const generateReport = () => {
    const report = emailService.generateTestReport();
    setTestReport(report);
  };

  const exportResults = () => {
    const data = emailService.exportTestResults();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `email-test-results-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearResults = () => {
    emailService.clearTestResults();
    setTestResults([]);
    setTestReport(null);
  };


  return (
    <AdminRoute>
      <div className="min-h-screen flex flex-col bg-neutral-50">
        <Header />

        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Mail className="h-8 w-8 text-[#2ecc71]" />
              Email Functionality Testing
            </h1>
            <p className="mt-2 text-gray-600">
              Comprehensive testing suite for Firebase email authentication
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="tests">Run Tests</TabsTrigger>
              <TabsTrigger value="results">Test Results</TabsTrigger>
              <TabsTrigger value="report">Report</TabsTrigger>
              <TabsTrigger value="guide">Testing Guide</TabsTrigger>
            </TabsList>

            <TabsContent value="tests" className="space-y-6">
              {/* Password Reset Testing */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    Password Reset Email
                  </CardTitle>
                  <CardDescription>
                    Test sending password reset emails to users
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="reset-email">Email Address</Label>
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="user@example.com"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={() => runTest('passwordReset', () =>
                      emailService.testPasswordResetEmail(testEmail)
                    )}
                    disabled={!testEmail || isLoading.passwordReset}
                    className="bg-[#2ecc71] hover:bg-[#27ae60]"
                  >
                    {isLoading.passwordReset ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    Send Password Reset Email
                  </Button>
                </CardContent>
              </Card>

              {/* Email Verification Testing */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Email Verification
                  </CardTitle>
                  <CardDescription>
                    Send verification email to current user
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                    <p className="text-sm text-blue-800">
                      Current User: {user?.email || 'Not signed in'}
                    </p>
                    <p className="text-sm text-blue-800">
                      Verified: {user?.emailVerified ? 'Yes' : 'No'}
                    </p>
                  </div>
                  <Button
                    onClick={() => runTest('emailVerification', () =>
                      emailService.testEmailVerification(user)
                    )}
                    disabled={!user || isLoading.emailVerification}
                    className="bg-[#2ecc71] hover:bg-[#27ae60]"
                  >
                    {isLoading.emailVerification ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    Send Verification Email
                  </Button>
                </CardContent>
              </Card>

              {/* Email Link Sign In Testing */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Link className="h-5 w-5" />
                    Email Link Sign In (Passwordless)
                  </CardTitle>
                  <CardDescription>
                    Test passwordless authentication via email link
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="link-email">Email Address</Label>
                    <Input
                      id="link-email"
                      type="email"
                      placeholder="user@example.com"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={() => runTest('emailLink', () =>
                      emailService.testEmailLinkSignIn(testEmail)
                    )}
                    disabled={!testEmail || isLoading.emailLink}
                    className="bg-[#2ecc71] hover:bg-[#27ae60]"
                  >
                    {isLoading.emailLink ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    Send Sign-In Link
                  </Button>

                  {emailLink && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                      <p className="text-sm text-green-800 font-semibold">
                        Email link detected! Click below to complete sign-in:
                      </p>
                      <Button
                        onClick={() => runTest('verifyLink', () =>
                          emailService.verifyEmailLink(emailLink)
                        )}
                        className="mt-2 bg-green-600 hover:bg-green-700"
                      >
                        Complete Sign In
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Update Email Testing */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Update Email Address
                  </CardTitle>
                  <CardDescription>
                    Change the email address for current user
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="new-email">New Email Address</Label>
                    <Input
                      id="new-email"
                      type="email"
                      placeholder="newemail@example.com"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={() => runTest('updateEmail', () =>
                      emailService.testUpdateEmail(user, newEmail)
                    )}
                    disabled={!user || !newEmail || isLoading.updateEmail}
                    className="bg-[#2ecc71] hover:bg-[#27ae60]"
                  >
                    {isLoading.updateEmail ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    Update Email
                  </Button>
                </CardContent>
              </Card>

              {/* Check Sign-in Methods */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Check Sign-in Methods
                  </CardTitle>
                  <CardDescription>
                    Check available sign-in methods for an email
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="check-email">Email Address</Label>
                    <Input
                      id="check-email"
                      type="email"
                      placeholder="user@example.com"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={() => runTest('checkMethods', () =>
                      emailService.testCheckSignInMethods(testEmail)
                    )}
                    disabled={!testEmail || isLoading.checkMethods}
                    className="bg-[#2ecc71] hover:bg-[#27ae60]"
                  >
                    {isLoading.checkMethods ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Activity className="h-4 w-4 mr-2" />
                    )}
                    Check Methods
                  </Button>
                </CardContent>
              </Card>

              {/* Action Code Verification */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Action Code Operations
                  </CardTitle>
                  <CardDescription>
                    Verify and apply action codes from email links
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="action-code">Action Code (from email URL)</Label>
                    <Input
                      id="action-code"
                      type="text"
                      placeholder="Enter action code..."
                      value={actionCode}
                      onChange={(e) => setActionCode(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => runTest('verifyCode', () =>
                        emailService.testVerifyActionCode(actionCode)
                      )}
                      disabled={!actionCode || isLoading.verifyCode}
                      variant="outline"
                    >
                      Verify Code
                    </Button>

                    <Button
                      onClick={() => runTest('applyCode', () =>
                        emailService.testApplyActionCode(actionCode)
                      )}
                      disabled={!actionCode || isLoading.applyCode}
                      className="bg-[#2ecc71] hover:bg-[#27ae60]"
                    >
                      Apply Code
                    </Button>
                  </div>

                  {/* Password Reset Completion */}
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-semibold mb-2">Complete Password Reset</h4>
                    <div className="grid gap-2 mb-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input
                        id="new-password"
                        type="password"
                        placeholder="Enter new password..."
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <Button
                      onClick={() => runTest('resetPassword', () =>
                        emailService.testCompletePasswordReset(actionCode, newPassword)
                      )}
                      disabled={!actionCode || !newPassword || isLoading.resetPassword}
                      className="bg-[#2ecc71] hover:bg-[#27ae60]"
                    >
                      Reset Password
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="results" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Test Results ({testResults.length})</h2>
                <div className="flex gap-2">
                  <Button
                    onClick={exportResults}
                    variant="outline"
                    disabled={testResults.length === 0}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export JSON
                  </Button>
                  <Button
                    onClick={clearResults}
                    variant="outline"
                    disabled={testResults.length === 0}
                  >
                    Clear Results
                  </Button>
                </div>
              </div>

              {testResults.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-gray-500">
                    No test results yet. Run some tests to see results here.
                  </CardContent>
                </Card>
              ) : (
                testResults.map((result, index) => (
                  <Card key={index}>
                    <CardContent className="py-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {result.success ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500" />
                            )}
                            <span className="font-semibold">{result.type}</span>
                            <Badge variant={result.success ? 'default' : 'secondary'}>
                              {result.success ? 'Success' : 'Failed'}
                            </Badge>
                          </div>

                          <p className="text-sm text-gray-600 mb-1">
                            <strong>Email:</strong> {result.email}
                          </p>

                          <p className="text-sm text-gray-600 mb-1">
                            <strong>Message:</strong> {result.message}
                          </p>

                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(result.timestamp).toLocaleString()}
                          </p>

                          {result.details && (
                            <details className="mt-2">
                              <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-800">
                                View Details
                              </summary>
                              <pre className="mt-2 p-2 bg-gray-50 rounded text-xs overflow-x-auto">
                                {JSON.stringify(result.details, null, 2)}
                              </pre>
                            </details>
                          )}

                          {result.error && (
                            <details className="mt-2">
                              <summary className="cursor-pointer text-sm text-red-600 hover:text-red-800">
                                View Error
                              </summary>
                              <pre className="mt-2 p-2 bg-red-50 rounded text-xs overflow-x-auto text-red-800">
                                {JSON.stringify(result.error, null, 2)}
                              </pre>
                            </details>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="report" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Test Report</h2>
                <Button
                  onClick={generateReport}
                  className="bg-[#2ecc71] hover:bg-[#27ae60]"
                >
                  <Activity className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </div>

              {testReport ? (
                <>
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="py-4">
                        <div className="text-2xl font-bold">{testReport.totalTests}</div>
                        <p className="text-sm text-gray-500">Total Tests</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="py-4">
                        <div className="text-2xl font-bold text-green-600">{testReport.passed}</div>
                        <p className="text-sm text-gray-500">Passed</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="py-4">
                        <div className="text-2xl font-bold text-red-600">{testReport.failed}</div>
                        <p className="text-sm text-gray-500">Failed</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="py-4">
                        <div className="text-2xl font-bold">{testReport.successRate}</div>
                        <p className="text-sm text-gray-500">Success Rate</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Performance Metrics */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">
                        <strong>Average Response Time:</strong> {testReport.averageResponseTime}ms
                      </p>
                    </CardContent>
                  </Card>

                  {/* Results by Type */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Results by Test Type</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {Object.entries(testReport.byType).map(([type, stats]: [string, any]) => (
                          <div key={type} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="font-medium">{type}</span>
                            <div className="flex gap-4">
                              <span className="text-green-600">✓ {stats.passed}</span>
                              <span className="text-red-600">✗ {stats.failed}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Errors */}
                  {testReport.errors.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-red-600">Errors Encountered</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {testReport.errors.map((error: any, index: number) => (
                            <div key={index} className="p-3 bg-red-50 border border-red-200 rounded">
                              <p className="font-semibold text-red-800">{error.type}</p>
                              <p className="text-sm text-red-600">
                                {error.error.code}: {error.error.message}
                              </p>
                              <p className="text-xs text-red-500 mt-1">
                                {new Date(error.timestamp).toLocaleString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              ) : (
                <Card>
                  <CardContent className="py-8 text-center text-gray-500">
                    Click "Generate Report" to see test statistics
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="guide" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Email Testing Guide</CardTitle>
                  <CardDescription>
                    Comprehensive guide for testing Firebase email functionality
                  </CardDescription>
                </CardHeader>
                <CardContent className="prose max-w-none">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">🧪 Test Scenarios</h3>
                      <ol className="list-decimal list-inside space-y-2 text-sm">
                        <li><strong>Password Reset:</strong> Send reset email → Check inbox → Click link → Enter new password</li>
                        <li><strong>Email Verification:</strong> Sign up → Send verification → Click link → Check verified status</li>
                        <li><strong>Passwordless Sign-in:</strong> Request link → Check email → Click link → Auto sign-in</li>
                        <li><strong>Email Update:</strong> Change email → Verify both old and new addresses</li>
                        <li><strong>Action Codes:</strong> Test expired codes, invalid codes, and successful applications</li>
                      </ol>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">📧 Email Deliverability Checklist</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>✓ SPF record: <code>v=spf1 include:_spf.firebasemail.com ~all</code></li>
                        <li>✓ DKIM records: Both firebase1 and firebase2 CNAME records</li>
                        <li>✓ Domain verification: <code>firebase=atamagri-iot</code></li>
                        <li>✓ Check spam folder if emails don't arrive</li>
                        <li>✓ Whitelist noreply@atamagri.app in email client</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">⏱️ Expected Response Times</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Email sending: 100-500ms (API response)</li>
                        <li>Email delivery: 5-30 seconds (inbox arrival)</li>
                        <li>DNS propagation: 5-30 minutes (after changes)</li>
                        <li>Action code expiry: 1 hour (default)</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">🔍 Troubleshooting Common Issues</h3>
                      <div className="space-y-2 text-sm">
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                          <strong>Emails not arriving:</strong> Check spam folder, verify DNS records, check Firebase quotas
                        </div>
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                          <strong>Invalid action code:</strong> Code may be expired (&gt;1 hour) or already used
                        </div>
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                          <strong>Requires recent login:</strong> User needs to re-authenticate for sensitive operations
                        </div>
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                          <strong>Email already in use:</strong> Email is registered with another account
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">✅ Best Practices</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Always test with real email addresses (use temp email services if needed)</li>
                        <li>Test both success and failure scenarios</li>
                        <li>Verify email content and branding</li>
                        <li>Test on different email providers (Gmail, Outlook, Yahoo)</li>
                        <li>Monitor Firebase usage quotas and limits</li>
                        <li>Keep action URLs consistent and secure (HTTPS)</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">📊 Firebase Email Quotas</h3>
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2">Feature</th>
                            <th className="text-left py-2">Free Tier</th>
                            <th className="text-left py-2">Blaze Plan</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="py-2">Password reset emails</td>
                            <td className="py-2">150/day</td>
                            <td className="py-2">Unlimited</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2">Email verification</td>
                            <td className="py-2">150/day</td>
                            <td className="py-2">Unlimited</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2">Email link sign-in</td>
                            <td className="py-2">150/day</td>
                            <td className="py-2">Unlimited</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>

        <Footer />
      </div>
    </AdminRoute>
  );
}