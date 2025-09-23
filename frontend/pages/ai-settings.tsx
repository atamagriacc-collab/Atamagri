import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Brain, Save, ArrowLeft, AlertCircle, CheckCircle, Settings2, BellRing, Zap, Clock } from 'lucide-react';

interface AISettings {
  enableRecommendations: boolean;
  autoRefreshInterval: number;
  confidenceThreshold: number;
  notificationsEnabled: boolean;
  priorityFilter: string[];
  maxRecommendations: number;
  apiProvider: 'openai' | 'gemini' | 'local';
}

export default function AISettings() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [settings, setSettings] = useState<AISettings>({
    enableRecommendations: true,
    autoRefreshInterval: 5,
    confidenceThreshold: 0.7,
    notificationsEnabled: true,
    priorityFilter: ['high', 'medium', 'low'],
    maxRecommendations: 10,
    apiProvider: 'local'
  });

  // Load saved settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('aiSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSaveSettings = async () => {
    setLoading(true);
    setError(null);
    setSaved(false);

    try {
      // Save settings to localStorage
      localStorage.setItem('aiSettings', JSON.stringify(settings));

      // If user is logged in, save to Firebase as well
      if (user) {
        const response = await fetch('/api/user-settings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await user.getIdToken()}`
          },
          body: JSON.stringify({
            aiSettings: settings
          })
        });

        if (!response.ok) {
          throw new Error('Failed to save settings to server');
        }
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handlePriorityToggle = (priority: string) => {
    setSettings(prev => ({
      ...prev,
      priorityFilter: prev.priorityFilter.includes(priority)
        ? prev.priorityFilter.filter(p => p !== priority)
        : [...prev.priorityFilter, priority]
    }));
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button
              onClick={() => router.push('/dashboard')}
              variant="outline"
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl text-white">
                <Brain className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  AI Settings
                </h1>
                <p className="text-gray-600">
                  Configure your agricultural AI assistant preferences
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          {saved && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-700">Settings saved successfully!</span>
            </div>
          )}

          <div className="space-y-6">
            {/* General Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings2 className="w-5 h-5" />
                  General Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enable-recommendations">Enable AI Recommendations</Label>
                    <p className="text-sm text-gray-500">
                      Get smart recommendations based on your sensor data
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="enable-recommendations"
                      className="sr-only peer"
                      checked={settings.enableRecommendations}
                      onChange={(e) => setSettings(prev => ({ ...prev, enableRecommendations: e.target.checked }))}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div>
                  <Label htmlFor="api-provider">AI Provider</Label>
                  <select
                    id="api-provider"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={settings.apiProvider}
                    onChange={(e) => setSettings(prev => ({ ...prev, apiProvider: e.target.value as any }))}
                  >
                    <option value="local">Local Analysis (No API)</option>
                    <option value="openai">OpenAI GPT-4</option>
                    <option value="gemini">Google Gemini</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="max-recommendations">Maximum Recommendations</Label>
                  <Input
                    id="max-recommendations"
                    type="number"
                    min="1"
                    max="20"
                    value={settings.maxRecommendations}
                    onChange={(e) => setSettings(prev => ({ ...prev, maxRecommendations: parseInt(e.target.value) }))}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Maximum number of recommendations to display at once
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Refresh Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Refresh Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="refresh-interval">Auto-Refresh Interval (minutes)</Label>
                  <Input
                    id="refresh-interval"
                    type="number"
                    min="1"
                    max="60"
                    value={settings.autoRefreshInterval}
                    onChange={(e) => setSettings(prev => ({ ...prev, autoRefreshInterval: parseInt(e.target.value) }))}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    How often to fetch new AI recommendations
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Filter Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Filter Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Priority Levels to Display</Label>
                  <div className="flex gap-3 mt-2">
                    {['high', 'medium', 'low'].map((priority) => (
                      <button
                        key={priority}
                        onClick={() => handlePriorityToggle(priority)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          settings.priorityFilter.includes(priority)
                            ? priority === 'high'
                              ? 'bg-red-100 text-red-700 border-2 border-red-500'
                              : priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-500'
                              : 'bg-blue-100 text-blue-700 border-2 border-blue-500'
                            : 'bg-gray-100 text-gray-500 border-2 border-gray-300'
                        }`}
                      >
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="confidence-threshold">Minimum Confidence Score</Label>
                  <div className="flex items-center gap-3">
                    <input
                      id="confidence-threshold"
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={settings.confidenceThreshold}
                      onChange={(e) => setSettings(prev => ({ ...prev, confidenceThreshold: parseFloat(e.target.value) }))}
                      className="flex-1"
                    />
                    <span className="text-sm font-medium text-gray-700 w-12">
                      {Math.round(settings.confidenceThreshold * 100)}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Only show recommendations with confidence above this threshold
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BellRing className="w-5 h-5" />
                  Notification Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enable-notifications">Enable Push Notifications</Label>
                    <p className="text-sm text-gray-500">
                      Get notified about high-priority recommendations
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="enable-notifications"
                      className="sr-only peer"
                      checked={settings.notificationsEnabled}
                      onChange={(e) => setSettings(prev => ({ ...prev, notificationsEnabled: e.target.checked }))}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => router.push('/dashboard')}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveSettings}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Settings
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}