# Firebase Fixes Guide

This guide provides step-by-step instructions to fix the Firebase security rules and clean up old sensor data.

## 📋 Issues Fixed

1. ✅ **Extended rule expiration** from October 15, 2025 to **December 31, 2026**
2. ✅ **Data structure cleanup** - Remove old sensor entries with incorrect field names
3. ✅ **Improved security** - Better access control for different data types

---

## 🔧 Fix #1: Update Firebase Security Rules

### Option A: Via Firebase Console (Recommended)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **atamagri-iot**
3. Navigate to **Realtime Database** → **Rules**
4. Copy the content from `firebase-database-rules.json`
5. Paste it into the rules editor
6. Click **Publish**

### Option B: Via Firebase CLI

```bash
# Make sure you're in the project directory
cd C:\Users\Administrator\Documents\GitHub\ATAMAGRI-V2

# Deploy the rules
firebase deploy --only database
```

### ✅ What Changed:

| Aspect | Old Rules | New Rules |
|--------|-----------|-----------|
| **Expiration** | October 15, 2025 | **December 31, 2026** |
| **sensor_data** | Open to all | ✅ Auth required to read, Auth + IoT devices can write |
| **devices** | Open to all | ✅ Only owners and admins can modify |
| **users** | Open to all | ✅ Users can only access their own data |
| **drones** | Open to all | ✅ Only owners and admins can modify |
| **Indexing** | None | ✅ Indexed on device_id, timestamp, received_at |

---

## 🧹 Fix #2: Clean Up Old Sensor Data

### Step 1: Install Dependencies

```bash
npm install firebase-admin
```

### Step 2: Get Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select **atamagri-iot** project
3. Go to **Project Settings** (⚙️ icon) → **Service Accounts**
4. Click **Generate New Private Key**
5. Save the file as `serviceAccountKey.json` in your project root

### Step 3: Run Cleanup Script

```bash
node cleanup-old-sensor-data.js
```

### What the Script Does:

1. ✅ Scans all sensor data entries
2. ✅ Identifies entries with old field names:
   - `humidity` instead of `humidity_`
   - `temperature` instead of `temperature_C`
   - NPK fields (nitrogen, phosphorus, potassium, ph)
   - Missing required fields (temperature_C, wind_m_s, light_lux)
3. ✅ Shows you what will be deleted
4. ✅ Asks for confirmation before deletion
5. ✅ Safely removes invalid entries

### Expected Output:

```
🧹 Starting cleanup of old sensor data...

📊 Analyzing sensor data entries...

📈 Analysis Results:
   Total entries: 150
   ✅ Valid entries (will keep): 100
   ❌ Invalid entries (will remove): 50

🗑️  Entries to be removed:
   - -O_CICVDmYGceEAS32PO | ESP32-001 | 2025-09-15T12:15:05.740Z | Reason: NPK data (old format)
   ...

⚠️  Do you want to proceed with deletion? (yes/no):
```

---

## 📊 Current vs. Required Data Structure

### ❌ OLD Format (Will be REMOVED):

```json
{
  "device_id": "ESP32-001",
  "humidity": 65.2,          // ❌ Wrong field name
  "temperature": 27.5,       // ❌ Wrong field name
  "nitrogen": 25,            // ❌ Old NPK data
  "phosphorus": 15,
  "potassium": 30,
  "ph": 6.8
}
```

### ✅ NEW Format (Required):

```json
{
  "device_id": "ESP32-001",
  "humidity_": 54.8,         // ✅ Correct
  "temperature_C": 34.6,     // ✅ Correct
  "wind_m_s": 0.428177,
  "wind_kmh": 1.541426,
  "rainrate_mm_h": 0,
  "light_lux": 3150,
  "sol_voltage_V": 12.656,
  "sol_current_mA": 156.2,
  "sol_power_W": 1.976,
  "timestamp": "2025-10-12 13:25:36",
  "received_at": "2025-10-12T06:28:06.210Z"
}
```

---

## 🔍 Verification Steps

### 1. Verify Rules are Updated

```bash
# Check current rules
firebase database:get / --project atamagri-iot
```

### 2. Test Dashboard Access

1. Navigate to: https://www.atamagri.app/dashboard
2. Verify all charts load correctly
3. Check that sensor data displays properly

### 3. Test IoT Endpoint

```bash
# Test GET request
curl https://www.atamagri.app/api/iot/sensor-data?limit=10

# Expected response:
{
  "success": true,
  "data": [...],
  "count": 10,
  "total": 100,
  "device_id": "all"
}
```

---

## ⚠️ Important Notes

1. **Backup First**: The cleanup script will permanently delete old data
2. **Service Account Key**: Keep `serviceAccountKey.json` SECURE and add to `.gitignore`
3. **ESP32 Devices**: Ensure they send data in the NEW format
4. **Rule Expiration**: Set a reminder for **December 2026** to update rules again

---

## 🚀 Next Steps After Fixes

1. ✅ Update Firebase rules (extends expiration to Dec 2026)
2. ✅ Run cleanup script to remove old data
3. ✅ Verify ESP32 devices send correct field names
4. ✅ Test all dashboard charts work correctly
5. ✅ Monitor sensor data for any issues

---

## 📞 Support

If you encounter any issues:

1. Check Firebase Console logs
2. Review `cleanup-old-sensor-data.js` output
3. Verify ESP32 code uses correct field names
4. Check browser console for JavaScript errors

---

## 📅 Timeline Reference

- **Current Date**: October 12, 2025
- **Old Expiration**: October 15, 2025 ❌ (3 days away!)
- **New Expiration**: December 31, 2026 ✅ (14+ months)
