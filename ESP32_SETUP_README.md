# ESP32 Setup Guide for Atamagri IoT

This guide explains how to set up your ESP32 device to send sensor data to the Atamagri IoT platform.

---

## 📦 Required Files

### ✅ CURRENT (Use This):
- **`esp32-sensor-updated.ino`** - Latest version with correct data format

### ❌ DEPRECATED (Do Not Use):
- **`esp32-sensor-example.ino.DEPRECATED`** - Old format (kept for reference only)

---

## 🔧 Required Hardware

1. **ESP32 Development Board** (ESP32-DevKitC or similar)
2. **Weather Sensors:**
   - DHT22/AM2302 (Temperature & Humidity)
   - Anemometer (Wind speed)
   - Rain gauge sensor
   - BH1750 or similar (Light intensity)
   - INA219 or similar (Solar monitoring)

3. **Power Supply:**
   - USB cable for development
   - Solar panel with voltage regulator for deployment

---

## 📚 Required Libraries

Install these libraries via Arduino IDE Library Manager:

```
1. WiFi (Built-in)
2. HTTPClient (Built-in)
3. ArduinoJson by Benoit Blanchon (v6.x)
```

**Installation Steps:**
1. Open Arduino IDE
2. Go to **Sketch** → **Include Library** → **Manage Libraries**
3. Search for "ArduinoJson"
4. Install version 6.x or later

---

## ⚙️ Configuration

### 1. Open the Sketch

Open `esp32-sensor-updated.ino` in Arduino IDE

### 2. Configure WiFi

```cpp
const char* ssid = "YOUR_WIFI_SSID";        // Replace with your WiFi name
const char* password = "YOUR_WIFI_PASSWORD"; // Replace with your WiFi password
```

### 3. Configure Device ID

```cpp
const char* device_id = "ESP32-001"; // Use unique ID for each device
```

**Device ID Format:**
- ESP32-001, ESP32-002, etc.
- Must be registered in Firebase by admin
- Contact admin to register new devices

### 4. Verify API Endpoint

```cpp
const char* serverURL = "https://www.atamagri.app/api/iot/sensor-data";
```

---

## 📊 Required Data Format

The ESP32 must send data in this **exact format**:

```json
{
  "device_id": "ESP32-001",
  "timestamp": "2025-10-12 13:25:36",
  "temperature_C": 34.6,       // ✅ Note: temperature_C (not temperature)
  "humidity_": 54.8,           // ✅ Note: humidity_ (not humidity or humidity_%)
  "wind_m_s": 0.428,           // Wind speed in meters per second
  "wind_kmh": 1.541,           // Wind speed in kilometers per hour
  "rainrate_mm_h": 0,          // Rain rate in mm per hour
  "light_lux": 3150,           // Light intensity in Lux
  "sol_voltage_V": 12.656,     // Solar panel voltage
  "sol_current_mA": 156.2,     // Solar panel current
  "sol_power_W": 1.976         // Solar panel power (calculated)
}
```

### ⚠️ Critical Field Names

| Field | Correct ✅ | Wrong ❌ |
|-------|-----------|---------|
| Temperature | `temperature_C` | `temperature`, `temp` |
| Humidity | `humidity_` | `humidity`, `humidity_%` |
| Wind (m/s) | `wind_m_s` | `wind`, `windSpeed` |
| Wind (km/h) | `wind_kmh` | `wind_speed` |
| Rain Rate | `rainrate_mm_h` | `rain`, `rainfall` |
| Light | `light_lux` | `light`, `lux` |
| Solar Voltage | `sol_voltage_V` | `voltage`, `solar_voltage` |
| Solar Current | `sol_current_mA` | `current`, `solar_current` |
| Solar Power | `sol_power_W` | `power`, `solar_power` |

---

## 🚀 Upload to ESP32

### 1. Connect ESP32

Connect your ESP32 to your computer via USB

### 2. Select Board

In Arduino IDE:
- **Tools** → **Board** → **ESP32 Dev Module**
- **Tools** → **Port** → Select your ESP32 COM port

### 3. Upload

Click the **Upload** button (→) in Arduino IDE

### 4. Monitor Serial Output

Open Serial Monitor (**Tools** → **Serial Monitor**):
- Set baud rate to **115200**
- You should see:
  ```
  ESP32 IoT Sensor - Atamagri
  ============================
  Connecting to WiFi....
  WiFi connected!
  IP address: 192.168.1.xxx

  === SENDING DATA ===
  URL: https://www.atamagri.app/api/iot/sensor-data
  JSON: {...}
  === SERVER RESPONSE ===
  HTTP Response code: 200
  ✅ SUCCESS!
  Response: {"success":true,"id":"-ObM..."}
  ```

---

## 🔍 Troubleshooting

### Issue: "HTTP Response code: 308"

**Problem:** Server is redirecting the request

**Solution:** The code already handles redirects. Check your URL doesn't have a trailing slash.

### Issue: "HTTP Response code: 400"

**Problem:** Missing required fields or incorrect data format

**Solutions:**
1. Verify `device_id` is set
2. Verify `timestamp` is set
3. Check field names match exactly (case-sensitive)

### Issue: "HTTP Response code: 401"

**Problem:** Invalid signature

**Solution:** Contact admin to verify device is registered

### Issue: "HTTP Response code: 503"

**Problem:** Firebase not configured on server

**Solution:** Contact server administrator

### Issue: WiFi won't connect

**Solutions:**
1. Double-check WiFi credentials
2. Ensure WiFi is 2.4GHz (ESP32 doesn't support 5GHz)
3. Check WiFi signal strength
4. Try moving ESP32 closer to router

### Issue: Data not showing in dashboard

**Solutions:**
1. Verify device_id is registered in Firebase
2. Check user account has access to this device
3. Verify data is being saved (check Serial Monitor for success)
4. Try refreshing dashboard

---

## 📈 Verifying Data

### 1. Check API Endpoint

```bash
curl https://www.atamagri.app/api/iot/sensor-data?device_id=ESP32-001&limit=5
```

Expected response:
```json
{
  "success": true,
  "data": [...],
  "count": 5,
  "device_id": "ESP32-001"
}
```

### 2. Check Dashboard

1. Login to https://www.atamagri.app/dashboard
2. Your device should appear in "Your IoT Device" card
3. Sensor readings should update every 30 seconds
4. Charts should show historical data

---

## 🔐 Security Notes

1. **Device ID**: Must be unique per device
2. **Signature**: Optional but recommended for production
3. **HTTPS**: Always use HTTPS endpoint (not HTTP)
4. **WiFi Credentials**: Never commit to Git with real credentials
5. **Firebase Rules**: Devices write to `sensor_data`, users read with authentication

---

## 📅 Maintenance

### Regular Checks

1. **Every Week**: Check battery/solar voltage
2. **Every Month**: Clean sensors (especially rain gauge)
3. **Every 3 Months**: Check WiFi connection stability
4. **Every 6 Months**: Update firmware if available

### Updating Firmware

1. Download latest `esp32-sensor-updated.ino`
2. Verify your WiFi credentials are still correct
3. Upload via Arduino IDE
4. Monitor first few transmissions via Serial Monitor

---

## 📞 Support

### Dashboard Issues
- Check Firebase Console
- Verify user permissions
- Contact: admin@atamagri.app

### Hardware Issues
- Check sensor connections
- Verify power supply
- Test sensors individually

### Network Issues
- Check WiFi signal strength
- Verify router settings
- Consider WiFi extender for remote locations

---

## 🎯 Quick Checklist

Before deploying ESP32 to the field:

- [ ] WiFi credentials configured
- [ ] Unique device ID set
- [ ] Device registered in Firebase by admin
- [ ] All sensors connected and tested
- [ ] Power supply tested (solar + battery backup)
- [ ] Serial Monitor shows successful transmissions
- [ ] Dashboard shows live data
- [ ] Weatherproof enclosure installed
- [ ] Sensor placement optimized (wind, rain, light)
- [ ] Mounting secure and stable

---

## 📖 Additional Resources

- [Arduino ESP32 Documentation](https://docs.espressif.com/projects/arduino-esp32/)
- [ArduinoJson Documentation](https://arduinojson.org/)
- [Firebase Realtime Database](https://firebase.google.com/docs/database)
- [Atamagri API Documentation](../IOT_ENDPOINT_GUIDE.md)

---

**Last Updated:** October 12, 2025
**Version:** 2.0 (Updated format with weather sensors)
