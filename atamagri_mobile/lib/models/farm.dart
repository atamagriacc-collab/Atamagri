import 'package:json_annotation/json_annotation.dart';
import 'device.dart';

part 'farm.g.dart';

@JsonSerializable()
class Farm {
  final String id;
  final String name;
  final String? description;
  final double area;
  final String areaUnit;
  final FarmLocation location;
  final List<String> cropTypes;
  final String soilType;
  final String irrigationType;
  final String ownerId;
  final String? ownerName;
  final DateTime createdAt;
  final DateTime updatedAt;
  final List<Device>? devices;
  final FarmStatistics? statistics;
  final String? imageUrl;

  Farm({
    required this.id,
    required this.name,
    this.description,
    required this.area,
    this.areaUnit = 'acres',
    required this.location,
    required this.cropTypes,
    required this.soilType,
    required this.irrigationType,
    required this.ownerId,
    this.ownerName,
    required this.createdAt,
    required this.updatedAt,
    this.devices,
    this.statistics,
    this.imageUrl,
  });

  factory Farm.fromJson(Map<String, dynamic> json) => _$FarmFromJson(json);
  Map<String, dynamic> toJson() => _$FarmToJson(this);

  String get areaDisplay => '$area $areaUnit';

  String get primaryCrop => cropTypes.isNotEmpty ? cropTypes.first : 'No crops';

  int get deviceCount => devices?.length ?? 0;

  int get activeDeviceCount {
    return devices?.where((d) => d.status == DeviceStatus.active).length ?? 0;
  }

  bool get hasActiveDevices => activeDeviceCount > 0;

  String get locationDisplay => location.displayName;
}

@JsonSerializable()
class FarmLocation {
  final double latitude;
  final double longitude;
  final String? address;
  final String? city;
  final String? state;
  final String? country;
  final String? postalCode;

  FarmLocation({
    required this.latitude,
    required this.longitude,
    this.address,
    this.city,
    this.state,
    this.country,
    this.postalCode,
  });

  factory FarmLocation.fromJson(Map<String, dynamic> json) => _$FarmLocationFromJson(json);
  Map<String, dynamic> toJson() => _$FarmLocationToJson(this);

  String get displayName {
    final parts = <String>[];
    if (address != null) parts.add(address!);
    if (city != null) parts.add(city!);
    if (state != null) parts.add(state!);
    if (country != null) parts.add(country!);

    if (parts.isNotEmpty) {
      return parts.join(', ');
    }

    return '${latitude.toStringAsFixed(4)}, ${longitude.toStringAsFixed(4)}';
  }

  String get shortAddress {
    if (city != null && state != null) {
      return '$city, $state';
    }
    if (city != null) {
      return city!;
    }
    return displayName;
  }
}

@JsonSerializable()
class FarmStatistics {
  final double averageYield;
  final double waterUsage;
  final double energyUsage;
  final double soilHealth;
  final double cropHealth;
  final int totalHarvests;
  final double totalRevenue;
  final DateTime? lastHarvestDate;
  final DateTime? nextPlantingDate;

  FarmStatistics({
    required this.averageYield,
    required this.waterUsage,
    required this.energyUsage,
    required this.soilHealth,
    required this.cropHealth,
    required this.totalHarvests,
    required this.totalRevenue,
    this.lastHarvestDate,
    this.nextPlantingDate,
  });

  factory FarmStatistics.fromJson(Map<String, dynamic> json) => _$FarmStatisticsFromJson(json);
  Map<String, dynamic> toJson() => _$FarmStatisticsToJson(this);

  String get soilHealthStatus {
    if (soilHealth > 80) return 'Excellent';
    if (soilHealth > 60) return 'Good';
    if (soilHealth > 40) return 'Fair';
    return 'Poor';
  }

  String get cropHealthStatus {
    if (cropHealth > 80) return 'Excellent';
    if (cropHealth > 60) return 'Good';
    if (cropHealth > 40) return 'Fair';
    return 'Poor';
  }
}