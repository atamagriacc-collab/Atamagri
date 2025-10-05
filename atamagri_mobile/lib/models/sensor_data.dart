class SensorData {
  final String deviceId;
  final String timestamp;
  final double windMs;
  final double windKmh;
  final double rainrateMMH;
  final double temperatureC;
  final double humidityPercent;
  final double lightLux;
  final double solVoltageV;
  final double solCurrentMA;
  final double solPowerW;
  final String? receivedAt;

  SensorData({
    required this.deviceId,
    required this.timestamp,
    required this.windMs,
    required this.windKmh,
    required this.rainrateMMH,
    required this.temperatureC,
    required this.humidityPercent,
    required this.lightLux,
    required this.solVoltageV,
    required this.solCurrentMA,
    required this.solPowerW,
    this.receivedAt,
  });

  factory SensorData.fromJson(Map<String, dynamic> json) => SensorData(
    deviceId: json['device_id'] ?? '',
    timestamp: json['timestamp'] ?? DateTime.now().toIso8601String(),
    windMs: (json['wind_m_s'] ?? 0.0).toDouble(),
    windKmh: (json['wind_kmh'] ?? 0.0).toDouble(),
    rainrateMMH: (json['rainrate_mm_h'] ?? 0.0).toDouble(),
    temperatureC: (json['temperature_C'] ?? 0.0).toDouble(),
    humidityPercent: (json['humidity_%'] ?? 0.0).toDouble(),
    lightLux: (json['light_lux'] ?? 0.0).toDouble(),
    solVoltageV: (json['sol_voltage_V'] ?? 0.0).toDouble(),
    solCurrentMA: (json['sol_current_mA'] ?? 0.0).toDouble(),
    solPowerW: (json['sol_power_W'] ?? 0.0).toDouble(),
    receivedAt: json['received_at'],
  );

  Map<String, dynamic> toJson() => {
    'device_id': deviceId,
    'timestamp': timestamp,
    'wind_m_s': windMs,
    'wind_kmh': windKmh,
    'rainrate_mm_h': rainrateMMH,
    'temperature_C': temperatureC,
    'humidity_%': humidityPercent,
    'light_lux': lightLux,
    'sol_voltage_V': solVoltageV,
    'sol_current_mA': solCurrentMA,
    'sol_power_W': solPowerW,
    'received_at': receivedAt,
  };

  String get formattedTemperature => '${temperatureC.toStringAsFixed(1)}°C';
  String get formattedHumidity => '${humidityPercent.toStringAsFixed(1)}%';
  String get formattedWindSpeed => '${windKmh.toStringAsFixed(1)} km/h';
  String get formattedRainRate => '${rainrateMMH.toStringAsFixed(1)} mm/h';
  String get formattedLightIntensity => '${lightLux.toStringAsFixed(0)} lux';
  String get formattedSolarPower => '${solPowerW.toStringAsFixed(2)} W';

  DateTime get dateTime => DateTime.parse(timestamp);
}

class Device {
  final String id;
  final String name;
  final String? lastSeen;
  final String status;
  final String? location;
  final String? type;
  final String? assignedTo;

  Device({
    required this.id,
    required this.name,
    this.lastSeen,
    required this.status,
    this.location,
    this.type,
    this.assignedTo,
  });

  factory Device.fromJson(Map<String, dynamic> json) => Device(
    id: json['id'] ?? '',
    name: json['name'] ?? '',
    lastSeen: json['last_seen'],
    status: json['status'] ?? 'offline',
    location: json['location'],
    type: json['type'],
    assignedTo: json['assigned_to'],
  );

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'last_seen': lastSeen,
    'status': status,
    'location': location,
    'type': type,
    'assigned_to': assignedTo,
  };

  bool get isOnline => status.toLowerCase() == 'online';
}

class WeatherData {
  final double temperature;
  final double humidity;
  final double windSpeed;
  final double rainfall;
  final String description;
  final String icon;
  final DateTime timestamp;

  WeatherData({
    required this.temperature,
    required this.humidity,
    required this.windSpeed,
    required this.rainfall,
    required this.description,
    required this.icon,
    required this.timestamp,
  });

  factory WeatherData.fromJson(Map<String, dynamic> json) => WeatherData(
    temperature: (json['temperature'] ?? 0.0).toDouble(),
    humidity: (json['humidity'] ?? 0.0).toDouble(),
    windSpeed: (json['wind_speed'] ?? 0.0).toDouble(),
    rainfall: (json['rainfall'] ?? 0.0).toDouble(),
    description: json['description'] ?? '',
    icon: json['icon'] ?? '',
    timestamp: json['timestamp'] != null
        ? DateTime.parse(json['timestamp'])
        : DateTime.now(),
  );

  Map<String, dynamic> toJson() => {
    'temperature': temperature,
    'humidity': humidity,
    'wind_speed': windSpeed,
    'rainfall': rainfall,
    'description': description,
    'icon': icon,
    'timestamp': timestamp.toIso8601String(),
  };
}