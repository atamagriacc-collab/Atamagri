// ESP32 Sensor Data Sender for Atamagri IoT Platform
// Updated version with better error handling and redirect support

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// WiFi credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// API endpoint - without trailing slash
const char* serverURL = "https://www.atamagri.app/api/iot/sensor-data";

// Device configuration
const char* device_id = "ESP32-001";

// Function to get current timestamp
String getCurrentTimestamp() {
  // Format: "2025-09-16 12:45:33"
  // In production, use NTP client for accurate time
  return "2025-09-22 " + String(millis()/1000/60/60 % 24) + ":" +
         String(millis()/1000/60 % 60) + ":" + String(millis()/1000 % 60);
}

void setup() {
  Serial.begin(115200);
  delay(1000);

  Serial.println("ESP32 IoT Sensor - Atamagri");
  Serial.println("============================");

  // Connect to WiFi
  Serial.print("Connecting to WiFi");
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected!");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    sendSensorData();
  } else {
    Serial.println("WiFi disconnected. Reconnecting...");
    WiFi.reconnect();
  }

  // Send data every 30 seconds
  delay(30000);
}

void sendSensorData() {
  HTTPClient http;

  // Configure HTTP client
  http.begin(serverURL);
  http.addHeader("Content-Type", "application/json");
  http.setFollowRedirects(HTTPC_STRICT_FOLLOW_REDIRECTS); // Handle redirects

  // Create JSON document
  StaticJsonDocument<512> doc;

  // Add sensor data
  doc["device_id"] = device_id;
  doc["timestamp"] = getCurrentTimestamp();

  // Read sensor values (replace with actual sensor readings)
  doc["wind_m_s"] = random(0, 100) / 10.0;
  doc["wind_kmh"] = doc["wind_m_s"].as<float>() * 3.6;
  doc["rainrate_mm_h"] = random(0, 50) / 10.0;
  doc["temperature_C"] = 20.0 + random(0, 150) / 10.0;
  doc["humidity_"] = 40.0 + random(0, 400) / 10.0;  // ✅ Fixed: humidity_ (not humidity_%)
  doc["light_lux"] = random(0, 1000) + random(0, 100) / 10.0;
  doc["sol_voltage_V"] = 11.0 + random(0, 20) / 10.0;
  doc["sol_current_mA"] = random(0, 500) + random(0, 100) / 10.0;
  doc["sol_power_W"] = (doc["sol_voltage_V"].as<float>() *
                        doc["sol_current_mA"].as<float>()) / 1000.0;

  // Serialize JSON
  String jsonString;
  serializeJson(doc, jsonString);

  // Debug print
  Serial.println("=== SENDING DATA ===");
  Serial.println("URL: " + String(serverURL));
  Serial.println("JSON: " + jsonString);

  // Send POST request
  int httpResponseCode = http.POST(jsonString);

  // Handle response
  Serial.println("=== SERVER RESPONSE ===");
  Serial.print("HTTP Response code: ");
  Serial.println(httpResponseCode);

  if (httpResponseCode == 200) {
    String response = http.getString();
    Serial.println("✅ SUCCESS!");
    Serial.println("Response: " + response);

    // Parse response
    StaticJsonDocument<256> responseDoc;
    DeserializationError error = deserializeJson(responseDoc, response);

    if (!error) {
      const char* id = responseDoc["id"];
      if (id) {
        Serial.print("Firebase ID: ");
        Serial.println(id);
      }
    }
  } else if (httpResponseCode == 308) {
    Serial.println("⚠️ ERROR: 308 Permanent Redirect");
    Serial.println("The server is redirecting the request.");
    Serial.println("Please check with the server administrator.");

    // Get redirect location
    String location = http.getLocation();
    if (location.length() > 0) {
      Serial.print("Redirect to: ");
      Serial.println(location);
    }
  } else if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.println("❌ ERROR: Request failed");
    Serial.println("Response: " + response);
  } else {
    Serial.print("❌ ERROR: ");
    Serial.println(http.errorToString(httpResponseCode));
  }

  Serial.println("=== END RESPONSE ===\n");

  // Free resources
  http.end();
}

// Alternative function for testing with minimal headers
void sendSimpleData() {
  if (WiFi.status() != WL_CONNECTED) {
    return;
  }

  HTTPClient http;
  http.begin(serverURL);
  http.addHeader("Content-Type", "application/json");

  // Minimal JSON data
  String json = "{\"device_id\":\"" + String(device_id) +
                "\",\"temperature_C\":" + String(25.5) +
                ",\"humidity_\":" + String(60.0) + "}";

  Serial.println("Sending minimal data: " + json);
  int responseCode = http.POST(json);

  Serial.print("Response Code: ");
  Serial.println(responseCode);

  if (responseCode == 200) {
    Serial.println("✅ Data sent successfully!");
    Serial.println(http.getString());
  }

  http.end();
}