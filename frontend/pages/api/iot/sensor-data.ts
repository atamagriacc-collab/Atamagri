import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../lib/firebase';
import { ref, push, serverTimestamp, get, query, orderByChild, limitToLast } from 'firebase/database';

interface SensorData {
  device_id: string;
  timestamp: string;
  wind_m_s?: number;
  wind_kmh?: number;
  rainrate_mm_h?: number;
  temperature_C?: number;
  humidity_?: number;
  'humidity_%'?: number; // Support both formats
  light_lux?: number;
  sol_voltage_V?: number;
  sol_current_mA?: number;
  sol_power_W?: number;
  signature?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Debug logging
  console.log('API Request:', { method: req.method, url: req.url });

  // Check if Firebase is configured
  if (!db) {
    return res.status(503).json({
      success: false,
      error: 'Firebase not configured - service unavailable'
    });
  }

  if (req.method === 'GET') {
    return handleGetRequest(req, res);
  } else if (req.method === 'POST') {
    return handlePostRequest(req, res);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({
      success: false,
      error: 'Method Not Allowed',
      received_method: req.method,
      expected_methods: ['GET', 'POST']
    });
  }
}

async function handleGetRequest(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { device_id, limit = '50' } = req.query;
    const limitNum = parseInt(limit as string) || 50;

    console.log('📥 GET request:', { device_id, limit: limitNum });

    const sensorDataRef = ref(db, 'sensor_data');
    const snapshot = await get(sensorDataRef);
    const data: any[] = [];

    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        const record = childSnapshot.val();
        // Filter by device_id if specified
        if (!device_id || record.device_id === device_id) {
          data.push({
            id: childSnapshot.key,
            ...record
          });
        }
      });
    }

    // Sort by received_at descending (most recent first)
    data.sort((a, b) => {
      const timeA = new Date(a.received_at || a.timestamp || 0).getTime();
      const timeB = new Date(b.received_at || b.timestamp || 0).getTime();
      return timeB - timeA;
    });

    // Apply limit after sorting
    const limitedData = data.slice(0, limitNum);

    console.log('✅ Retrieved sensor data:', {
      device_id: device_id || 'all',
      count: limitedData.length,
      total: data.length,
      latest_timestamp: limitedData[0]?.received_at || limitedData[0]?.timestamp
    });

    return res.status(200).json({
      success: true,
      data: limitedData,
      count: limitedData.length,
      total: data.length,
      device_id: device_id || 'all'
    });

  } catch (error: any) {
    console.error('❌ Error retrieving sensor data:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
}

async function handlePostRequest(req: NextApiRequest, res: NextApiResponse) {
  try {
    const data: SensorData = req.body;

    // Log incoming data for debugging
    console.log('📡 Incoming sensor data:', {
      device_id: data.device_id,
      timestamp: data.timestamp,
      fields: Object.keys(data).filter(k => k !== 'signature')
    });

    // Validasi basic
    if (!data.device_id) {
      console.error('❌ Missing device_id');
      return res.status(400).json({
        success: false,
        error: 'device_id is required'
      });
    }

    if (!data.timestamp) {
      console.error('❌ Missing timestamp');
      return res.status(400).json({
        success: false,
        error: 'timestamp is required'
      });
    }

    // Validasi signature sederhana (opsional untuk keamanan basic)
    const expectedSignature = generateSignature(data.device_id);
    if (data.signature && data.signature !== expectedSignature) {
      console.error('❌ Invalid signature for device:', data.device_id);
      return res.status(401).json({
        success: false,
        error: 'Invalid signature'
      });
    }

    // Normalize humidity field (handle both humidity_% and humidity_)
    const normalizedData: any = { ...data };
    if (data['humidity_%'] !== undefined && !data.humidity_) {
      normalizedData.humidity_ = data['humidity_%'];
      delete normalizedData['humidity_%'];
      console.log('✓ Normalized humidity_% to humidity_');
    }

    // Tambah timestamp server - keep original timestamp from ESP32
    const sensorRecord = {
      ...normalizedData,
      server_timestamp: serverTimestamp(),
      received_at: new Date().toISOString()
    };

    // Log sensor values
    console.log('📊 Sensor values:', {
      temperature: sensorRecord.temperature_C,
      humidity: sensorRecord.humidity_,
      wind_ms: sensorRecord.wind_m_s,
      wind_kmh: sensorRecord.wind_kmh,
      rain: sensorRecord.rainrate_mm_h,
      light: sensorRecord.light_lux,
      voltage: sensorRecord.sol_voltage_V,
      current: sensorRecord.sol_current_mA,
      power: sensorRecord.sol_power_W
    });

    // Simpan ke Realtime Database
    const sensorDataRef = ref(db, 'sensor_data');
    const newDataRef = await push(sensorDataRef, sensorRecord);

    console.log('✅ Data saved successfully:', {
      id: newDataRef.key,
      device_id: data.device_id
    });

    return res.status(200).json({
      success: true,
      id: newDataRef.key,
      message: 'Data saved successfully',
      device_id: data.device_id,
      received_at: sensorRecord.received_at
    });

  } catch (error: any) {
    console.error('❌ Error saving sensor data:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
}

// Simple signature generation untuk validasi basic
function generateSignature(device_id: string): string {
  const secret = process.env.IOT_SECRET || 'default-secret';
  return Buffer.from(device_id + secret).toString('base64').slice(0, 16);
}