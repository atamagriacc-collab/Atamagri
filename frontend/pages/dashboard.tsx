import React, { useState, useEffect } from 'react';
import { Home, Plane, Settings, LogOut, Shield, Plus, CloudRain, Wind, Sun, Thermometer, Droplets, Battery, Activity, RefreshCw, MapPin, Wifi, WifiOff, Edit2, Trash2, Save, X, User, Mail, Phone, Lock, CheckCircle, AlertCircle, Menu, Zap, Gauge, ArrowLeft, Eye, Filter, Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../lib/auth-context';
import { getAuth, updateProfile, updatePassword, sendEmailVerification } from 'firebase/auth';
import { db } from '../lib/firebase';
import { ref, onValue, query, limitToLast, set, remove, push } from 'firebase/database';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import DroneControl from '../components/drone-control';
import AIRecommendationsPanel from '../components/AIRecommendationsPanel';
import SensorDetailModal from '../components/SensorDetailModal';

interface Station {
  id: string;
  name: string;
  location: string;
  status: 'active' | 'inactive';
  lastUpdate?: string;
}

interface SensorData {
  id: string;
  device_id: string;
  timestamp: string | number;
  temperature?: number;
  temperature_C?: number;
  humidity?: number;
  humidity_?: number;
  wind_m_s?: number;
  wind_kmh?: number;
  rainrate_mm_h?: number;
  light_lux?: number;
  sol_voltage_V?: number;
  sol_current_mA?: number;
  sol_power_W?: number;
  nitrogen?: number;
  phosphorus?: number;
  potassium?: number;
  ph?: number;
  rainfall?: number;
  soil_moisture?: number;
  received_at?: string;
}

export default function Dashboard() {
  const { logout, isAdmin, user, userDevices, userDrone } = useAuth();
  const [emailVerified, setEmailVerified] = useState(user?.emailVerified || false);
  const [profileComplete, setProfileComplete] = useState(false);
  const [active, setActive] = useState<string>('dashboard');
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Station management
  const [stations, setStations] = useState<Station[]>([]);
  const [showAddStation, setShowAddStation] = useState(false);
  const [editingStation, setEditingStation] = useState<Station | null>(null);
  const [newStation, setNewStation] = useState({ name: '', location: '' });
  const [stationSearchTerm, setStationSearchTerm] = useState('');

  // Sensor data
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<string>('all');

  // Sensor detail modal
  const [selectedSensor, setSelectedSensor] = useState<{
    type: string;
    title: string;
    unit: string;
    icon: React.ReactNode;
    value: any;
  } | null>(null);

  // User settings
  const [userProfile, setUserProfile] = useState({
    displayName: '',
    email: user?.email || '',
    phone: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [settingsError, setSettingsError] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);

  // Check user profile completion and email verification
  useEffect(() => {
    if (user) {
      setEmailVerified(user.emailVerified);
      // Load user profile from Firebase
      const userRef = ref(db, `users/${user.uid}`);
      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setUserProfile(prev => ({
            ...prev,
            displayName: data.displayName || user.displayName || '',
            phone: data.phone || ''
          }));
          // Check if profile is complete
          setProfileComplete(!!(data.displayName && data.phone && user.emailVerified));
        }
      });
    }
  }, [user]);

  // Load stations from Firebase
  useEffect(() => {
    if (!db) return;

    const stationsRef = ref(db, 'stations');
    const unsubscribe = onValue(stationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const stationsList: Station[] = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setStations(stationsList);
      } else {
        // No default stations - admin must add them
        setStations([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Load sensor data
  useEffect(() => {
    if (!db) {
      console.warn('Firebase database not initialized');
      setLoading(false);
      setConnected(false);
      return;
    }

    if (!userDevices || userDevices.length === 0) {
      console.log('No devices assigned to user');
      setSensorData([]);
      setLoading(false);
      setConnected(false);
      return;
    }

    const sensorDataRef = ref(db, 'sensor_data');
    const recentQuery = query(sensorDataRef, limitToLast(100));

    const unsubscribe = onValue(recentQuery, (snapshot) => {
      const data: SensorData[] = [];
      const val = snapshot.val();

      if (val) {
        Object.keys(val).forEach((key) => {
          const sensorData = val[key];
          // Filter data to only show user's devices
          if (userDevices.includes(sensorData.device_id)) {
            data.push({
              id: key,
              ...sensorData
            } as SensorData);
          }
        });

        data.sort((a, b) => {
          const timeA = new Date(a.timestamp || a.received_at || 0).getTime();
          const timeB = new Date(b.timestamp || b.received_at || 0).getTime();
          return timeB - timeA;
        });

        setLastUpdate(new Date());
      }

      setSensorData(data);
      setLoading(false);
      setConnected(true);
    }, (error) => {
      console.error('Error fetching data:', error);
      setLoading(false);
      setConnected(false);
    });

    return () => unsubscribe();
  }, [refreshing, userDevices]);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleAddStation = async () => {
    // Check if email is verified before allowing station addition
    if (!emailVerified) {
      setActive('settings');
      return;
    }

    if (!newStation.name || !newStation.location) return;

    const station: Station = {
      id: newStation.name.toLowerCase().replace(/\s+/g, '-'),
      name: newStation.name,
      location: newStation.location,
      status: 'inactive',
      lastUpdate: new Date().toISOString()
    };

    if (db) {
      const stationsRef = ref(db, `stations/${station.id}`);
      await set(stationsRef, station);
    }

    setStations([...stations, station]);
    setNewStation({ name: '', location: '' });
    setShowAddStation(false);
  };

  const handleDeleteStation = async (stationId: string) => {
    // Check if email is verified before allowing station deletion
    if (!emailVerified) {
      setActive('settings');
      return;
    }

    if (db) {
      const stationRef = ref(db, `stations/${stationId}`);
      await remove(stationRef);
    }
    setStations(stations.filter(s => s.id !== stationId));
  };

  const handleUpdateStation = async (station: Station) => {
    // Check if email is verified before allowing station updates
    if (!emailVerified) {
      setActive('settings');
      return;
    }

    if (db) {
      const stationRef = ref(db, `stations/${station.id}`);
      await set(stationRef, station);
    }
    setStations(stations.map(s => s.id === station.id ? station : s));
    setEditingStation(null);
  };

  const handleSaveSettings = async () => {
    setSettingsError('');
    setSettingsSaved(false);

    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        setSettingsError('User not authenticated');
        return;
      }

      // Update display name if changed
      if (userProfile.displayName && userProfile.displayName !== currentUser.displayName) {
        await updateProfile(currentUser, {
          displayName: userProfile.displayName
        });
      }

      // Save user profile to database
      if (db) {
        const userRef = ref(db, `users/${currentUser.uid}`);
        await set(userRef, {
          displayName: userProfile.displayName,
          email: currentUser.email,
          phone: userProfile.phone,
          updatedAt: new Date().toISOString()
        });
      }

      // Update password if provided
      if (userProfile.newPassword && userProfile.confirmPassword) {
        if (userProfile.newPassword !== userProfile.confirmPassword) {
          setSettingsError('Passwords do not match');
          return;
        }
        if (userProfile.newPassword.length < 6) {
          setSettingsError('Password must be at least 6 characters');
          return;
        }
        await updatePassword(currentUser, userProfile.newPassword);
        // Clear password fields after successful update
        setUserProfile(prev => ({ ...prev, newPassword: '', confirmPassword: '' }));
      }

      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 3000);

      // Check if profile is now complete
      setProfileComplete(!!(userProfile.displayName && userProfile.phone && currentUser.emailVerified));
    } catch (error: any) {
      console.error('Error saving settings:', error);
      if (error.code === 'auth/requires-recent-login') {
        setSettingsError('Please log out and log in again to change your password');
      } else {
        setSettingsError(error.message || 'Failed to save settings');
      }
    }
  };

  const handleSendVerificationEmail = async () => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (currentUser) {
        await sendEmailVerification(currentUser);
        setVerificationSent(true);
        setTimeout(() => setVerificationSent(false), 5000);
      }
    } catch (error: any) {
      console.error('Error sending verification email:', error);
      setSettingsError('Failed to send verification email. Please try again.');
    }
  };

  const isValidSensorData = (data: SensorData): boolean => {
    // Validate sensor ranges to filter out unrealistic values
    const temp = data.temperature_C ?? data.temperature ?? 0;
    const humidity = data.humidity_ ?? data.humidity ?? 0;
    const wind = data.wind_m_s ?? 0;
    const rain = data.rainrate_mm_h ?? data.rainfall ?? 0;

    // Check for realistic ranges
    if (temp < -50 || temp > 60) return false; // Realistic temperature range
    if (humidity < 0 || humidity > 100) return false; // Humidity percentage
    if (wind < 0 || wind > 50) return false; // Wind speed m/s (50 m/s = 180 km/h is extreme)
    if (rain < 0 || rain > 300) return false; // Rain rate mm/h (300 is extreme)

    return true;
  };

  const getLatestData = (stationId?: string) => {
    let data;
    if (stationId) {
      data = sensorData.find(d => d.device_id === stationId && isValidSensorData(d)) || sensorData[0];
    } else {
      data = sensorData.find(d => isValidSensorData(d)) || sensorData[0];
    }

    // Normalize field names for compatibility
    if (data) {
      return {
        ...data,
        temperature_C: data.temperature_C ?? data.temperature ?? 0,
        humidity_: data.humidity_ ?? data.humidity ?? 0,
        wind_m_s: data.wind_m_s ?? 0,
        wind_kmh: data.wind_kmh ?? 0,
        rainrate_mm_h: data.rainrate_mm_h ?? data.rainfall ?? 0,
        light_lux: data.light_lux ?? 0,
        sol_voltage_V: data.sol_voltage_V ?? 0,
        sol_current_mA: data.sol_current_mA ?? 0,
        sol_power_W: data.sol_power_W ?? 0
      };
    }
    return data;
  };

  const getChartData = (stationId?: string) => {
    const filteredData = stationId
      ? sensorData.filter(d => d.device_id === stationId)
      : sensorData;

    return filteredData
      .slice(0, 24)
      .reverse()
      .filter((d) => {
        // Only include data with valid timestamps
        const timestamp = d.timestamp || d.received_at || '';
        let date = new Date(timestamp);

        // Try parsing as Unix timestamp if initial parse fails
        if (isNaN(date.getTime()) && typeof timestamp === 'number') {
          date = new Date(timestamp * 1000);
          if (isNaN(date.getTime())) {
            date = new Date(timestamp);
          }
        }

        return !isNaN(date.getTime());
      })
      .map((d) => {
        const timestamp = d.timestamp || d.received_at || '';
        let date = new Date(timestamp);

        // Try parsing as Unix timestamp if initial parse fails
        if (isNaN(date.getTime()) && typeof timestamp === 'number') {
          date = new Date(timestamp * 1000);
          if (isNaN(date.getTime())) {
            date = new Date(timestamp);
          }
        }

        const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        return {
          time,
          temperature: d.temperature_C,
          humidity: d.humidity_,
          wind_kmh: d.wind_kmh,
          wind_ms: d.wind_m_s,
          rain: d.rainrate_mm_h,
          light: d.light_lux,
          voltage: d.sol_voltage_V,
          current: d.sol_current_mA,
          power: d.sol_power_W
        };
      });
  };

  const renderContent = () => {
    // Check if profile is complete before allowing access to certain sections
    if (!profileComplete && active !== 'settings') {
      if (active === 'dashboard' || active === 'drone-control') {
        return (
          <div className="flex items-center justify-center min-h-[60vh] p-4">
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 max-w-md w-full">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-8 h-8 text-yellow-500" />
                <h2 className="text-xl font-bold text-gray-800">Complete Your Profile</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Please complete your profile and verify your email to access this section.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2">
                  {userProfile.displayName ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                  )}
                  <span className="text-sm">Display Name {userProfile.displayName ? 'Added' : 'Required'}</span>
                </div>
                <div className="flex items-center gap-2">
                  {userProfile.phone ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                  )}
                  <span className="text-sm">Phone Number {userProfile.phone ? 'Added' : 'Required'}</span>
                </div>
                <div className="flex items-center gap-2">
                  {emailVerified ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                  )}
                  <span className="text-sm">Email {emailVerified ? 'Verified' : 'Verification Required'}</span>
                </div>
              </div>
              <Button
                onClick={() => setActive('settings')}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Go to Settings
              </Button>
            </div>
          </div>
        );
      }
    }

    switch(active) {
      case 'dashboard':
        const latestData = getLatestData();
        const chartData = getChartData();

        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">Farm Overview</h2>
                <Button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="flex items-center gap-2"
                  variant="outline"
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  {refreshing ? 'Refreshing...' : 'Refresh'}
                </Button>
              </div>

              {/* Active Stations Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Your IoT Device</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-bold text-green-600">
                      {userDevices && userDevices.length > 0 ? userDevices[0] : 'Not Assigned'}
                    </div>
                    <p className="text-xs text-gray-500">Primary sensor device</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Your Drone ID</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-bold text-blue-600">
                      {userDrone || 'Not Assigned'}
                    </div>
                    <p className="text-xs text-gray-500">Agricultural drone</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Connection Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      {connected ? (
                        <><Wifi className="w-5 h-5 text-green-500" /><span className="text-lg font-bold text-green-600">Online</span></>
                      ) : (
                        <><WifiOff className="w-5 h-5 text-red-500" /><span className="text-lg font-bold text-red-600">Offline</span></>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{lastUpdate ? `Updated ${lastUpdate.toLocaleTimeString()}` : 'No data'}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Total Readings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl md:text-2xl font-bold">{sensorData.length}</div>
                    <p className="text-xs text-gray-500">Last 24 hours</p>
                  </CardContent>
                </Card>
              </div>

              {/* Weather Sensors */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Weather Conditions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card
                    className="cursor-pointer hover:shadow-lg transition-shadow relative group"
                    onClick={() => setSelectedSensor({
                      type: 'temperature',
                      title: 'Temperature',
                      unit: '°C',
                      icon: <Thermometer className="w-5 h-5 text-red-500" />,
                      value: latestData?.temperature_C?.toFixed(1) || '--'
                    })}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                        Temperature
                        <Eye className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl md:text-2xl font-bold flex items-center gap-2">
                        <Thermometer className="w-5 h-5 text-red-500" />
                        {latestData?.temperature_C?.toFixed(1) || '--'}°C
                      </div>
                      <p className="text-xs text-gray-500">Current reading • Click for details</p>
                    </CardContent>
                  </Card>

                  <Card
                    className="cursor-pointer hover:shadow-lg transition-shadow relative group"
                    onClick={() => setSelectedSensor({
                      type: 'humidity',
                      title: 'Humidity',
                      unit: '%',
                      icon: <Droplets className="w-5 h-5 text-blue-500" />,
                      value: latestData?.humidity_?.toFixed(0) || '--'
                    })}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                        Humidity
                        <Eye className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl md:text-2xl font-bold flex items-center gap-2">
                        <Droplets className="w-5 h-5 text-blue-500" />
                        {latestData?.humidity_?.toFixed(0) || '--'}%
                      </div>
                      <p className="text-xs text-gray-500">Relative humidity • Click for details</p>
                    </CardContent>
                  </Card>

                  <Card
                    className="cursor-pointer hover:shadow-lg transition-shadow relative group"
                    onClick={() => setSelectedSensor({
                      type: 'wind',
                      title: 'Wind Speed',
                      unit: 'm/s',
                      icon: <Wind className="w-5 h-5 text-gray-500" />,
                      value: latestData?.wind_m_s?.toFixed(1) || '--'
                    })}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                        Wind Speed
                        <Eye className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl md:text-2xl font-bold flex items-center gap-2">
                        <Wind className="w-5 h-5 text-gray-500" />
                        {latestData?.wind_m_s?.toFixed(1) || '--'} m/s
                      </div>
                      <p className="text-xs text-gray-500">Anemometer Digital</p>
                    </CardContent>
                  </Card>

                  <Card
                    className="cursor-pointer hover:shadow-lg transition-shadow relative group"
                    onClick={() => setSelectedSensor({
                      type: 'rain',
                      title: 'Rainfall',
                      unit: 'mm',
                      icon: <CloudRain className="w-5 h-5 text-blue-600" />,
                      value: latestData?.rainrate_mm_h?.toFixed(1) || '--'
                    })}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                        Rainfall
                        <Eye className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl md:text-2xl font-bold flex items-center gap-2">
                        <CloudRain className="w-5 h-5 text-blue-600" />
                        {latestData?.rainrate_mm_h?.toFixed(1) || '--'} mm
                      </div>
                      <p className="text-xs text-gray-500">Per tip • Click for details</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Solar & Light Sensors */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Solar & Light Monitoring</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card
                    className="cursor-pointer hover:shadow-lg transition-shadow relative group"
                    onClick={() => setSelectedSensor({
                      type: 'light',
                      title: 'Light Intensity',
                      unit: 'Lux',
                      icon: <Sun className="w-5 h-5 text-yellow-500" />,
                      value: latestData?.light_lux?.toFixed(0) || '--'
                    })}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                        Light Intensity
                        <Eye className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl md:text-2xl font-bold flex items-center gap-2">
                        <Sun className="w-5 h-5 text-yellow-500" />
                        {latestData?.light_lux?.toFixed(0) || '--'}
                      </div>
                      <p className="text-xs text-gray-500">Lux • Click for details</p>
                    </CardContent>
                  </Card>

                  <Card
                    className="cursor-pointer hover:shadow-lg transition-shadow relative group"
                    onClick={() => setSelectedSensor({
                      type: 'voltage',
                      title: 'Solar Voltage',
                      unit: 'V',
                      icon: <Battery className="w-5 h-5 text-green-500" />,
                      value: latestData?.sol_voltage_V?.toFixed(1) || '--'
                    })}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                        Solar Voltage
                        <Eye className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl md:text-2xl font-bold flex items-center gap-2">
                        <Battery className="w-5 h-5 text-green-500" />
                        {latestData?.sol_voltage_V?.toFixed(1) || '--'} V
                      </div>
                      <p className="text-xs text-gray-500">Panel voltage • Click for details</p>
                    </CardContent>
                  </Card>

                  <Card
                    className="cursor-pointer hover:shadow-lg transition-shadow relative group"
                    onClick={() => setSelectedSensor({
                      type: 'current',
                      title: 'Solar Current',
                      unit: 'mA',
                      icon: <Gauge className="w-5 h-5 text-orange-500" />,
                      value: latestData?.sol_current_mA?.toFixed(0) || '--'
                    })}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                        Solar Current
                        <Eye className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl md:text-2xl font-bold flex items-center gap-2">
                        <Gauge className="w-5 h-5 text-orange-500" />
                        {latestData?.sol_current_mA?.toFixed(0) || '--'} mA
                      </div>
                      <p className="text-xs text-gray-500">Current flow • Click for details</p>
                    </CardContent>
                  </Card>

                  <Card
                    className="cursor-pointer hover:shadow-lg transition-shadow relative group"
                    onClick={() => setSelectedSensor({
                      type: 'solar',
                      title: 'Solar Power',
                      unit: 'W',
                      icon: <Zap className="w-5 h-5 text-purple-500" />,
                      value: latestData?.sol_power_W?.toFixed(2) || '--'
                    })}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                        Solar Power
                        <Eye className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl md:text-2xl font-bold flex items-center gap-2">
                        <Zap className="w-5 h-5 text-purple-500" />
                        {latestData?.sol_power_W?.toFixed(2) || '--'} W
                      </div>
                      <p className="text-xs text-gray-500">Power generation • Click for details</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Weather Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Weather Trends (24 Hours)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="temperature" stroke="#ef4444" name="Temperature (°C)" strokeWidth={2} />
                        <Line type="monotone" dataKey="humidity" stroke="#3b82f6" name="Humidity (%)" strokeWidth={2} />
                        <Line type="monotone" dataKey="rain" stroke="#06b6d4" name="Rainfall (mm)" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Wind Monitoring (24 Hours)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="wind_kmh" stroke="#8b5cf6" name="Wind (km/h)" strokeWidth={2} />
                        <Line type="monotone" dataKey="wind_ms" stroke="#10b981" name="Wind (m/s)" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Solar Power Generation (24 Hours)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Line yAxisId="left" type="monotone" dataKey="power" stroke="#a855f7" name="Power (W)" strokeWidth={2} />
                        <Line yAxisId="left" type="monotone" dataKey="voltage" stroke="#22c55e" name="Voltage (V)" strokeWidth={2} />
                        <Line yAxisId="right" type="monotone" dataKey="current" stroke="#f97316" name="Current (mA)" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Light Intensity (24 Hours)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="light" stroke="#fbbf24" name="Light (Lux)" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Station Status Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {stations.map(station => (
                  <Card key={station.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{station.name}</CardTitle>
                          <CardDescription className="flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" />
                            {station.location}
                          </CardDescription>
                        </div>
                        <Badge variant={station.status === 'active' ? 'default' : 'secondary'}>
                          {station.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {station.status === 'active' ? (
                            <Wifi className="w-4 h-4 text-green-500" />
                          ) : (
                            <WifiOff className="w-4 h-4 text-gray-400" />
                          )}
                          <span className="text-sm text-gray-600">
                            {station.status === 'active' ? 'Online' : 'Offline'}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setActive(station.id)}
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Real-time Sensor Data Table */}
              <Card className="mt-6">
                <CardHeader>
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Latest 10 Sensor Readings</CardTitle>
                        {lastUpdate && (
                          <p className="text-sm text-gray-500 mt-1">
                            Last updated: {lastUpdate.toLocaleTimeString()}
                          </p>
                        )}
                      </div>
                      <Badge variant={loading ? "secondary" : connected ? "default" : "secondary"}>
                        {loading ? 'Loading...' : connected ? 'Connected' : 'Disconnected'}
                      </Badge>
                    </div>
                    {userDevices && userDevices.length > 1 && (
                      <div className="flex items-center gap-2">
                        <Label htmlFor="device-select" className="text-sm font-medium">Device:</Label>
                        <Select value={selectedDevice} onValueChange={setSelectedDevice}>
                          <SelectTrigger id="device-select" className="w-[200px]">
                            <SelectValue placeholder="Select device" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Devices</SelectItem>
                            {userDevices.map(device => (
                              <SelectItem key={device} value={device}>
                                {device}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temp</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Humidity</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wind</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rain</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Light</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solar</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {sensorData
                          .filter(data => selectedDevice === 'all' || data.device_id === selectedDevice)
                          .slice(0, 10)
                          .map((data, index) => (
                          <tr key={data.id || `sensor-${index}-${data.timestamp}`} className="hover:bg-gray-50">
                            <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                              {data.device_id}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                              {(() => {
                                const timestamp = data.timestamp || data.received_at || '';
                                let date = new Date(timestamp);

                                // Try parsing as Unix timestamp if initial parse fails
                                if (isNaN(date.getTime()) && typeof timestamp === 'number') {
                                  date = new Date(timestamp * 1000);
                                  if (isNaN(date.getTime())) {
                                    date = new Date(timestamp);
                                  }
                                }

                                return !isNaN(date.getTime())
                                  ? date.toLocaleString('en-US', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                      second: '2-digit'
                                    })
                                  : '--';
                              })()}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                              {data.temperature_C != null ? `${data.temperature_C.toFixed(1)}°C` : '--'}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                              {data.humidity_ != null ? `${data.humidity_.toFixed(0)}%` : '--'}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                              {data.wind_m_s != null ? `${data.wind_m_s.toFixed(1)} m/s` : '--'}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                              {data.rainrate_mm_h != null ? `${data.rainrate_mm_h.toFixed(1)} mm` : '--'}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                              {data.light_lux != null ? `${data.light_lux.toFixed(0)} lux` : '--'}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                              {data.sol_power_W != null ? `${data.sol_power_W.toFixed(2)} W` : '--'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {sensorData.length === 0 && !loading && (
                      <div className="text-center py-8 text-gray-500">
                        No sensor data available. Waiting for sensor readings...
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* AI Recommendations Panel */}
              <div className="mt-6">
                <AIRecommendationsPanel />
              </div>
            </div>
          </div>
        );

      case 'drone':
        // Check if profile is complete before showing drone control
        if (!profileComplete) {
          return (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Drone Control Center</h2>
                <div className="bg-orange-50 border-l-4 border-orange-400 p-4">
                  <div className="flex items-center">
                    <AlertCircle className="h-6 w-6 text-orange-400 mr-3" />
                    <div>
                      <p className="text-sm text-orange-700 font-medium">Complete Your Profile</p>
                      <p className="text-sm text-orange-600 mt-1">Please complete your profile and verify your email to access this section.</p>
                      <div className="mt-3 space-y-1">
                        <p className="text-xs text-gray-600">
                          {userProfile.displayName ? '✓' : '✗'} Display Name {userProfile.displayName ? 'Added' : 'Required'}
                        </p>
                        <p className="text-xs text-gray-600">
                          {userProfile.phone ? '✓' : '✗'} Phone Number {userProfile.phone ? 'Added' : 'Required'}
                        </p>
                        <p className="text-xs text-gray-600">
                          {emailVerified ? '✓' : '✗'} Email Verification {emailVerified ? 'Completed' : 'Required'}
                        </p>
                      </div>
                      <Button
                        onClick={() => setActive('settings')}
                        className="mt-4 bg-orange-500 hover:bg-orange-600 text-white"
                      >
                        Go to Settings
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        }
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Drone Control Center</h2>
              <DroneControl />
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">User Settings</h2>

              {/* Profile Completion Status */}
              {!profileComplete && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-yellow-800">Complete Your Profile</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        Please fill in all required information and verify your email to access all features.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-6 max-w-2xl">
                {/* Email Verification Status */}
                {!emailVerified && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-semibold text-blue-800">Email Verification Required</p>
                          <p className="text-sm text-blue-700">Verify your email to unlock all features</p>
                        </div>
                      </div>
                      <Button
                        onClick={handleSendVerificationEmail}
                        variant="outline"
                        className="border-blue-600 text-blue-600 hover:bg-blue-50"
                      >
                        Send Verification Email
                      </Button>
                    </div>
                    {verificationSent && (
                      <p className="text-sm text-green-600 mt-3 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Verification email sent! Check your inbox.
                      </p>
                    )}
                  </div>
                )}

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700">Profile Information</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="displayName">
                        Display Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="displayName"
                        value={userProfile.displayName}
                        onChange={(e) => setUserProfile({...userProfile, displayName: e.target.value})}
                        placeholder="Your name"
                        className={!userProfile.displayName ? 'border-yellow-400' : ''}
                      />
                      {!userProfile.displayName && (
                        <p className="text-xs text-yellow-600 mt-1">Required for full access</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Input
                          id="email"
                          type="email"
                          value={userProfile.email}
                          disabled
                          className="bg-gray-50 pr-10"
                        />
                        {emailVerified ? (
                          <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                        ) : (
                          <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-500" />
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phone">
                        Phone Number <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={userProfile.phone}
                        onChange={(e) => setUserProfile({...userProfile, phone: e.target.value})}
                        placeholder="+62 xxx-xxxx-xxxx"
                        className={!userProfile.phone ? 'border-yellow-400' : ''}
                      />
                      {!userProfile.phone && (
                        <p className="text-xs text-yellow-600 mt-1">Required for full access</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Change Password</h3>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={userProfile.newPassword}
                        onChange={(e) => setUserProfile({...userProfile, newPassword: e.target.value})}
                        placeholder="Enter new password (min. 6 characters)"
                      />
                    </div>

                    <div>
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={userProfile.confirmPassword}
                        onChange={(e) => setUserProfile({...userProfile, confirmPassword: e.target.value})}
                        placeholder="Confirm new password"
                        className={
                          userProfile.confirmPassword && userProfile.newPassword !== userProfile.confirmPassword
                            ? 'border-red-400'
                            : ''
                        }
                      />
                      {userProfile.confirmPassword && userProfile.newPassword !== userProfile.confirmPassword && (
                        <p className="text-xs text-red-600 mt-1">Passwords do not match</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {settingsError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 flex items-center gap-2">
                      <X className="w-4 h-4" />
                      {settingsError}
                    </p>
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <Button
                    onClick={handleSaveSettings}
                    className="bg-green-600 hover:bg-green-700"
                    disabled={
                      (userProfile.newPassword && userProfile.newPassword !== userProfile.confirmPassword) ||
                      (userProfile.newPassword && userProfile.newPassword.length < 6)
                    }
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                  {settingsSaved && (
                    <p className="text-green-600 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Settings saved successfully!
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        // Individual station view
        const station = stations.find(s => s.id === active);
        if (station) {
          const stationData = getLatestData(station.id);
          const stationChartData = getChartData(station.id);

          return (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800">{station.name}</h2>
                    <p className="text-gray-600 flex items-center gap-2 mt-1">
                      <MapPin className="w-4 h-4" />
                      {station.location}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingStation(station)}
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteStation(station.id)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>

                {/* Weather Metrics */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">Weather Conditions</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Temperature</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-xl md:text-2xl font-bold flex items-center gap-2">
                          <Thermometer className="w-5 h-5 text-red-500" />
                          {stationData?.temperature_C?.toFixed(1) || '--'}°C
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Humidity</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-xl md:text-2xl font-bold flex items-center gap-2">
                          <Droplets className="w-5 h-5 text-blue-500" />
                          {stationData?.humidity_?.toFixed(0) || '--'}%
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Wind Speed</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-xl md:text-2xl font-bold flex items-center gap-2">
                          <Wind className="w-5 h-5 text-gray-500" />
                          {stationData?.wind_m_s?.toFixed(1) || '--'} m/s
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Rainfall</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-xl md:text-2xl font-bold flex items-center gap-2">
                          <CloudRain className="w-5 h-5 text-blue-600" />
                          {stationData?.rainrate_mm_h?.toFixed(1) || '--'} mm
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Solar & Light Metrics */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">Solar & Light Monitoring</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Light Intensity</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-xl md:text-2xl font-bold flex items-center gap-2">
                          <Sun className="w-5 h-5 text-yellow-500" />
                          {stationData?.light_lux?.toFixed(0) || '--'} Lux
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Solar Voltage</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-xl md:text-2xl font-bold flex items-center gap-2">
                          <Battery className="w-5 h-5 text-green-500" />
                          {stationData?.sol_voltage_V?.toFixed(1) || '--'} V
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Solar Current</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-xl md:text-2xl font-bold flex items-center gap-2">
                          <Gauge className="w-5 h-5 text-orange-500" />
                          {stationData?.sol_current_mA?.toFixed(0) || '--'} mA
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Solar Power</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-xl md:text-2xl font-bold flex items-center gap-2">
                          <Zap className="w-5 h-5 text-purple-500" />
                          {stationData?.sol_power_W?.toFixed(2) || '--'} W
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Station Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Weather Trends</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={stationChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="temperature" stroke="#ef4444" name="Temperature (°C)" strokeWidth={2} />
                          <Line type="monotone" dataKey="humidity" stroke="#3b82f6" name="Humidity (%)" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Solar Power Generation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={stationChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" />
                          <YAxis yAxisId="left" />
                          <YAxis yAxisId="right" orientation="right" />
                          <Tooltip />
                          <Legend />
                          <Line yAxisId="left" type="monotone" dataKey="power" stroke="#a855f7" name="Power (W)" strokeWidth={2} />
                          <Line yAxisId="left" type="monotone" dataKey="voltage" stroke="#22c55e" name="Voltage (V)" strokeWidth={2} />
                          <Line yAxisId="right" type="monotone" dataKey="light" stroke="#fbbf24" name="Light (Lux)" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          );
        }

        // Add Station View
        if (active === 'add-station') {
          return (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">Add New Weather Station</h2>

                <div className="max-w-full md:max-w-md space-y-4">
                  <div>
                    <Label htmlFor="station-name">Station Name</Label>
                    <Input
                      id="station-name"
                      value={newStation.name}
                      onChange={(e) => setNewStation({...newStation, name: e.target.value})}
                      placeholder="e.g., East Greenhouse"
                    />
                  </div>

                  <div>
                    <Label htmlFor="station-location">Location</Label>
                    <Input
                      id="station-location"
                      value={newStation.location}
                      onChange={(e) => setNewStation({...newStation, location: e.target.value})}
                      placeholder="e.g., Greenhouse Block D4"
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button onClick={handleAddStation} className="bg-green-600 hover:bg-green-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Station
                    </Button>
                    <Button variant="outline" onClick={() => setActive('dashboard')}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        return null;
    }
  };


  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-neutral-50 relative">
        {/* Mobile Menu Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 h-screen w-64 bg-[#2ecc71] border-r border-green-300 shadow-md flex flex-col py-6 px-4 z-50 transition-transform duration-300 overflow-y-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
            <div className="mb-8 flex justify-between items-center">
              <Link href="/" className="hover:opacity-80 transition-opacity">
                <Image src="/images/logo.png" alt="Logo" width={80} height={80} className="rounded-full mx-auto lg:mx-0 cursor-pointer" />
              </Link>
              <button
                className="lg:hidden text-white hover:bg-white/20 p-2 rounded-lg"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex-1 flex flex-col gap-1">
              <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-md text-base font-normal transition-all duration-150 text-left hover:bg-green-100 text-green-900 mb-2 border border-green-600">
                <ArrowLeft className="w-5 h-5" />
                <span className="truncate font-normal">Back to Home</span>
              </Link>

              <button
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-base font-normal transition-all duration-150 text-left ${
                  active === 'dashboard' ? 'bg-white/80 text-green-900 shadow-sm' : 'hover:bg-green-100 text-green-900'
                }`}
                onClick={() => {
                  setActive('dashboard');
                  setSidebarOpen(false);
                }}
              >
                <Home className="w-5 h-5" />
                <span className="truncate font-normal">Dashboard</span>
              </button>

              <button
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-base font-normal transition-all duration-150 text-left ${
                  !profileComplete ? 'opacity-50 cursor-not-allowed bg-gray-100' :
                  active === 'drone' ? 'bg-white/80 text-green-900 shadow-sm' : 'hover:bg-green-100 text-green-900'
                }`}
                onClick={() => {
                  if (!profileComplete) {
                    setActive('settings');
                  } else {
                    setActive('drone');
                  }
                }}
                title={!profileComplete ? 'Complete profile required' : 'Drone Control'}
              >
                <Plane className="w-5 h-5" />
                <span className="truncate font-normal">Drone Control</span>
                {!profileComplete && <AlertCircle className="w-4 h-4 ml-auto text-orange-500" />}
              </button>

              <div className="mt-3 mb-1">
                <div className="text-xs font-semibold uppercase tracking-wide text-green-100 mb-2">Stasiun Cuaca</div>
                {stations.length > 3 && (
                  <div className="px-3 py-1 mb-2">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-green-700" />
                      <input
                        type="text"
                        placeholder="Search stations..."
                        value={stationSearchTerm}
                        onChange={(e) => setStationSearchTerm(e.target.value)}
                        className="w-full pl-8 pr-3 py-1 text-sm rounded-md bg-white/90 text-green-900 placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {stations
                .filter(station =>
                  station.name.toLowerCase().includes(stationSearchTerm.toLowerCase()) ||
                  station.location.toLowerCase().includes(stationSearchTerm.toLowerCase())
                )
                .map((station) => (
                <button
                  key={station.id}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-normal transition-all duration-150 text-left ${
                    active === station.id ? 'bg-white/80 text-green-900 shadow-sm' : 'hover:bg-green-100 text-green-900'
                  }`}
                  onClick={() => {
                    setActive(station.id);
                    setSidebarOpen(false);
                  }}
                >
                  <span className={`w-2 h-2 rounded-full ${station.status === 'active' ? 'bg-green-600' : 'bg-gray-300'}`}></span>
                  <span className="truncate font-normal">{station.name}</span>
                </button>
              ))}

              {stationSearchTerm && stations.filter(station =>
                station.name.toLowerCase().includes(stationSearchTerm.toLowerCase()) ||
                station.location.toLowerCase().includes(stationSearchTerm.toLowerCase())
              ).length === 0 && (
                <div className="px-3 py-2 text-sm text-green-100 text-center">
                  No stations found
                </div>
              )}

              <button
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-normal transition-all duration-150 text-left mt-3 ${
                  !emailVerified ? 'opacity-50 cursor-not-allowed bg-gray-100' :
                  active === 'add-station' ? 'bg-white/80 text-green-900 shadow-sm' : 'hover:bg-green-100 text-green-900'
                }`}
                onClick={() => {
                  if (!emailVerified) {
                    setActive('settings');
                  } else {
                    setActive('add-station');
                  }
                }}
                title={!emailVerified ? 'Email verification required' : 'Add new station'}
              >
                <Plus className="w-5 h-5" />
                <span className="truncate font-normal">Tambah Stasiun</span>
                {!emailVerified && <AlertCircle className="w-4 h-4 ml-auto text-orange-500" />}
              </button>
            </nav>

            <div className="p-4 border-t border-green-600/20 space-y-1 mt-auto">
              {/* User Profile Info */}
              <div className="mb-3 px-3 py-2 bg-white/10 rounded-lg">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-green-100" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {userProfile.displayName || 'Set Your Name'}
                    </p>
                    <p className="text-green-100 text-xs truncate">{user?.email}</p>
                  </div>
                  {!emailVerified && (
                    <span title="Email not verified">
                      <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                    </span>
                  )}
                </div>
              </div>

              {isAdmin && (
                <button
                  className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm w-full transition-all duration-150 text-left bg-yellow-500/20 hover:bg-yellow-500/30 text-white"
                  onClick={() => router.push('/admin')}
                >
                  <Shield className="w-4 h-4" />
                  <span className="font-medium">Admin Panel</span>
                </button>
              )}

              <button
                className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm w-full transition-all duration-150 text-left ${
                  active === 'settings' ? 'bg-white text-green-800 shadow-lg' : 'hover:bg-white/20 text-white'
                }`}
                onClick={() => {
                  setActive('settings');
                  setSidebarOpen(false);
                }}
              >
                <Settings className="w-4 h-4" />
                <span className="font-medium">Settings</span>
                {!profileComplete && (
                  <span className="ml-auto w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                )}
              </button>

              <button
                className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm hover:bg-red-500/20 text-white w-full transition-all duration-150 text-left"
                onClick={() => logout()}
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
        </aside>

        {/* Main Content */}
        <main className="lg:ml-64 min-h-screen p-4 sm:p-6 md:p-8 lg:p-12">
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-green-600 text-white rounded-lg shadow-lg"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-xl">Loading dashboard data...</div>
              </div>
            ) : (
              renderContent()
            )}
        </main>

        {/* Edit Station Modal */}
        {editingStation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-4 sm:p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Edit Station</h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">Station Name</Label>
                  <Input
                    id="edit-name"
                    value={editingStation.name}
                    onChange={(e) => setEditingStation({...editingStation, name: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="edit-location">Location</Label>
                  <Input
                    id="edit-location"
                    value={editingStation.location}
                    onChange={(e) => setEditingStation({...editingStation, location: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="edit-status">Status</Label>
                  <select
                    id="edit-status"
                    className="w-full border rounded-md p-2"
                    value={editingStation.status}
                    onChange={(e) => setEditingStation({...editingStation, status: e.target.value as 'active' | 'inactive'})}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <Button onClick={() => handleUpdateStation(editingStation)} className="bg-green-600 hover:bg-green-700">
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setEditingStation(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Sensor Detail Modal */}
      {selectedSensor && (
        <SensorDetailModal
          isOpen={!!selectedSensor}
          onClose={() => setSelectedSensor(null)}
          sensorType={selectedSensor.type}
          sensorData={sensorData}
          currentValue={selectedSensor.value}
          unit={selectedSensor.unit}
          icon={selectedSensor.icon}
          title={selectedSensor.title}
        />
      )}
    </ProtectedRoute>
  );
}