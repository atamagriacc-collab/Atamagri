import 'package:json_annotation/json_annotation.dart';

part 'device.g.dart';

enum DeviceStatus { active, inactive, maintenance, error }

enum DeviceType {
  soilMoisture,
  temperature,
  humidity,
  ph,
  light,
  weatherStation,
  irrigation,
  camera,
  drone,
  other
}

@JsonSerializable()
class Device {
  final String id;
  final String name;
  final String? description;
  final DeviceType type;
  final DeviceStatus status;
  final String? manufacturer;
  final String? model;
  final String? serialNumber;
  final String? firmwareVersion;
  final DateTime? installationDate;
  final DateTime? lastMaintenanceDate;
  final DateTime? nextMaintenanceDate;
  final DateTime lastSeen;
  final String? farmId;
  final String? farmName;
  final DeviceLocation? location;
  final Map<String, dynamic>? configuration;
  final Map<String, dynamic>? metadata;
  final DeviceMetrics? metrics;
  final List<DeviceAlert>? alerts;
  final bool isOnline;
  final double? batteryLevel;
  final int? signalStrength;
  final DateTime createdAt;
  final DateTime updatedAt;

  Device({
    required this.id,
    required this.name,
    this.description,
    required this.type,
    required this.status,
    this.manufacturer,
    this.model,
    this.serialNumber,
    this.firmwareVersion,
    this.installationDate,
    this.lastMaintenanceDate,
    this.nextMaintenanceDate,
    required this.lastSeen,
    this.farmId,
    this.farmName,
    this.location,
    this.configuration,
    this.metadata,
    this.metrics,
    this.alerts,
    this.isOnline = false,
    this.batteryLevel,
    this.signalStrength,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Device.fromJson(Map<String, dynamic> json) => _$DeviceFromJson(json);
  Map<String, dynamic> toJson() => _$DeviceToJson(this);

  String get displayName => name;

  String get typeDisplay {
    switch (type) {
      case DeviceType.soilMoisture:
        return 'Soil Moisture';
      case DeviceType.temperature:
        return 'Temperature';
      case DeviceType.humidity:
        return 'Humidity';
      case DeviceType.ph:
        return 'pH Sensor';
      case DeviceType.light:
        return 'Light Sensor';
      case DeviceType.weatherStation:
        return 'Weather Station';
      case DeviceType.irrigation:
        return 'Irrigation Controller';
      case DeviceType.camera:
        return 'Camera';
      case DeviceType.drone:
        return 'Drone';
      case DeviceType.other:
        return 'Other';
    }
  }

  String get statusDisplay {
    switch (status) {
      case DeviceStatus.active:
        return 'Active';
      case DeviceStatus.inactive:
        return 'Inactive';
      case DeviceStatus.maintenance:
        return 'Maintenance';
      case DeviceStatus.error:
        return 'Error';
    }
  }

  bool get needsMaintenance {
    if (nextMaintenanceDate == null) return false;
    return DateTime.now().isAfter(nextMaintenanceDate!);
  }

  bool get hasLowBattery {
    if (batteryLevel == null) return false;
    return batteryLevel! < 20;
  }

  bool get hasWeakSignal {
    if (signalStrength == null) return false;
    return signalStrength! < 30;
  }

  bool get hasAlerts => alerts != null && alerts!.isNotEmpty;

  int get activeAlertCount {
    if (alerts == null) return 0;
    return alerts!.where((a) => !a.isResolved).length;
  }

  String? get farmDisplay => farmName ?? farmId ?? 'Unassigned';

  Duration get offlineDuration => DateTime.now().difference(lastSeen);

  bool get isOffline => !isOnline || offlineDuration.inMinutes > 10;
}

@JsonSerializable()
class DeviceLocation {
  final double latitude;
  final double longitude;
  final double? altitude;
  final String? field;
  final String? zone;
  final String? description;

  DeviceLocation({
    required this.latitude,
    required this.longitude,
    this.altitude,
    this.field,
    this.zone,
    this.description,
  });

  factory DeviceLocation.fromJson(Map<String, dynamic> json) => _$DeviceLocationFromJson(json);
  Map<String, dynamic> toJson() => _$DeviceLocationToJson(this);

  String get displayName {
    final parts = <String>[];
    if (field != null) parts.add('Field: $field');
    if (zone != null) parts.add('Zone: $zone');
    if (parts.isEmpty) {
      parts.add('${latitude.toStringAsFixed(4)}, ${longitude.toStringAsFixed(4)}');
    }
    return parts.join(' - ');
  }
}

@JsonSerializable()
class DeviceMetrics {
  final int messagesCount;
  final int errorCount;
  final double uptime;
  final double dataQuality;
  final DateTime? lastDataReceived;
  final double? averageResponseTime;

  DeviceMetrics({
    required this.messagesCount,
    required this.errorCount,
    required this.uptime,
    required this.dataQuality,
    this.lastDataReceived,
    this.averageResponseTime,
  });

  factory DeviceMetrics.fromJson(Map<String, dynamic> json) => _$DeviceMetricsFromJson(json);
  Map<String, dynamic> toJson() => _$DeviceMetricsToJson(this);

  String get uptimeDisplay => '${uptime.toStringAsFixed(1)}%';
  String get dataQualityDisplay => '${dataQuality.toStringAsFixed(0)}%';

  bool get hasGoodUptime => uptime > 95;
  bool get hasGoodDataQuality => dataQuality > 90;
}

@JsonSerializable()
class DeviceAlert {
  final String id;
  final String deviceId;
  final String type;
  final String severity;
  final String message;
  final DateTime timestamp;
  final bool isResolved;
  final DateTime? resolvedAt;
  final Map<String, dynamic>? data;

  DeviceAlert({
    required this.id,
    required this.deviceId,
    required this.type,
    required this.severity,
    required this.message,
    required this.timestamp,
    this.isResolved = false,
    this.resolvedAt,
    this.data,
  });

  factory DeviceAlert.fromJson(Map<String, dynamic> json) => _$DeviceAlertFromJson(json);
  Map<String, dynamic> toJson() => _$DeviceAlertToJson(this);

  bool get isCritical => severity == 'critical' || severity == 'high';
  bool get isWarning => severity == 'warning' || severity == 'medium';
  bool get isInfo => severity == 'info' || severity == 'low';
}