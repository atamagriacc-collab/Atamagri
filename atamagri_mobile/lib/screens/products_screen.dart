import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:go_router/go_router.dart';
import '../models/product.dart';
import '../providers/auth_provider.dart';
import '../widgets/product_card_widget.dart';

class ProductsScreen extends StatefulWidget {
  const ProductsScreen({super.key});

  @override
  State<ProductsScreen> createState() => _ProductsScreenState();
}

class _ProductsScreenState extends State<ProductsScreen> {
  String selectedCategory = 'All';

  final List<String> categories = [
    'All',
    'IoT Sensors',
    'Drones',
    'Software',
    'Packages',
  ];

  final List<Product> products = [
    const Product(
      id: '1',
      name: 'Smart Soil Sensor',
      description: 'Advanced soil monitoring sensor with NPK, pH, moisture, and temperature detection',
      category: 'IoT Sensors',
      price: 299.99,
      imageUrl: 'assets/images/soil_sensor.png',
      features: [
        'Real-time monitoring',
        'Wireless connectivity',
        'Solar powered',
        'Weather resistant',
      ],
      rating: 4.8,
      reviewCount: 127,
    ),
    const Product(
      id: '2',
      name: 'Weather Station Pro',
      description: 'Complete weather monitoring station with cloud connectivity',
      category: 'IoT Sensors',
      price: 599.99,
      imageUrl: 'assets/images/weather_station.png',
      features: [
        'Temperature & humidity',
        'Wind speed & direction',
        'Rain gauge',
        'UV index',
        'Air pressure',
      ],
      rating: 4.9,
      reviewCount: 89,
    ),
    const Product(
      id: '3',
      name: 'AgriDrone X1',
      description: 'Professional agricultural drone for crop monitoring and spraying',
      category: 'Drones',
      price: 4999.99,
      imageUrl: 'assets/images/drone.png',
      features: [
        '30 min flight time',
        'HD camera',
        'GPS navigation',
        'Auto return home',
        'Spray system',
      ],
      rating: 4.7,
      reviewCount: 43,
    ),
  ];

  final List<ProductPackage> packages = [
    const ProductPackage(
      id: 'pkg1',
      title: 'Starter Package',
      subtitle: 'Perfect for small farms',
      price: 999,
      duration: 'per year',
      features: [
        '2 Soil sensors',
        '1 Weather station',
        'Basic analytics',
        'Email support',
        'Monthly reports',
      ],
      imageUrl: 'assets/images/starter_package.png',
    ),
    const ProductPackage(
      id: 'pkg2',
      title: 'Professional Package',
      subtitle: 'For commercial farms',
      price: 2999,
      duration: 'per year',
      features: [
        '5 Soil sensors',
        '2 Weather stations',
        '1 AgriDrone',
        'Advanced analytics',
        'AI recommendations',
        '24/7 support',
        'Weekly reports',
      ],
      isPopular: true,
      imageUrl: 'assets/images/pro_package.png',
    ),
    const ProductPackage(
      id: 'pkg3',
      title: 'Enterprise Package',
      subtitle: 'Complete solution for large operations',
      price: 7999,
      duration: 'per year',
      features: [
        'Unlimited sensors',
        'Multiple weather stations',
        '3 AgriDrones',
        'Custom analytics',
        'AI-powered insights',
        'Dedicated support',
        'Real-time monitoring',
        'API access',
      ],
      imageUrl: 'assets/images/enterprise_package.png',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      appBar: AppBar(
        title: const Text('Products & Packages'),
        centerTitle: true,
        elevation: 0,
        backgroundColor: theme.primaryColor,
        foregroundColor: Colors.white,
      ),
      body: CustomScrollView(
        slivers: [
          SliverToBoxAdapter(
            child: Container(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Smart Agriculture Solutions',
                    style: theme.textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Choose from our range of IoT devices and packages',
                    style: theme.textTheme.bodyMedium?.copyWith(
                      color: Colors.grey[600],
                    ),
                  ),
                ],
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: SizedBox(
              height: 50,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                itemCount: categories.length,
                itemBuilder: (context, index) {
                  final category = categories[index];
                  final isSelected = selectedCategory == category;

                  return Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: FilterChip(
                      label: Text(category),
                      selected: isSelected,
                      onSelected: (selected) {
                        setState(() {
                          selectedCategory = category;
                        });
                      },
                      backgroundColor: Colors.grey[200],
                      selectedColor: theme.primaryColor,
                      labelStyle: TextStyle(
                        color: isSelected ? Colors.white : Colors.black87,
                        fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                      ),
                    ),
                  );
                },
              ),
            ),
          ),
          const SliverToBoxAdapter(
            child: Padding(
              padding: EdgeInsets.all(16),
              child: Text(
                'Featured Packages',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: SizedBox(
              height: 320,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                itemCount: packages.length,
                itemBuilder: (context, index) {
                  final package = packages[index];
                  return _buildPackageCard(package, theme);
                },
              ),
            ),
          ),
          const SliverToBoxAdapter(
            child: Padding(
              padding: EdgeInsets.all(16),
              child: Text(
                'Individual Products',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
          SliverPadding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            sliver: SliverGrid(
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                childAspectRatio: 0.7,
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
              ),
              delegate: SliverChildBuilderDelegate(
                (context, index) {
                  final filteredProducts = selectedCategory == 'All'
                      ? products
                      : products.where((p) => p.category == selectedCategory).toList();

                  if (index >= filteredProducts.length) {
                    return null;
                  }

                  final product = filteredProducts[index];
                  return ProductCardWidget(
                    product: product,
                    onTap: () {
                      context.push('/products/${product.id}');
                    },
                  );
                },
                childCount: selectedCategory == 'All'
                    ? products.length
                    : products.where((p) => p.category == selectedCategory).length,
              ),
            ),
          ),
          const SliverToBoxAdapter(
            child: SizedBox(height: 32),
          ),
        ],
      ),
    );
  }

  Widget _buildPackageCard(ProductPackage package, ThemeData theme) {
    return Container(
      width: 280,
      margin: const EdgeInsets.only(right: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: package.isPopular
            ? Border.all(color: theme.primaryColor, width: 2)
            : null,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (package.isPopular)
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 8),
              decoration: BoxDecoration(
                color: theme.primaryColor,
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(14),
                  topRight: Radius.circular(14),
                ),
              ),
              child: const Center(
                child: Text(
                  'MOST POPULAR',
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 12,
                  ),
                ),
              ),
            ),
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  package.title,
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  package.subtitle,
                  style: TextStyle(
                    color: Colors.grey[600],
                    fontSize: 14,
                  ),
                ),
                const SizedBox(height: 16),
                Row(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(
                      '\$${package.price.toStringAsFixed(0)}',
                      style: TextStyle(
                        fontSize: 32,
                        fontWeight: FontWeight.bold,
                        color: theme.primaryColor,
                      ),
                    ),
                    Text(
                      ' /${package.duration}',
                      style: TextStyle(
                        color: Colors.grey[600],
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                ...package.features.take(4).map((feature) => Padding(
                      padding: const EdgeInsets.only(bottom: 8),
                      child: Row(
                        children: [
                          Icon(
                            Icons.check_circle,
                            color: theme.primaryColor,
                            size: 16,
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              feature,
                              style: const TextStyle(fontSize: 14),
                            ),
                          ),
                        ],
                      ),
                    )),
                const SizedBox(height: 16),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () {
                      context.push('/checkout/package/${package.id}');
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: theme.primaryColor,
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                    child: const Text(
                      'Select Package',
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}