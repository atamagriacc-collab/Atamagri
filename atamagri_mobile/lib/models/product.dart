import 'package:equatable/equatable.dart';

class Product extends Equatable {
  final String id;
  final String name;
  final String description;
  final String category;
  final double price;
  final String imageUrl;
  final List<String> features;
  final bool inStock;
  final double rating;
  final int reviewCount;

  const Product({
    required this.id,
    required this.name,
    required this.description,
    required this.category,
    required this.price,
    required this.imageUrl,
    required this.features,
    this.inStock = true,
    this.rating = 0.0,
    this.reviewCount = 0,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      description: json['description'] ?? '',
      category: json['category'] ?? '',
      price: (json['price'] ?? 0.0).toDouble(),
      imageUrl: json['imageUrl'] ?? '',
      features: List<String>.from(json['features'] ?? []),
      inStock: json['inStock'] ?? true,
      rating: (json['rating'] ?? 0.0).toDouble(),
      reviewCount: json['reviewCount'] ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'category': category,
      'price': price,
      'imageUrl': imageUrl,
      'features': features,
      'inStock': inStock,
      'rating': rating,
      'reviewCount': reviewCount,
    };
  }

  @override
  List<Object?> get props => [
        id,
        name,
        description,
        category,
        price,
        imageUrl,
        features,
        inStock,
        rating,
        reviewCount,
      ];
}

class ProductPackage extends Equatable {
  final String id;
  final String title;
  final String subtitle;
  final double price;
  final String duration;
  final List<String> features;
  final bool isPopular;
  final String imageUrl;

  const ProductPackage({
    required this.id,
    required this.title,
    required this.subtitle,
    required this.price,
    required this.duration,
    required this.features,
    this.isPopular = false,
    required this.imageUrl,
  });

  factory ProductPackage.fromJson(Map<String, dynamic> json) {
    return ProductPackage(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      subtitle: json['subtitle'] ?? '',
      price: (json['price'] ?? 0.0).toDouble(),
      duration: json['duration'] ?? '',
      features: List<String>.from(json['features'] ?? []),
      isPopular: json['isPopular'] ?? false,
      imageUrl: json['imageUrl'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'subtitle': subtitle,
      'price': price,
      'duration': duration,
      'features': features,
      'isPopular': isPopular,
      'imageUrl': imageUrl,
    };
  }

  @override
  List<Object?> get props => [
        id,
        title,
        subtitle,
        price,
        duration,
        features,
        isPopular,
        imageUrl,
      ];
}