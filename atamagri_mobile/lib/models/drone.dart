import 'package:equatable/equatable.dart';

class Drone extends Equatable {
  final String id;
  final String name;
  final String status;
  final double battery;
  final DronePosition position;
  final bool isConnected;
  final String lastSeen;
  final DroneMetrics metrics;

  const Drone({
    required this.id,
    required this.name,
    required this.status,
    required this.battery,
    required this.position,
    required this.isConnected,
    required this.lastSeen,
    required this.metrics,
  });

  factory Drone.fromJson(Map<String, dynamic> json) {
    return Drone(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      status: json['status'] ?? 'idle',
      battery: (json['battery'] ?? 0.0).toDouble(),
      position: DronePosition.fromJson(json['position'] ?? {}),
      isConnected: json['isConnected'] ?? false,
      lastSeen: json['lastSeen'] ?? DateTime.now().toIso8601String(),
      metrics: DroneMetrics.fromJson(json['metrics'] ?? {}),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'status': status,
      'battery': battery,
      'position': position.toJson(),
      'isConnected': isConnected,
      'lastSeen': lastSeen,
      'metrics': metrics.toJson(),
    };
  }

  @override
  List<Object?> get props => [
        id,
        name,
        status,
        battery,
        position,
        isConnected,
        lastSeen,
        metrics,
      ];
}

class DronePosition extends Equatable {
  final double latitude;
  final double longitude;
  final double altitude;
  final double speed;
  final double heading;

  const DronePosition({
    required this.latitude,
    required this.longitude,
    required this.altitude,
    required this.speed,
    required this.heading,
  });

  factory DronePosition.fromJson(Map<String, dynamic> json) {
    return DronePosition(
      latitude: (json['latitude'] ?? 0.0).toDouble(),
      longitude: (json['longitude'] ?? 0.0).toDouble(),
      altitude: (json['altitude'] ?? 0.0).toDouble(),
      speed: (json['speed'] ?? 0.0).toDouble(),
      heading: (json['heading'] ?? 0.0).toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'latitude': latitude,
      'longitude': longitude,
      'altitude': altitude,
      'speed': speed,
      'heading': heading,
    };
  }

  @override
  List<Object?> get props => [latitude, longitude, altitude, speed, heading];
}

class DroneMetrics extends Equatable {
  final double flightTime;
  final double distance;
  final int missionsCompleted;
  final double areaCovered;

  const DroneMetrics({
    required this.flightTime,
    required this.distance,
    required this.missionsCompleted,
    required this.areaCovered,
  });

  factory DroneMetrics.fromJson(Map<String, dynamic> json) {
    return DroneMetrics(
      flightTime: (json['flightTime'] ?? 0.0).toDouble(),
      distance: (json['distance'] ?? 0.0).toDouble(),
      missionsCompleted: json['missionsCompleted'] ?? 0,
      areaCovered: (json['areaCovered'] ?? 0.0).toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'flightTime': flightTime,
      'distance': distance,
      'missionsCompleted': missionsCompleted,
      'areaCovered': areaCovered,
    };
  }

  @override
  List<Object?> get props =>
      [flightTime, distance, missionsCompleted, areaCovered];
}

class DroneMission extends Equatable {
  final String id;
  final String droneId;
  final String type;
  final String status;
  final DateTime startTime;
  final DateTime? endTime;
  final List<DroneWaypoint> waypoints;
  final Map<String, dynamic> parameters;

  const DroneMission({
    required this.id,
    required this.droneId,
    required this.type,
    required this.status,
    required this.startTime,
    this.endTime,
    required this.waypoints,
    required this.parameters,
  });

  factory DroneMission.fromJson(Map<String, dynamic> json) {
    return DroneMission(
      id: json['id'] ?? '',
      droneId: json['droneId'] ?? '',
      type: json['type'] ?? 'survey',
      status: json['status'] ?? 'pending',
      startTime: DateTime.parse(json['startTime'] ?? DateTime.now().toIso8601String()),
      endTime: json['endTime'] != null ? DateTime.parse(json['endTime']) : null,
      waypoints: (json['waypoints'] as List? ?? [])
          .map((w) => DroneWaypoint.fromJson(w))
          .toList(),
      parameters: json['parameters'] ?? {},
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'droneId': droneId,
      'type': type,
      'status': status,
      'startTime': startTime.toIso8601String(),
      'endTime': endTime?.toIso8601String(),
      'waypoints': waypoints.map((w) => w.toJson()).toList(),
      'parameters': parameters,
    };
  }

  @override
  List<Object?> get props => [
        id,
        droneId,
        type,
        status,
        startTime,
        endTime,
        waypoints,
        parameters,
      ];
}

class DroneWaypoint extends Equatable {
  final double latitude;
  final double longitude;
  final double altitude;
  final int order;
  final String action;

  const DroneWaypoint({
    required this.latitude,
    required this.longitude,
    required this.altitude,
    required this.order,
    required this.action,
  });

  factory DroneWaypoint.fromJson(Map<String, dynamic> json) {
    return DroneWaypoint(
      latitude: (json['latitude'] ?? 0.0).toDouble(),
      longitude: (json['longitude'] ?? 0.0).toDouble(),
      altitude: (json['altitude'] ?? 0.0).toDouble(),
      order: json['order'] ?? 0,
      action: json['action'] ?? 'fly_to',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'latitude': latitude,
      'longitude': longitude,
      'altitude': altitude,
      'order': order,
      'action': action,
    };
  }

  @override
  List<Object?> get props => [latitude, longitude, altitude, order, action];
}