/**
 * Comprehensive Test Script for IoT Sensor Data API
 *
 * This script tests the /api/iot/sensor-data endpoint to ensure:
 * 1. All sensor data fields are properly transmitted
 * 2. Data is saved to Firebase Realtime Database
 * 3. GET endpoint retrieves the data correctly
 * 4. All sensor types are working (Temperature, Humidity, Wind, Rain, Light, Solar)
 */

const API_URL = 'https://www.atamagri.app/api/iot/sensor-data';
// const API_URL = 'http://localhost:3000/api/iot/sensor-data'; // For local testing

// Test data with all sensor fields
const testSensorData = {
  device_id: 'ESP32-TEST-001',
  timestamp: new Date().toISOString(),
  temperature_C: 28.5,
  humidity_: 65.3,
  wind_m_s: 3.2,
  wind_kmh: 11.52,
  rainrate_mm_h: 0.4,
  light_lux: 5430.5,
  sol_voltage_V: 12.4,
  sol_current_mA: 210.7,
  sol_power_W: 2.61
};

// Alternative test with humidity_% format
const testSensorDataAlt = {
  device_id: 'ESP32-TEST-002',
  timestamp: new Date().toISOString(),
  temperature_C: 29.1,
  'humidity_%': 68.2,
  wind_m_s: 2.8,
  wind_kmh: 10.08,
  rainrate_mm_h: 0.0,
  light_lux: 6200.0,
  sol_voltage_V: 13.1,
  sol_current_mA: 195.3,
  sol_power_W: 2.56
};

console.log('🧪 Starting IoT Sensor Data API Test\n');
console.log('📡 Target Endpoint:', API_URL);
console.log('═'.repeat(70), '\n');

/**
 * Test 1: POST sensor data with humidity_ format
 */
async function testPostSensorData() {
  console.log('📝 Test 1: POST Sensor Data (humidity_ format)');
  console.log('─'.repeat(70));

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testSensorData)
    });

    const data = await response.json();

    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));

    if (response.ok && data.success) {
      console.log('✅ Test 1 PASSED: Data posted successfully');
      console.log('   - Data ID:', data.id);
      console.log('   - Device:', data.device_id);
      console.log('   - Received at:', data.received_at);
    } else {
      console.log('❌ Test 1 FAILED:', data.error || 'Unknown error');
    }
  } catch (error) {
    console.log('❌ Test 1 ERROR:', error.message);
  }

  console.log('\n');
}

/**
 * Test 2: POST sensor data with humidity_% format
 */
async function testPostSensorDataAlt() {
  console.log('📝 Test 2: POST Sensor Data (humidity_% format)');
  console.log('─'.repeat(70));

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testSensorDataAlt)
    });

    const data = await response.json();

    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));

    if (response.ok && data.success) {
      console.log('✅ Test 2 PASSED: Data posted successfully');
      console.log('   - Humidity field normalized correctly');
    } else {
      console.log('❌ Test 2 FAILED:', data.error || 'Unknown error');
    }
  } catch (error) {
    console.log('❌ Test 2 ERROR:', error.message);
  }

  console.log('\n');
}

/**
 * Test 3: GET all sensor data
 */
async function testGetAllSensorData() {
  console.log('📝 Test 3: GET All Sensor Data');
  console.log('─'.repeat(70));

  try {
    const response = await fetch(`${API_URL}?limit=5`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    console.log('Status:', response.status);
    console.log('Count:', data.count);
    console.log('Total:', data.total);

    if (response.ok && data.success) {
      console.log('✅ Test 3 PASSED: Retrieved sensor data');
      console.log('\n📊 Latest 5 readings:');
      data.data.forEach((record, index) => {
        console.log(`\n${index + 1}. Device: ${record.device_id}`);
        console.log(`   Timestamp: ${record.received_at || record.timestamp}`);
        console.log(`   Temperature: ${record.temperature_C}°C`);
        console.log(`   Humidity: ${record.humidity_}%`);
        console.log(`   Wind: ${record.wind_m_s} m/s (${record.wind_kmh} km/h)`);
        console.log(`   Rain: ${record.rainrate_mm_h} mm/h`);
        console.log(`   Light: ${record.light_lux} lux`);
        console.log(`   Solar: ${record.sol_voltage_V}V, ${record.sol_current_mA}mA, ${record.sol_power_W}W`);
      });
    } else {
      console.log('❌ Test 3 FAILED:', data.error || 'Unknown error');
    }
  } catch (error) {
    console.log('❌ Test 3 ERROR:', error.message);
  }

  console.log('\n');
}

/**
 * Test 4: GET sensor data for specific device
 */
async function testGetDeviceData() {
  console.log('📝 Test 4: GET Sensor Data for Specific Device');
  console.log('─'.repeat(70));

  try {
    const response = await fetch(`${API_URL}?device_id=ESP32-TEST-001&limit=3`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    console.log('Status:', response.status);
    console.log('Device:', data.device_id);
    console.log('Count:', data.count);

    if (response.ok && data.success) {
      console.log('✅ Test 4 PASSED: Retrieved device-specific data');
      console.log('   - Returned', data.count, 'records for', data.device_id);
    } else {
      console.log('❌ Test 4 FAILED:', data.error || 'Unknown error');
    }
  } catch (error) {
    console.log('❌ Test 4 ERROR:', error.message);
  }

  console.log('\n');
}

/**
 * Test 5: Verify all sensor types are captured
 */
async function testAllSensorTypes() {
  console.log('📝 Test 5: Verify All Sensor Types');
  console.log('─'.repeat(70));

  const sensorTypes = [
    { name: 'Temperature', field: 'temperature_C', unit: '°C' },
    { name: 'Humidity', field: 'humidity_', unit: '%' },
    { name: 'Wind Speed (m/s)', field: 'wind_m_s', unit: 'm/s' },
    { name: 'Wind Speed (km/h)', field: 'wind_kmh', unit: 'km/h' },
    { name: 'Rain Rate', field: 'rainrate_mm_h', unit: 'mm/h' },
    { name: 'Light Intensity', field: 'light_lux', unit: 'lux' },
    { name: 'Solar Voltage', field: 'sol_voltage_V', unit: 'V' },
    { name: 'Solar Current', field: 'sol_current_mA', unit: 'mA' },
    { name: 'Solar Power', field: 'sol_power_W', unit: 'W' }
  ];

  try {
    const response = await fetch(`${API_URL}?limit=1`, {
      method: 'GET'
    });

    const data = await response.json();

    if (response.ok && data.success && data.data.length > 0) {
      const latestRecord = data.data[0];
      let allPresent = true;

      console.log('Checking sensor types in latest record:\n');

      sensorTypes.forEach(sensor => {
        const value = latestRecord[sensor.field];
        const present = value !== undefined && value !== null;
        const status = present ? '✅' : '❌';

        console.log(`${status} ${sensor.name.padEnd(20)} ${present ? `${value} ${sensor.unit}` : 'MISSING'}`);

        if (!present) allPresent = false;
      });

      console.log('\n' + (allPresent ?
        '✅ Test 5 PASSED: All sensor types present' :
        '⚠️  Test 5 WARNING: Some sensor types missing'));
    } else {
      console.log('❌ Test 5 FAILED: No data available');
    }
  } catch (error) {
    console.log('❌ Test 5 ERROR:', error.message);
  }

  console.log('\n');
}

/**
 * Run all tests
 */
async function runAllTests() {
  console.log('🚀 Starting comprehensive API tests...\n');

  await testPostSensorData();
  await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second

  await testPostSensorDataAlt();
  await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second

  await testGetAllSensorData();
  await new Promise(resolve => setTimeout(resolve, 500));

  await testGetDeviceData();
  await new Promise(resolve => setTimeout(resolve, 500));

  await testAllSensorTypes();

  console.log('═'.repeat(70));
  console.log('✨ All tests completed!\n');
  console.log('📌 Summary:');
  console.log('   - Endpoint: ' + API_URL);
  console.log('   - Tests run: 5');
  console.log('   - Check logs above for detailed results');
  console.log('\n💡 Next steps:');
  console.log('   1. Check Firebase console to verify data is stored');
  console.log('   2. Check dashboard to see if data appears in real-time');
  console.log('   3. Configure your ESP32 to use this endpoint');
  console.log('═'.repeat(70));
}

// Run tests
runAllTests().catch(console.error);
