# IoT Sensor Data API Guide

## Endpoint: /api/iot/sensor-data

This is the primary endpoint for ESP32 devices to send sensor data to the ATAMAGRI platform.

**URL:** `https://www.atamagri.app/api/iot/sensor-data`

---

## Features

✅ **Real-time Updates** - Data instantly appears on all connected dashboards
✅ **All Sensor Types** - Supports 9 sensor types (Temperature, Humidity, Wind, Rain, Light, Solar)
✅ **Flexible Format** - Accepts both `humidity_` and `humidity_%` field names
✅ **GET & POST** - Retrieve historical data or post new readings
✅ **Firebase Integration** - Direct storage to Firebase Realtime Database
✅ **Optional Signature** - Basic security validation available

---

## POST Request - Send Sensor Data

### Headers
```
Content-Type: application/json
```

### Request Body

All sensor fields are **optional** except `device_id` and `timestamp`:

```json
{
  "device_id": "ESP32-001",
  "timestamp": "2025-10-12T10:30:00Z",
  "temperature_C": 28.5,
  "humidity_": 65.3,
  "wind_m_s": 3.2,
  "wind_kmh": 11.52,
  "rainrate_mm_h": 0.4,
  "light_lux": 5430.5,
  "sol_voltage_V": 12.4,
  "sol_current_mA": 210.7,
  "sol_power_W": 2.61
}
```

### Sensor Fields

| Field | Type | Unit | Description | Required |
|-------|------|------|-------------|----------|
| `device_id` | string | - | Unique device identifier | ✅ Yes |
| `timestamp` | string | ISO 8601 | Time of reading | ✅ Yes |
| `temperature_C` | number | °C | Temperature in Celsius | Optional |
| `humidity_` or `humidity_%` | number | % | Relative humidity | Optional |
| `wind_m_s` | number | m/s | Wind speed (meters/sec) | Optional |
| `wind_kmh` | number | km/h | Wind speed (km/hour) | Optional |
| `rainrate_mm_h` | number | mm/h | Rainfall rate | Optional |
| `light_lux` | number | lux | Light intensity | Optional |
| `sol_voltage_V` | number | V | Solar panel voltage | Optional |
| `sol_current_mA` | number | mA | Solar panel current | Optional |
| `sol_power_W` | number | W | Solar power output | Optional |
| `signature` | string | - | Optional security signature | Optional |

### Success Response (200 OK)

```json
{
  "success": true,
  "id": "-NxYZ123abc...",
  "message": "Data saved successfully",
  "device_id": "ESP32-001",
  "received_at": "2025-10-12T10:30:05.123Z"
}
```

### Error Responses

**400 Bad Request** - Missing required fields
```json
{
  "success": false,
  "error": "device_id is required"
}
```

**401 Unauthorized** - Invalid signature
```json
{
  "success": false,
  "error": "Invalid signature"
}
```

**500 Internal Server Error**
```json
{
  "success": false,
  "error": "Internal server error",
  "message": "Error details"
}
```

---

## GET Request - Retrieve Sensor Data

### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `device_id` | string | all | Filter by specific device |
| `limit` | number | 50 | Max records to return |

### Examples

**Get latest 10 readings from all devices:**
```
GET https://www.atamagri.app/api/iot/sensor-data?limit=10
```

**Get latest 5 readings from specific device:**
```
GET https://www.atamagri.app/api/iot/sensor-data?device_id=ESP32-001&limit=5
```

### Success Response

```json
{
  "success": true,
  "data": [
    {
      "id": "-NxYZ123abc...",
      "device_id": "ESP32-001",
      "timestamp": "2025-10-12T10:30:00Z",
      "temperature_C": 28.5,
      "humidity_": 65.3,
      "wind_m_s": 3.2,
      "wind_kmh": 11.52,
      "rainrate_mm_h": 0.4,
      "light_lux": 5430.5,
      "sol_voltage_V": 12.4,
      "sol_current_mA": 210.7,
      "sol_power_W": 2.61,
      "received_at": "2025-10-12T10:30:05.123Z",
      "server_timestamp": 1728730205123
    }
  ],
  "count": 1,
  "total": 100,
  "device_id": "ESP32-001"
}
```

---

## ESP32 Arduino Code Example

```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// WiFi credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// API endpoint
const char* serverUrl = "https://www.atamagri.app/api/iot/sensor-data";
const char* deviceId = "ESP32-001";

void setup() {
  Serial.begin(115200);

  // Connect to WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected");
}

void loop() {
  // Read sensors (replace with actual sensor readings)
  float temperature = readTemperature();
  float humidity = readHumidity();
  float windSpeed = readWindSpeed();
  float rainRate = readRainRate();
  float lightIntensity = readLight();
  float solarVoltage = readSolarVoltage();
  float solarCurrent = readSolarCurrent();
  float solarPower = solarVoltage * solarCurrent / 1000.0;

  // Send data to API
  sendSensorData(temperature, humidity, windSpeed, rainRate,
                 lightIntensity, solarVoltage, solarCurrent, solarPower);

  // Wait 30 seconds before next reading
  delay(30000);
}

void sendSensorData(float temp, float hum, float wind, float rain,
                    float light, float voltage, float current, float power) {
  HTTPClient http;

  // Create JSON document
  StaticJsonDocument<512> doc;
  doc["device_id"] = deviceId;
  doc["timestamp"] = getISOTimestamp();
  doc["temperature_C"] = temp;
  doc["humidity_"] = hum;
  doc["wind_m_s"] = wind;
  doc["wind_kmh"] = wind * 3.6;
  doc["rainrate_mm_h"] = rain;
  doc["light_lux"] = light;
  doc["sol_voltage_V"] = voltage;
  doc["sol_current_mA"] = current;
  doc["sol_power_W"] = power;

  // Serialize JSON
  String jsonString;
  serializeJson(doc, jsonString);

  // Send POST request
  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");

  int httpResponseCode = http.POST(jsonString);

  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.println("✅ Data sent successfully");
    Serial.println("Response: " + response);
  } else {
    Serial.println("❌ Error sending data");
    Serial.println("Error code: " + String(httpResponseCode));
  }

  http.end();
}

// Get ISO 8601 timestamp (you may need NTP for accurate time)
String getISOTimestamp() {
  time_t now = time(nullptr);
  struct tm* timeinfo = gmtime(&now);
  char buffer[30];
  strftime(buffer, sizeof(buffer), "%Y-%m-%dT%H:%M:%SZ", timeinfo);
  return String(buffer);
}

// Placeholder sensor reading functions (implement with your sensors)
float readTemperature() { return 28.5; }
float readHumidity() { return 65.3; }
float readWindSpeed() { return 3.2; }
float readRainRate() { return 0.4; }
float readLight() { return 5430.5; }
float readSolarVoltage() { return 12.4; }
float readSolarCurrent() { return 210.7; }
```

---

## Testing the Endpoint

### Using cURL

```bash
curl -X POST https://www.atamagri.app/api/iot/sensor-data \
  -H "Content-Type: application/json" \
  -d '{
    "device_id": "ESP32-TEST-001",
    "timestamp": "2025-10-12T10:30:00Z",
    "temperature_C": 28.5,
    "humidity_": 65.3,
    "wind_m_s": 3.2,
    "wind_kmh": 11.52,
    "rainrate_mm_h": 0.4,
    "light_lux": 5430.5,
    "sol_voltage_V": 12.4,
    "sol_current_mA": 210.7,
    "sol_power_W": 2.61
  }'
```

### Using Node.js Test Script

Run the comprehensive test script:

```bash
node test-iot-endpoint-comprehensive.js
```

This will test:
- ✅ POST with all sensor fields
- ✅ Humidity field normalization
- ✅ GET all sensor data
- ✅ GET device-specific data
- ✅ Verify all sensor types are captured

---

## Dashboard Integration

Once data is sent to the API:

1. **Automatic Real-time Updates**
   Data immediately appears on all connected dashboards via Firebase Realtime Database

2. **All Sensor Cards Updated**
   Temperature, Humidity, Wind, Rain, Light, and Solar sensors all show latest values

3. **Historical Charts**
   Data is plotted on 24-hour trend charts with new time intervals:
   - 5 minutes
   - 10 minutes
   - 30 minutes
   - 24 hours
   - 7 days
   - 30 days

4. **Sensor Detail Modals**
   Click any sensor card to see detailed historical data and AI predictions

---

## Firebase Database Structure

Data is stored in Firebase with this structure:

```
sensor_data/
  ├─ -NxYZ123abc.../
  │   ├─ device_id: "ESP32-001"
  │   ├─ timestamp: "2025-10-12T10:30:00Z"
  │   ├─ temperature_C: 28.5
  │   ├─ humidity_: 65.3
  │   ├─ wind_m_s: 3.2
  │   ├─ wind_kmh: 11.52
  │   ├─ rainrate_mm_h: 0.4
  │   ├─ light_lux: 5430.5
  │   ├─ sol_voltage_V: 12.4
  │   ├─ sol_current_mA: 210.7
  │   ├─ sol_power_W: 2.61
  │   ├─ received_at: "2025-10-12T10:30:05.123Z"
  │   └─ server_timestamp: 1728730205123
```

---

## Troubleshooting

### Data not appearing on dashboard?

1. ✅ Check device_id matches assigned device in admin panel
2. ✅ Verify timestamp is in ISO 8601 format
3. ✅ Check Firebase console for data entries
4. ✅ Ensure WiFi connection is stable
5. ✅ Check server logs for errors

### Humidity field not showing?

- Use either `humidity_` or `humidity_%` - both work
- The API automatically normalizes `humidity_%` to `humidity_`

### Testing locally?

Change the API URL in your code:
```cpp
const char* serverUrl = "http://localhost:3000/api/iot/sensor-data";
```

---

## Best Practices

1. **Send data every 30-60 seconds** for optimal real-time updates
2. **Include timestamp** from RTC or NTP for accurate time tracking
3. **Validate sensor readings** before sending (check for outliers)
4. **Handle HTTP errors** gracefully and retry failed requests
5. **Monitor memory usage** on ESP32 to prevent crashes
6. **Use HTTPS** for secure data transmission (in production)

---

## Support

For issues or questions:
- 📧 Email: support@atamagri.app
- 📚 Docs: https://docs.atamagri.app
- 🐛 Issues: https://github.com/atamagri/issues

---

**Last Updated:** 2025-10-12
**API Version:** 1.0
**Endpoint:** https://www.atamagri.app/api/iot/sensor-data
