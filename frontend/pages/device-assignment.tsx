import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth-context';
import { db } from '../lib/firebase';
import { ref, set, get, onValue } from 'firebase/database';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { CheckCircle, AlertCircle } from 'lucide-react';
import AdminRoute from '../components/AdminRoute';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface UserDevice {
  uid: string;
  email: string;
  devices: string[];
  drone: string | null;
}

export default function DeviceAssignment() {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState<UserDevice[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [deviceId, setDeviceId] = useState<string>('');
  const [droneId, setDroneId] = useState<string>('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  // Load all users
  useEffect(() => {
    if (!db) return;

    const usersRef = ref(db, 'users');
    const unsubscribe = onValue(usersRef, async (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const usersList: UserDevice[] = [];

        for (const [uid, userData] of Object.entries(data)) {
          const user = userData as any;
          usersList.push({
            uid,
            email: user.email || 'No email',
            devices: user.devices ? Object.values(user.devices) : [],
            drone: user.drone || null
          });
        }

        setUsers(usersList);
      }
    });

    return () => unsubscribe();
  }, []);

  const assignDevice = async () => {
    if (!selectedUser || !deviceId) {
      setMessage({ type: 'error', text: 'Please select a user and enter a device ID' });
      return;
    }

    setLoading(true);
    try {
      // Update user's devices
      const userDevicesRef = ref(db, `users/${selectedUser}/devices`);
      await set(userDevicesRef, { primary: deviceId });

      // If drone ID is provided, update drone as well
      if (droneId) {
        const userDroneRef = ref(db, `users/${selectedUser}/drone`);
        await set(userDroneRef, droneId);
      }

      // Register device in devices table
      const deviceRef = ref(db, `devices/${deviceId}`);
      await set(deviceRef, {
        owner: selectedUser,
        createdAt: new Date().toISOString(),
        status: 'inactive',
        type: 'esp32'
      });

      // If drone ID is provided, register drone
      if (droneId) {
        const droneRef = ref(db, `drones/${droneId}`);
        await set(droneRef, {
          owner: selectedUser,
          createdAt: new Date().toISOString(),
          status: 'inactive'
        });
      }

      // Update device counter if necessary
      const deviceNumber = parseInt(deviceId.replace('ESP32-', ''));
      if (!isNaN(deviceNumber)) {
        const counterRef = ref(db, 'system/device_counter');
        const counterSnapshot = await get(counterRef);
        const currentCounter = counterSnapshot.exists() ? counterSnapshot.val() : 0;
        if (deviceNumber > currentCounter) {
          await set(counterRef, deviceNumber);
        }
      }

      setMessage({
        type: 'success',
        text: `Successfully assigned ${deviceId}${droneId ? ` and ${droneId}` : ''} to user`
      });
      setDeviceId('');
      setDroneId('');
    } catch (error) {
      console.error('Error assigning device:', error);
      setMessage({ type: 'error', text: 'Failed to assign device' });
    } finally {
      setLoading(false);
    }
  };

  // Quick assign for the current user
  const quickAssignCurrentUser = async () => {
    setLoading(true);
    try {
      // Find the user with email abdulrosyid6122004@gmail.com
      const targetUser = users.find(u => u.email === 'abdulrosyid6122004@gmail.com');

      if (!targetUser) {
        setMessage({ type: 'error', text: 'User abdulrosyid6122004@gmail.com not found' });
        return;
      }

      // Assign ESP32-001 and DRONE-001
      const userRef = ref(db, `users/${targetUser.uid}`);
      await set(userRef, {
        email: targetUser.email,
        createdAt: new Date().toISOString(),
        devices: { primary: 'ESP32-001' },
        drone: 'DRONE-001'
      });

      // Register device
      const deviceRef = ref(db, 'devices/ESP32-001');
      await set(deviceRef, {
        owner: targetUser.uid,
        createdAt: new Date().toISOString(),
        status: 'active',
        type: 'esp32'
      });

      // Register drone
      const droneRef = ref(db, 'drones/DRONE-001');
      await set(droneRef, {
        owner: targetUser.uid,
        createdAt: new Date().toISOString(),
        status: 'active'
      });

      // Set device counter
      const counterRef = ref(db, 'system/device_counter');
      await set(counterRef, 1);

      setMessage({
        type: 'success',
        text: 'Successfully assigned ESP32-001 and DRONE-001 to abdulrosyid6122004@gmail.com'
      });
    } catch (error) {
      console.error('Error in quick assign:', error);
      setMessage({ type: 'error', text: 'Failed to quick assign devices' });
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col bg-neutral-50">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Access Denied</CardTitle>
            </CardHeader>
            <CardContent>
              <p>You need admin privileges to access this page.</p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <AdminRoute>
      <div className="min-h-screen flex flex-col bg-neutral-50">
        <Header />

        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Device Assignment Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {message && (
                  <div className={`p-4 rounded-lg flex items-start gap-3 ${
                    message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                  }`}>
                    {message.type === 'success' ?
                      <CheckCircle className="w-5 h-5 mt-0.5" /> :
                      <AlertCircle className="w-5 h-5 mt-0.5" />
                    }
                    <p>{message.text}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Button
                    onClick={quickAssignCurrentUser}
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Quick Assign ESP32-001 to abdulrosyid6122004@gmail.com
                  </Button>
                  <p className="text-sm text-gray-600">
                    This will assign ESP32-001 and DRONE-001 to your current account
                  </p>
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-4">Manual Device Assignment</h3>

                  <div className="space-y-4">
                    <div>
                      <Label>Select User</Label>
                      <select
                        className="w-full p-2 border rounded-md"
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                      >
                        <option value="">-- Select User --</option>
                        {users.map(user => (
                          <option key={user.uid} value={user.uid}>
                            {user.email} (Current devices: {user.devices.join(', ') || 'None'})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label>Device ID (e.g., ESP32-002)</Label>
                      <Input
                        value={deviceId}
                        onChange={(e) => setDeviceId(e.target.value)}
                        placeholder="ESP32-XXX"
                      />
                    </div>

                    <div>
                      <Label>Drone ID (Optional, e.g., DRONE-002)</Label>
                      <Input
                        value={droneId}
                        onChange={(e) => setDroneId(e.target.value)}
                        placeholder="DRONE-XXX"
                      />
                    </div>

                    <Button
                      onClick={assignDevice}
                      disabled={loading || !selectedUser || !deviceId}
                    >
                      {loading ? 'Assigning...' : 'Assign Device'}
                    </Button>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-4">Current User-Device Mappings</h3>
                  <div className="space-y-2">
                    {users.map(user => (
                      <div key={user.uid} className="p-3 border rounded-lg">
                        <p className="font-medium">{user.email}</p>
                        <p className="text-sm text-gray-600">
                          Devices: {user.devices.length > 0 ? user.devices.join(', ') : 'None'}
                        </p>
                        <p className="text-sm text-gray-600">
                          Drone: {user.drone || 'None'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    </AdminRoute>
  );
}