# Sensor Data API Documentation

## Overview
The ATAMAGRI dashboard receives sensor data from IoT devices (ESP32) and displays it in real-time using Firebase Realtime Database.

## API Endpoint
**URL:** `https://www.atamagri.app/api/sensor-data`
**Method:** `POST`
**Content-Type:** `application/json`
**Authentication:** Required (see below)

## Authentication
Include the IoT secret in the request headers:
```
x-iot-secret: atamagri-iot-secret-2024
```
or
```
Authorization: atamagri-iot-secret-2024
```

## Request Format
Send sensor data in the following JSON format:

```json
{
  "device_id": "ESP32-001",
  "timestamp": "2025-09-16 12:45:33",
  "wind_m_s": 3.2,
  "wind_kmh": 11.52,
  "rainrate_mm_h": 0.4,
  "temperature_C": 28.7,
  "humidity_%": 65.3,
  "light_lux": 530.5,
  "sol_voltage_V": 12.4,
  "sol_current_mA": 210.7,
  "sol_power_W": 2.61
}
```

### Field Descriptions

| Field | Type | Unit | Description |
|-------|------|------|-------------|
| device_id | string | - | Unique identifier for the IoT device |
| timestamp | string | ISO 8601 | Time when the reading was taken |
| wind_m_s | number | m/s | Wind speed in meters per second |
| wind_kmh | number | km/h | Wind speed in kilometers per hour |
| rainrate_mm_h | number | mm/h | Rainfall rate |
| temperature_C | number | °C | Temperature in Celsius |
| humidity_% | number | % | Relative humidity percentage |
| light_lux | number | lux | Light intensity |
| sol_voltage_V | number | V | Solar panel voltage |
| sol_current_mA | number | mA | Solar panel current |
| sol_power_W | number | W | Solar power generation |

## Response

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Sensor data received successfully",
  "data_id": "firebase-generated-id",
  "device_id": "ESP32-001",
  "timestamp": "2025-09-16T12:45:33.000Z"
}
```

### Error Responses

**401 Unauthorized**
```json
{
  "error": "Unauthorized"
}
```

**400 Bad Request**
```json
{
  "error": "Missing required field: temperature_C",
  "required": ["device_id", "timestamp", "wind_m_s", ...]
}
```

**500 Internal Server Error**
```json
{
  "error": "Failed to process sensor data",
  "message": "Error details"
}
```

## Arduino/ESP32 Example Code

```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char* serverUrl = "https://www.atamagri.app/api/sensor-data";
const char* iotSecret = "atamagri-iot-secret-2024";

void sendSensorData() {
  HTTPClient http;

  // Create JSON document
  StaticJsonDocument<512> doc;
  doc["device_id"] = "ESP32-001";
  doc["timestamp"] = "2025-09-16 12:45:33";
  doc["wind_m_s"] = 3.2;
  doc["wind_kmh"] = 11.52;
  doc["rainrate_mm_h"] = 0.4;
  doc["temperature_C"] = 28.7;
  doc["humidity_%"] = 65.3;
  doc["light_lux"] = 530.5;
  doc["sol_voltage_V"] = 12.4;
  doc["sol_current_mA"] = 210.7;
  doc["sol_power_W"] = 2.61;

  String jsonString;
  serializeJson(doc, jsonString);

  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("x-iot-secret", iotSecret);

  int httpResponseCode = http.POST(jsonString);

  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.println(httpResponseCode);
    Serial.println(response);
  } else {
    Serial.print("Error code: ");
    Serial.println(httpResponseCode);
  }

  http.end();
}
```

## Testing with cURL

```bash
curl -X POST https://www.atamagri.app/api/sensor-data \
  -H "Content-Type: application/json" \
  -H "x-iot-secret: atamagri-iot-secret-2024" \
  -d '{
    "device_id": "ESP32-001",
    "timestamp": "2025-09-16 12:45:33",
    "wind_m_s": 3.2,
    "wind_kmh": 11.52,
    "rainrate_mm_h": 0.4,
    "temperature_C": 28.7,
    "humidity_%": 65.3,
    "light_lux": 530.5,
    "sol_voltage_V": 12.4,
    "sol_current_mA": 210.7,
    "sol_power_W": 2.61
  }'
```

## Firebase Database Structure

The data is stored in Firebase Realtime Database with the following structure:

```
atamagri-iot/
├── sensor_data/
│   └── {auto-generated-id}/
│       ├── device_id: "ESP32-001"
│       ├── timestamp: "2025-09-16 12:45:33"
│       ├── wind_m_s: 3.2
│       ├── wind_kmh: 11.52
│       ├── rainrate_mm_h: 0.4
│       ├── temperature_C: 28.7
│       ├── humidity_: 65.3
│       ├── light_lux: 530.5
│       ├── sol_voltage_V: 12.4
│       ├── sol_current_mA: 210.7
│       ├── sol_power_W: 2.61
│       └── received_at: "2025-09-16T12:45:33.000Z"
├── latest_reading/
│   └── {same structure as sensor_data}
└── devices/
    └── ESP32-001/
        ├── last_seen: "2025-09-16T12:45:33.000Z"
        ├── status: "online"
        └── {latest sensor data}
```

## Dashboard Features

The dashboard displays:
- Real-time sensor data cards for all 9 sensor types
- Weather trends charts (Temperature, Humidity, Rain)
- Wind monitoring charts
- Solar power generation charts
- Light intensity charts
- Real-time data table showing the latest 10 readings
- Connection status indicator
- Automatic refresh from Firebase Realtime Database

## Notes
- Data is automatically synced in real-time to all connected dashboard clients
- Historical data is limited to the last 100 readings for performance
- The dashboard updates automatically when new data arrives in Firebase
- All timestamps should be in ISO 8601 format