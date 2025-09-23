// Test script to push sensor data to Firebase Realtime Database
// Run this script using: node scripts/test-firebase-data.js

const { initializeApp } = require('firebase/app');
const { getDatabase, ref, push, set } = require('firebase/database');

// Firebase configuration - update these with your actual values
const firebaseConfig = {
  apiKey: "AIzaSyDYJpxwibPgJiH418xvjrLJXv_W6opaNbo",
  authDomain: "atamagri-iot.firebaseapp.com",
  databaseURL: "https://atamagri-iot-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "atamagri-iot",
  storageBucket: "atamagri-iot.firebasestorage.app",
  messagingSenderId: "745512120451",
  appId: "1:745512120451:web:6cfdd1aab20747f675ebb6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Function to generate random sensor data
function generateSensorData() {
  const now = new Date();
  return {
    device_id: "ESP32-001",
    timestamp: now.toISOString(),
    wind_m_s: (Math.random() * 10).toFixed(1),
    wind_kmh: (Math.random() * 36).toFixed(1),
    rainrate_mm_h: (Math.random() * 5).toFixed(1),
    temperature_C: (20 + Math.random() * 15).toFixed(1),
    humidity_: (40 + Math.random() * 40).toFixed(1),
    light_lux: (100 + Math.random() * 1000).toFixed(1),
    sol_voltage_V: (10 + Math.random() * 5).toFixed(1),
    sol_current_mA: (100 + Math.random() * 400).toFixed(1),
    sol_power_W: (1 + Math.random() * 5).toFixed(2),
    received_at: now.toISOString()
  };
}

// Function to push data to Firebase
async function pushSensorData() {
  try {
    const sensorData = generateSensorData();
    const sensorDataRef = ref(db, 'sensor_data');

    // Push new data
    await push(sensorDataRef, sensorData);

    console.log('✅ Successfully pushed sensor data:', sensorData);

    // Also update the latest reading
    const latestRef = ref(db, 'latest_reading');
    await set(latestRef, sensorData);

    console.log('✅ Updated latest reading');

  } catch (error) {
    console.error('❌ Error pushing data to Firebase:', error);
  }
}

// Push data once
pushSensorData().then(() => {
  console.log('Test data sent successfully!');
  process.exit(0);
}).catch((error) => {
  console.error('Failed to send test data:', error);
  process.exit(1);
});

// Optional: Push data every 5 seconds (uncomment to use)
// setInterval(() => {
//   pushSensorData();
// }, 5000);