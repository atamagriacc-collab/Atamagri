import 'package:json_annotation/json_annotation.dart';

part 'weather_data.g.dart';

@JsonSerializable()
class WeatherData {
  final String id;
  final double temperature;
  final double humidity;
  final double pressure;
  final double windSpeed;
  final double windDirection;
  final double precipitation;
  final double uvIndex;
  final String weatherCondition;
  final String description;
  final String icon;
  final DateTime timestamp;
  final double? feelsLike;
  final double? visibility;
  final double? cloudCover;
  final double? dewPoint;
  final WeatherLocation? location;

  WeatherData({
    required this.id,
    required this.temperature,
    required this.humidity,
    required this.pressure,
    required this.windSpeed,
    required this.windDirection,
    required this.precipitation,
    required this.uvIndex,
    required this.weatherCondition,
    required this.description,
    required this.icon,
    required this.timestamp,
    this.feelsLike,
    this.visibility,
    this.cloudCover,
    this.dewPoint,
    this.location,
  });

  factory WeatherData.fromJson(Map<String, dynamic> json) => _$WeatherDataFromJson(json);
  Map<String, dynamic> toJson() => _$WeatherDataToJson(this);

  String get temperatureDisplay => '${temperature.toStringAsFixed(1)}°C';
  String get humidityDisplay => '${humidity.toStringAsFixed(0)}%';
  String get windSpeedDisplay => '${windSpeed.toStringAsFixed(1)} km/h';
  String get precipitationDisplay => '${precipitation.toStringAsFixed(1)} mm';

  String get weatherIconUrl {
    return 'https://openweathermap.org/img/wn/$icon@2x.png';
  }

  bool get isGoodWeather {
    return !['Rain', 'Snow', 'Thunderstorm', 'Drizzle'].contains(weatherCondition);
  }

  String get shortDescription {
    if (temperature > 30) return 'Hot';
    if (temperature > 20) return 'Warm';
    if (temperature > 10) return 'Cool';
    return 'Cold';
  }
}

@JsonSerializable()
class WeatherLocation {
  final double latitude;
  final double longitude;
  final String? city;
  final String? country;

  WeatherLocation({
    required this.latitude,
    required this.longitude,
    this.city,
    this.country,
  });

  factory WeatherLocation.fromJson(Map<String, dynamic> json) => _$WeatherLocationFromJson(json);
  Map<String, dynamic> toJson() => _$WeatherLocationToJson(this);

  String get displayName {
    if (city != null && country != null) {
      return '$city, $country';
    }
    return '${latitude.toStringAsFixed(2)}, ${longitude.toStringAsFixed(2)}';
  }
}