/**
 * Firebase Sensor Data Cleanup Script
 *
 * This script removes old sensor data entries that use incorrect field names
 * (e.g., 'humidity' instead of 'humidity_', or contains nitrogen/phosphorus/potassium)
 *
 * Run with: node cleanup-old-sensor-data.js
 */

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://atamagri-iot-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const db = admin.database();

async function cleanupOldSensorData() {
  console.log('🧹 Starting cleanup of old sensor data...\n');

  try {
    const sensorDataRef = db.ref('sensor_data');
    const snapshot = await sensorDataRef.once('value');

    if (!snapshot.exists()) {
      console.log('❌ No sensor data found in database');
      return;
    }

    const data = snapshot.val();
    let totalCount = 0;
    let removedCount = 0;
    let keptCount = 0;
    const removedEntries = [];

    console.log('📊 Analyzing sensor data entries...\n');

    for (const [key, value] of Object.entries(data)) {
      totalCount++;

      // Check if entry uses OLD field names or contains NPK data
      const hasOldHumidity = value.hasOwnProperty('humidity') && !value.hasOwnProperty('humidity_');
      const hasNPKData = value.hasOwnProperty('nitrogen') ||
                         value.hasOwnProperty('phosphorus') ||
                         value.hasOwnProperty('potassium') ||
                         value.hasOwnProperty('ph');
      const hasOldTemp = value.hasOwnProperty('temperature') && !value.hasOwnProperty('temperature_C');
      const missingRequiredFields = !value.hasOwnProperty('temperature_C') &&
                                    !value.hasOwnProperty('wind_m_s') &&
                                    !value.hasOwnProperty('light_lux');

      if (hasOldHumidity || hasNPKData || hasOldTemp || missingRequiredFields) {
        removedEntries.push({
          id: key,
          device_id: value.device_id || 'Unknown',
          timestamp: value.timestamp || value.received_at || 'No timestamp',
          reason: hasOldHumidity ? 'Old humidity field' :
                  hasNPKData ? 'NPK data (old format)' :
                  hasOldTemp ? 'Old temperature field' :
                  'Missing required fields'
        });
        removedCount++;
      } else {
        keptCount++;
      }
    }

    // Display results
    console.log('📈 Analysis Results:');
    console.log(`   Total entries: ${totalCount}`);
    console.log(`   ✅ Valid entries (will keep): ${keptCount}`);
    console.log(`   ❌ Invalid entries (will remove): ${removedCount}\n`);

    if (removedCount === 0) {
      console.log('✨ All sensor data is already in correct format! No cleanup needed.');
      process.exit(0);
      return;
    }

    // Show entries to be removed
    console.log('🗑️  Entries to be removed:');
    removedEntries.slice(0, 10).forEach(entry => {
      console.log(`   - ${entry.id} | ${entry.device_id} | ${entry.timestamp} | Reason: ${entry.reason}`);
    });

    if (removedEntries.length > 10) {
      console.log(`   ... and ${removedEntries.length - 10} more entries\n`);
    } else {
      console.log('');
    }

    // Ask for confirmation
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });

    readline.question('⚠️  Do you want to proceed with deletion? (yes/no): ', async (answer) => {
      if (answer.toLowerCase() === 'yes') {
        console.log('\n🔥 Deleting invalid entries...\n');

        let deleted = 0;
        for (const entry of removedEntries) {
          try {
            await db.ref(`sensor_data/${entry.id}`).remove();
            deleted++;
            if (deleted % 10 === 0) {
              console.log(`   Deleted ${deleted}/${removedCount} entries...`);
            }
          } catch (error) {
            console.error(`   ❌ Error deleting ${entry.id}:`, error.message);
          }
        }

        console.log(`\n✅ Cleanup complete!`);
        console.log(`   Deleted: ${deleted} entries`);
        console.log(`   Remaining: ${keptCount} valid entries`);
      } else {
        console.log('\n❌ Cleanup cancelled. No data was deleted.');
      }

      readline.close();
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    process.exit(1);
  }
}

// Run cleanup
cleanupOldSensorData();
