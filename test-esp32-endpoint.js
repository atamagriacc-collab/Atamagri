// Test script to simulate ESP32 sensor data POST request
// Run with: node test-esp32-endpoint.js

const https = require('https');

// ESP32 sensor data format
const sensorData = {
  "device_id": "ESP32-001",
  "timestamp": new Date().toISOString().replace('T', ' ').slice(0, -5),
  "wind_m_s": 3.2,
  "wind_kmh": 11.52,
  "rainrate_mm_h": 0.4,
  "temperature_C": 28.7,
  "humidity_%": 65.3,
  "light_lux": 530.5,
  "sol_voltage_V": 12.4,
  "sol_current_mA": 210.7,
  "sol_power_W": 2.61
};

const postData = JSON.stringify(sensorData);

const options = {
  hostname: 'www.atamagri.app',
  port: 443,
  path: '/api/iot/sensor-data',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('=== TESTING IOT ENDPOINT ===');
console.log('URL: https://www.atamagri.app/api/iot/sensor-data');
console.log('Method: POST');
console.log('Data:', JSON.stringify(sensorData, null, 2));
console.log('');

const req = https.request(options, (res) => {
  console.log(`=== SERVER RESPONSE ===`);
  console.log(`Status Code: ${res.statusCode}`);
  console.log(`Status Message: ${res.statusMessage}`);
  console.log('Headers:', JSON.stringify(res.headers, null, 2));
  console.log('');

  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('Response Body:', data);
    console.log('=== END RESPONSE ===');

    if (res.statusCode === 308) {
      console.log('\n⚠️  ERROR: Received 308 Permanent Redirect');
      console.log('This usually means the API endpoint is redirecting.');
      console.log('Location:', res.headers.location);
      console.log('\nPossible solutions:');
      console.log('1. Deploy the updated next.config.js to Vercel');
      console.log('2. Check if the API endpoint path is correct');
    } else if (res.statusCode === 200) {
      console.log('\n✅ SUCCESS: Data sent successfully!');
      try {
        const response = JSON.parse(data);
        if (response.id) {
          console.log('Firebase ID:', response.id);
        }
      } catch (e) {
        // Ignore parsing errors
      }
    } else {
      console.log(`\n❌ ERROR: Unexpected status code ${res.statusCode}`);
    }
  });
});

req.on('error', (error) => {
  console.error('Request error:', error);
});

req.write(postData);
req.end();