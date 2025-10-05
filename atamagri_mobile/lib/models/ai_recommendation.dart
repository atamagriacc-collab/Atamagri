import 'package:json_annotation/json_annotation.dart';

part 'ai_recommendation.g.dart';

enum RecommendationType {
  irrigation,
  fertilization,
  pestControl,
  harvesting,
  planting,
  soilManagement,
  weatherAlert,
  diseaseDetection,
  yieldOptimization,
  general
}

enum RecommendationPriority { high, medium, low }

enum RecommendationStatus { pending, inProgress, completed, dismissed }

@JsonSerializable()
class AIRecommendation {
  final String id;
  final String title;
  final String description;
  final RecommendationType type;
  final RecommendationPriority priority;
  final RecommendationStatus status;
  final double confidence;
  final String? farmId;
  final String? farmName;
  final String? fieldId;
  final String? fieldName;
  final List<String>? affectedCrops;
  final List<RecommendationAction> actions;
  final Map<String, dynamic>? data;
  final Map<String, dynamic>? impact;
  final DateTime createdAt;
  final DateTime? validUntil;
  final DateTime? completedAt;
  final String? completedBy;
  final String? dismissedReason;
  final List<String>? tags;
  final AIInsight? insight;
  final List<String>? imageUrls;

  AIRecommendation({
    required this.id,
    required this.title,
    required this.description,
    required this.type,
    required this.priority,
    required this.status,
    required this.confidence,
    this.farmId,
    this.farmName,
    this.fieldId,
    this.fieldName,
    this.affectedCrops,
    required this.actions,
    this.data,
    this.impact,
    required this.createdAt,
    this.validUntil,
    this.completedAt,
    this.completedBy,
    this.dismissedReason,
    this.tags,
    this.insight,
    this.imageUrls,
  });

  factory AIRecommendation.fromJson(Map<String, dynamic> json) => _$AIRecommendationFromJson(json);
  Map<String, dynamic> toJson() => _$AIRecommendationToJson(this);

  String get typeDisplay {
    switch (type) {
      case RecommendationType.irrigation:
        return 'Irrigation';
      case RecommendationType.fertilization:
        return 'Fertilization';
      case RecommendationType.pestControl:
        return 'Pest Control';
      case RecommendationType.harvesting:
        return 'Harvesting';
      case RecommendationType.planting:
        return 'Planting';
      case RecommendationType.soilManagement:
        return 'Soil Management';
      case RecommendationType.weatherAlert:
        return 'Weather Alert';
      case RecommendationType.diseaseDetection:
        return 'Disease Detection';
      case RecommendationType.yieldOptimization:
        return 'Yield Optimization';
      case RecommendationType.general:
        return 'General';
    }
  }

  String get priorityDisplay {
    switch (priority) {
      case RecommendationPriority.high:
        return 'High Priority';
      case RecommendationPriority.medium:
        return 'Medium Priority';
      case RecommendationPriority.low:
        return 'Low Priority';
    }
  }

  String get statusDisplay {
    switch (status) {
      case RecommendationStatus.pending:
        return 'Pending';
      case RecommendationStatus.inProgress:
        return 'In Progress';
      case RecommendationStatus.completed:
        return 'Completed';
      case RecommendationStatus.dismissed:
        return 'Dismissed';
    }
  }

  String get confidenceDisplay => '${(confidence * 100).toStringAsFixed(0)}%';

  bool get isExpired {
    if (validUntil == null) return false;
    return DateTime.now().isAfter(validUntil!);
  }

  bool get isActive {
    return status == RecommendationStatus.pending || status == RecommendationStatus.inProgress;
  }

  bool get isHighPriority => priority == RecommendationPriority.high;

  String? get locationDisplay {
    if (fieldName != null) return fieldName;
    if (farmName != null) return farmName;
    return null;
  }

  Duration? get timeRemaining {
    if (validUntil == null) return null;
    final now = DateTime.now();
    if (now.isAfter(validUntil!)) return null;
    return validUntil!.difference(now);
  }

  String? get timeRemainingDisplay {
    final remaining = timeRemaining;
    if (remaining == null) return null;

    if (remaining.inDays > 0) {
      return '${remaining.inDays} days';
    } else if (remaining.inHours > 0) {
      return '${remaining.inHours} hours';
    } else {
      return '${remaining.inMinutes} minutes';
    }
  }

  double? get estimatedImpact {
    if (impact == null) return null;
    return impact!['estimatedValue'] as double?;
  }

  String? get impactDisplay {
    if (impact == null) return null;
    final value = impact!['value'];
    final unit = impact!['unit'] ?? '';
    final type = impact!['type'] ?? '';

    if (value != null) {
      return '$type: $value $unit'.trim();
    }
    return null;
  }
}

@JsonSerializable()
class RecommendationAction {
  final String id;
  final String title;
  final String? description;
  final String? icon;
  final bool isCompleted;
  final DateTime? completedAt;
  final Map<String, dynamic>? parameters;
  final String? estimatedDuration;
  final String? requiredResources;

  RecommendationAction({
    required this.id,
    required this.title,
    this.description,
    this.icon,
    this.isCompleted = false,
    this.completedAt,
    this.parameters,
    this.estimatedDuration,
    this.requiredResources,
  });

  factory RecommendationAction.fromJson(Map<String, dynamic> json) => _$RecommendationActionFromJson(json);
  Map<String, dynamic> toJson() => _$RecommendationActionToJson(this);
}

@JsonSerializable()
class AIInsight {
  final String summary;
  final String? reasoning;
  final double? confidenceScore;
  final List<String>? factors;
  final Map<String, dynamic>? historicalData;
  final Map<String, dynamic>? predictions;
  final List<String>? references;
  final String? model;
  final DateTime generatedAt;

  AIInsight({
    required this.summary,
    this.reasoning,
    this.confidenceScore,
    this.factors,
    this.historicalData,
    this.predictions,
    this.references,
    this.model,
    required this.generatedAt,
  });

  factory AIInsight.fromJson(Map<String, dynamic> json) => _$AIInsightFromJson(json);
  Map<String, dynamic> toJson() => _$AIInsightToJson(this);

  String get confidenceDisplay {
    if (confidenceScore == null) return 'N/A';
    return '${(confidenceScore! * 100).toStringAsFixed(0)}%';
  }

  bool get hasHighConfidence {
    if (confidenceScore == null) return false;
    return confidenceScore! > 0.8;
  }
}