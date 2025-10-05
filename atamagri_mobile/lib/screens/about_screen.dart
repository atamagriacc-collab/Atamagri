import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

class AboutScreen extends StatelessWidget {
  const AboutScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('About ATAMAGRI'),
        backgroundColor: theme.primaryColor,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            _buildHeader(theme),
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                children: [
                  _buildInfoSection(theme),
                  const SizedBox(height: 24),
                  _buildFeaturesSection(theme),
                  const SizedBox(height: 24),
                  _buildTeamSection(theme),
                  const SizedBox(height: 24),
                  _buildContactSection(theme),
                  const SizedBox(height: 24),
                  _buildVersionInfo(theme),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader(ThemeData theme) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(32),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [theme.primaryColor, theme.primaryColor.withOpacity(0.7)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      child: Column(
        children: [
          Container(
            width: 100,
            height: 100,
            decoration: BoxDecoration(
              color: Colors.white,
              shape: BoxShape.circle,
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.1),
                  blurRadius: 10,
                  offset: const Offset(0, 5),
                ),
              ],
            ),
            child: Icon(
              Icons.agriculture,
              size: 60,
              color: theme.primaryColor,
            ),
          ),
          const SizedBox(height: 16),
          const Text(
            'ATAMAGRI',
            style: TextStyle(
              color: Colors.white,
              fontSize: 32,
              fontWeight: FontWeight.bold,
              letterSpacing: 2,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Smart Agriculture IoT Platform',
            style: TextStyle(
              color: Colors.white,
              fontSize: 16,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoSection(ThemeData theme) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(Icons.info, color: theme.primaryColor),
                const SizedBox(width: 8),
                Text(
                  'About Us',
                  style: theme.textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            const Text(
              'ATAMAGRI is a cutting-edge smart agriculture platform that leverages IoT technology and artificial intelligence to revolutionize farming practices.',
              style: TextStyle(fontSize: 16, height: 1.5),
            ),
            const SizedBox(height: 12),
            const Text(
              'Our mission is to empower farmers with real-time data insights, predictive analytics, and automated farming solutions to maximize crop yields while minimizing resource usage.',
              style: TextStyle(fontSize: 16, height: 1.5),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFeaturesSection(ThemeData theme) {
    final features = [
      {'icon': Icons.sensors, 'title': 'IoT Sensors', 'description': 'Real-time monitoring of soil, weather, and crop conditions'},
      {'icon': Icons.psychology, 'title': 'AI Analytics', 'description': 'Intelligent predictions and recommendations'},
      {'icon': Icons.water_drop, 'title': 'Smart Irrigation', 'description': 'Automated water management system'},
      {'icon': Icons.bug_report, 'title': 'Disease Detection', 'description': 'Early detection of crop diseases'},
      {'icon': Icons.flight, 'title': 'Drone Integration', 'description': 'Aerial surveillance and monitoring'},
      {'icon': Icons.cloud_sync, 'title': 'Cloud Platform', 'description': 'Secure data storage and synchronization'},
    ];

    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(Icons.star, color: theme.primaryColor),
                const SizedBox(width: 8),
                Text(
                  'Key Features',
                  style: theme.textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            ...features.map((feature) => Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: Row(
                    children: [
                      Container(
                        width: 40,
                        height: 40,
                        decoration: BoxDecoration(
                          color: theme.primaryColor.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Icon(
                          feature['icon'] as IconData,
                          color: theme.primaryColor,
                          size: 24,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              feature['title'] as String,
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 15,
                              ),
                            ),
                            Text(
                              feature['description'] as String,
                              style: TextStyle(
                                fontSize: 13,
                                color: Colors.grey[600],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                )),
          ],
        ),
      ),
    );
  }

  Widget _buildTeamSection(ThemeData theme) {
    final teamMembers = [
      {'name': 'Dr. Sarah Johnson', 'role': 'CEO & Founder', 'image': Icons.person},
      {'name': 'Mark Chen', 'role': 'CTO', 'image': Icons.person},
      {'name': 'Emily Rodriguez', 'role': 'Head of AI', 'image': Icons.person},
      {'name': 'James Wilson', 'role': 'Lead IoT Engineer', 'image': Icons.person},
    ];

    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(Icons.group, color: theme.primaryColor),
                const SizedBox(width: 8),
                Text(
                  'Our Team',
                  style: theme.textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            SizedBox(
              height: 120,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                itemCount: teamMembers.length,
                itemBuilder: (context, index) {
                  final member = teamMembers[index];
                  return Container(
                    width: 100,
                    margin: const EdgeInsets.only(right: 12),
                    child: Column(
                      children: [
                        CircleAvatar(
                          radius: 30,
                          backgroundColor: theme.primaryColor.withOpacity(0.1),
                          child: Icon(
                            member['image'] as IconData,
                            color: theme.primaryColor,
                            size: 30,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          member['name'] as String,
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 12,
                          ),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                        Text(
                          member['role'] as String,
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 11,
                            color: Colors.grey[600],
                          ),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildContactSection(ThemeData theme) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(Icons.contact_support, color: theme.primaryColor),
                const SizedBox(width: 8),
                Text(
                  'Contact Us',
                  style: theme.textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            ListTile(
              leading: Icon(Icons.email, color: theme.primaryColor),
              title: const Text('Email'),
              subtitle: const Text('support@atamagri.com'),
              onTap: () => _launchUrl('mailto:support@atamagri.com'),
            ),
            ListTile(
              leading: Icon(Icons.phone, color: theme.primaryColor),
              title: const Text('Phone'),
              subtitle: const Text('+1 (555) 123-4567'),
              onTap: () => _launchUrl('tel:+15551234567'),
            ),
            ListTile(
              leading: Icon(Icons.language, color: theme.primaryColor),
              title: const Text('Website'),
              subtitle: const Text('www.atamagri.com'),
              onTap: () => _launchUrl('https://www.atamagri.com'),
            ),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                IconButton(
                  icon: Icon(Icons.facebook, color: theme.primaryColor),
                  onPressed: () => _launchUrl('https://facebook.com/atamagri'),
                  iconSize: 32,
                ),
                IconButton(
                  icon: Icon(Icons.link, color: theme.primaryColor),
                  onPressed: () => _launchUrl('https://twitter.com/atamagri'),
                  iconSize: 32,
                ),
                IconButton(
                  icon: Icon(Icons.camera_alt, color: theme.primaryColor),
                  onPressed: () => _launchUrl('https://instagram.com/atamagri'),
                  iconSize: 32,
                ),
                IconButton(
                  icon: Icon(Icons.work, color: theme.primaryColor),
                  onPressed: () => _launchUrl('https://linkedin.com/company/atamagri'),
                  iconSize: 32,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildVersionInfo(ThemeData theme) {
    return Column(
      children: [
        const Text(
          'Version 1.0.0',
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          'Build 2024.09.24',
          style: TextStyle(
            fontSize: 12,
            color: Colors.grey[600],
          ),
        ),
        const SizedBox(height: 16),
        TextButton(
          onPressed: () => _showLicenses(null),
          child: const Text('Open Source Licenses'),
        ),
        const SizedBox(height: 8),
        Text(
          '© 2024 ATAMAGRI. All rights reserved.',
          style: TextStyle(
            fontSize: 12,
            color: Colors.grey[600],
          ),
        ),
      ],
    );
  }

  Future<void> _launchUrl(String url) async {
    final Uri uri = Uri.parse(url);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    }
  }

  void _showLicenses(BuildContext? context) {
    if (context != null) {
      showLicensePage(
        context: context,
        applicationName: 'ATAMAGRI',
        applicationVersion: '1.0.0',
        applicationIcon: Container(
          width: 60,
          height: 60,
          decoration: BoxDecoration(
            color: Theme.of(context).primaryColor.withOpacity(0.1),
            shape: BoxShape.circle,
          ),
          child: Icon(
            Icons.agriculture,
            color: Theme.of(context).primaryColor,
            size: 40,
          ),
        ),
      );
    }
  }
}