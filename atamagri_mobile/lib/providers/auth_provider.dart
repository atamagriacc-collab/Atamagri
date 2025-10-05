import 'package:flutter/foundation.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class AuthProvider extends ChangeNotifier {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  User? _user;
  Map<String, dynamic>? _userProfile;
  bool _isLoading = false;
  String? _errorMessage;

  User? get user => _user;
  Map<String, dynamic>? get userProfile => _userProfile;
  bool get isAuthenticated => _user != null;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  AuthProvider() {
    _initializeAuth();
  }

  void _initializeAuth() {
    _auth.authStateChanges().listen((User? user) {
      _user = user;
      if (user != null) {
        _loadUserProfile();
      } else {
        _userProfile = null;
      }
      notifyListeners();
    });
  }

  Future<void> _loadUserProfile() async {
    if (_user == null) return;

    try {
      final doc = await _firestore.collection('users').doc(_user!.uid).get();
      if (doc.exists) {
        _userProfile = doc.data();
      } else {
        _userProfile = {
          'email': _user!.email,
          'displayName': _user!.displayName,
          'uid': _user!.uid,
          'createdAt': DateTime.now().toIso8601String(),
        };
        await _firestore.collection('users').doc(_user!.uid).set(_userProfile!);
      }
      notifyListeners();
    } catch (e) {
      debugPrint('Error loading user profile: $e');
    }
  }

  Future<bool> signIn(String email, String password) async {
    _setLoading(true);
    _clearError();

    try {
      final credential = await _auth.signInWithEmailAndPassword(
        email: email,
        password: password,
      );
      _user = credential.user;
      await _loadUserProfile();
      _setLoading(false);
      return true;
    } on FirebaseAuthException catch (e) {
      _handleAuthError(e);
      _setLoading(false);
      return false;
    }
  }

  Future<bool> signUp(String email, String password, String displayName) async {
    _setLoading(true);
    _clearError();

    try {
      final credential = await _auth.createUserWithEmailAndPassword(
        email: email,
        password: password,
      );

      _user = credential.user;

      await _user!.updateDisplayName(displayName);

      _userProfile = {
        'email': email,
        'displayName': displayName,
        'uid': _user!.uid,
        'createdAt': DateTime.now().toIso8601String(),
        'role': 'user',
      };

      await _firestore.collection('users').doc(_user!.uid).set(_userProfile!);

      _setLoading(false);
      return true;
    } on FirebaseAuthException catch (e) {
      _handleAuthError(e);
      _setLoading(false);
      return false;
    }
  }

  Future<void> signOut() async {
    await _auth.signOut();
    _user = null;
    _userProfile = null;
    notifyListeners();
  }

  Future<bool> resetPassword(String email) async {
    _setLoading(true);
    _clearError();

    try {
      await _auth.sendPasswordResetEmail(email: email);
      _setLoading(false);
      return true;
    } on FirebaseAuthException catch (e) {
      _handleAuthError(e);
      _setLoading(false);
      return false;
    }
  }

  Future<bool> updateProfile({
    String? displayName,
    String? photoUrl,
    Map<String, dynamic>? additionalData,
  }) async {
    if (_user == null) return false;

    _setLoading(true);

    try {
      if (displayName != null) {
        await _user!.updateDisplayName(displayName);
      }

      if (photoUrl != null) {
        await _user!.updatePhotoURL(photoUrl);
      }

      final updates = <String, dynamic>{};
      if (displayName != null) updates['displayName'] = displayName;
      if (photoUrl != null) updates['photoUrl'] = photoUrl;
      if (additionalData != null) updates.addAll(additionalData);

      if (updates.isNotEmpty) {
        await _firestore.collection('users').doc(_user!.uid).update(updates);
        _userProfile = {..._userProfile!, ...updates};
      }

      _setLoading(false);
      notifyListeners();
      return true;
    } catch (e) {
      _setError('Failed to update profile: ${e.toString()}');
      _setLoading(false);
      return false;
    }
  }

  void _handleAuthError(FirebaseAuthException e) {
    switch (e.code) {
      case 'user-not-found':
        _setError('No user found with this email.');
        break;
      case 'wrong-password':
        _setError('Wrong password provided.');
        break;
      case 'email-already-in-use':
        _setError('An account already exists with this email.');
        break;
      case 'invalid-email':
        _setError('Invalid email address.');
        break;
      case 'weak-password':
        _setError('Password should be at least 6 characters.');
        break;
      case 'network-request-failed':
        _setError('Network error. Please check your connection.');
        break;
      default:
        _setError(e.message ?? 'An error occurred during authentication.');
    }
  }

  void _setLoading(bool value) {
    _isLoading = value;
    notifyListeners();
  }

  void _setError(String message) {
    _errorMessage = message;
    notifyListeners();
  }

  void _clearError() {
    _errorMessage = null;
  }
}