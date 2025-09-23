import type { NextApiRequest, NextApiResponse } from 'next';
import { aiService } from '../../lib/ai-service';

// Use client SDK in development to avoid credential issues
const isDevelopment = process.env.NODE_ENV === 'development';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // In development, use mock data for easier testing
    if (isDevelopment) {
      // Mock sensor data for development
      const mockSensorData = {
        temperature_C: 28,
        humidity_: 65,
        soil_moisture: 45,
        ph: 6.8,
        nitrogen: 30,
        phosphorus: 25,
        potassium: 35,
        wind_kmh: 15,
        rainrate_mm_h: 0,
        light_lux: 50000,
        sol_power_W: 120,
        sol_voltage_V: 18
      };

      if (req.method === 'GET') {
        const recommendations = await aiService.generateRecommendations(mockSensorData);
        return res.status(200).json({
          recommendations,
          analyzedAt: new Date().toISOString(),
          deviceCount: 1
        });
      }

      if (req.method === 'POST') {
        const { sensorData, analysisType } = req.body;
        const dataToAnalyze = sensorData || mockSensorData;
        const recommendations = await aiService.generateRecommendations(dataToAnalyze);

        if (analysisType === 'cropHealth') {
          const cropAnalysis = await aiService.analyzeCropHealth([dataToAnalyze]);
          return res.status(200).json({
            recommendations,
            cropAnalysis,
            analyzedAt: new Date().toISOString()
          });
        }

        return res.status(200).json({
          recommendations,
          analyzedAt: new Date().toISOString()
        });
      }
    }

    // Production code with Firebase Admin
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Import admin SDK only in production
    const { getAuth } = await import('firebase-admin/auth');
    const { getDatabase } = await import('firebase-admin/database');
    const { initAdmin } = await import('../../lib/firebase-admin');
    initAdmin();

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await getAuth().verifyIdToken(token);
    const userId = decodedToken.uid;
    const db = getDatabase();

    if (req.method === 'GET') {
      // Get latest sensor data for user's devices
      const userRef = db.ref(`users/${userId}`);
      const userSnapshot = await userRef.once('value');
      const userData = userSnapshot.val();

      if (!userData || !userData.devices) {
        return res.status(200).json({
          recommendations: [],
          message: 'No devices assigned to user'
        });
      }

      // Get device IDs
      const deviceIds = typeof userData.devices === 'object'
        ? Object.values(userData.devices)
        : [userData.devices];

      // Fetch latest sensor data for each device
      const sensorDataPromises = deviceIds.map(async (deviceId) => {
        const sensorRef = db.ref(`sensor_data/${deviceId}`);
        const snapshot = await sensorRef.orderByKey().limitToLast(1).once('value');
        return snapshot.val();
      });

      const allSensorData = await Promise.all(sensorDataPromises);

      // Combine all sensor data
      const latestData = allSensorData.reduce((acc, data) => {
        if (data) {
          const values = Object.values(data)[0] as any;
          return { ...acc, ...values };
        }
        return acc;
      }, {});

      // Generate AI recommendations
      const recommendations = await aiService.generateRecommendations(latestData);

      return res.status(200).json({
        recommendations,
        analyzedAt: new Date().toISOString(),
        deviceCount: deviceIds.length
      });
    }

    if (req.method === 'POST') {
      const { sensorData, analysisType } = req.body;

      if (!sensorData) {
        return res.status(400).json({ error: 'Sensor data required' });
      }

      // Generate recommendations based on provided data
      const recommendations = await aiService.generateRecommendations(sensorData);

      // If specific analysis type requested
      if (analysisType === 'cropHealth') {
        // Get historical data for trend analysis
        const userRef = db.ref(`users/${userId}`);
        const userSnapshot = await userRef.once('value');
        const userData = userSnapshot.val();

        if (userData && userData.devices) {
          const deviceIds = typeof userData.devices === 'object'
            ? Object.values(userData.devices)
            : [userData.devices];

          const historicalData = [];
          for (const deviceId of deviceIds) {
            const sensorRef = db.ref(`sensor_data/${deviceId}`);
            const snapshot = await sensorRef.orderByKey().limitToLast(10).once('value');
            const data = snapshot.val();
            if (data) {
              historicalData.push(...Object.values(data));
            }
          }

          const cropAnalysis = await aiService.analyzeCropHealth(historicalData);
          return res.status(200).json({
            recommendations,
            cropAnalysis,
            analyzedAt: new Date().toISOString()
          });
        }
      }

      return res.status(200).json({
        recommendations,
        analyzedAt: new Date().toISOString()
      });
    }

  } catch (error) {
    console.error('AI recommendations error:', error);
    return res.status(500).json({
      error: 'Failed to generate recommendations',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}