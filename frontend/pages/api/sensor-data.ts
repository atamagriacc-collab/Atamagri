import { NextApiRequest, NextApiResponse } from 'next';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase, ref, push, set, get } from 'firebase/database';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase (avoid multiple initializations)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getDatabase(app);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check for IOT secret in headers
  const iotSecret = req.headers['x-iot-secret'] || req.headers['authorization'];
  if (iotSecret !== process.env.IOT_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Parse and validate sensor data
    const sensorData = req.body;

    // Validate required fields
    const requiredFields = [
      'device_id',
      'timestamp',
      'wind_m_s',
      'wind_kmh',
      'rainrate_mm_h',
      'temperature_C',
      'humidity_%',
      'light_lux',
      'sol_voltage_V',
      'sol_current_mA',
      'sol_power_W'
    ];

    for (const field of requiredFields) {
      if (!(field in sensorData)) {
        return res.status(400).json({
          error: `Missing required field: ${field}`,
          required: requiredFields
        });
      }
    }

    // Check if the device exists and is registered
    const deviceRef = ref(db, `devices/${sensorData.device_id}`);
    const deviceSnapshot = await get(deviceRef);

    if (!deviceSnapshot.exists()) {
      return res.status(403).json({
        error: 'Device not registered',
        message: `Device ${sensorData.device_id} is not registered in the system`
      });
    }

    const deviceData = deviceSnapshot.val();
    if (!deviceData.owner) {
      return res.status(403).json({
        error: 'Device has no owner',
        message: `Device ${sensorData.device_id} has no assigned owner`
      });
    }

    // Normalize the humidity field name
    const normalizedData = {
      ...sensorData,
      humidity_: sensorData['humidity_%'] || sensorData.humidity_,
      received_at: new Date().toISOString()
    };

    // Remove the old humidity_% field if it exists
    delete normalizedData['humidity_%'];

    // Push to Firebase Realtime Database
    const sensorDataRef = ref(db, 'sensor_data');
    const newDataRef = await push(sensorDataRef, normalizedData);

    // Update the latest reading for the specific user
    const userLatestRef = ref(db, `users/${deviceData.owner}/latest_reading`);
    await set(userLatestRef, normalizedData);

    // Update device status
    await set(deviceRef, {
      ...deviceData,
      last_seen: new Date().toISOString(),
      status: 'online',
      latest_data: normalizedData
    });

    console.log(`✅ Sensor data received from ${sensorData.device_id}`);

    return res.status(200).json({
      success: true,
      message: 'Sensor data received successfully',
      data_id: newDataRef.key,
      device_id: sensorData.device_id,
      timestamp: normalizedData.received_at
    });

  } catch (error) {
    console.error('Error processing sensor data:', error);
    return res.status(500).json({
      error: 'Failed to process sensor data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}