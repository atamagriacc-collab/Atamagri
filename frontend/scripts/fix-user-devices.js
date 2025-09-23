// Script to fix user device assignment in Firebase
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set, get } = require('firebase/database');

// Firebase configuration
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

async function fixUserDevices() {
  try {
    // User UID from the export
    const userId = 'Xrrp4S01hkVik5NiTFIfh39Wpoy1';

    // Get the current user data
    const userRef = ref(db, `users/${userId}`);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      const currentData = snapshot.val();
      console.log('Current user data:', currentData);

      // Update with devices and drone
      const updatedData = {
        ...currentData,
        devices: {
          primary: 'ESP32-001'
        },
        drone: 'DRONE-001'
      };

      // Save updated data
      await set(userRef, updatedData);
      console.log('✅ Successfully updated user with devices and drone');
      console.log('Updated data:', updatedData);
    } else {
      console.log('❌ User not found');
    }
  } catch (error) {
    console.error('❌ Error updating user:', error);
  }

  process.exit(0);
}

// Run the fix
fixUserDevices();