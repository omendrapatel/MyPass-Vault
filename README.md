# 🛡️ MyPass Vault v2.0 — 100% Offline Secure Password Manager & 2FA Authenticator

[![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20Windows-blue.svg)](https://mypassvault.com)
[![Encryption](https://img.shields.io/badge/Encryption-AES--256-success.svg)](https://mypassvault.com)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen.svg)](https://mypassvault.com)
[![Theme](https://img.shields.io/badge/Theme-Liquid%20Glass%20%2B%20Dark%20Navy-cyan.svg)](https://mypassvault.com)

> **Zero Cloud. Zero Tracking. 100% Digital Sovereignty.**  
> A privacy-hardened, offline password manager, 2FA TOTP authenticator, and encrypted notes vault for Android and Windows.

---

## ✨ What's New in Version 2.0 (Liquid Glass Update)

- 🧪 **Dynamic Liquid Glass Cyber Theme**: Switch smoothly between the classic Dark Navy and a futuristic Frosted Glass aesthetic with translucent backdrop blur filters and glowing cyan mesh accents in Settings.
- ⌨️ **Native Physical Keyboard Direct Unlock**: Instant physical keyboard typing support for Desktop PIN entry on Windows.
- 🔐 **Dual-Platform Hardening**: Compatible with modern Windows 11/10 and Android 9+ (API 34/36).
- 📦 **Prebuilt Portable Packages**: Instant APK and Windows releases ready for 1-click deployment.

---

## 🚀 Key Features

1. **Military-Grade AES-256 Encryption**:
   - Master PIN, credentials, secure diary entries, and 2FA secrets are cryptographically secured locally using AES-256.
2. **Built-in 2FA / TOTP Authenticator**:
   - Pure offline RFC 6238 TOTP engine with 30-second live countdown circular gauges. Replaces Google Authenticator and Authy.
3. **Decoy Vault (Duress Mode)**:
   - Configure a secondary decoy PIN. Entering it unlocks a completely fake empty vault to protect your data in forced-unlock scenarios.
4. **Security Audit & Health Score**:
   - Live 0–100% security gauge detecting weak passwords, reused credentials, and overdue rotations.
5. **Centralized Recycle Bin (Trash)**:
   - Safe two-step deletion with 30-day auto-purge and 1-tap restore.
6. **Encrypted Markdown Diary**:
   - Store confidential seed phrases, SSH keys, recovery codes, and personal journals with 6 dynamic themes.
7. **Encrypted Offline Backups (`.mypass`)**:
   - Password-protected vault exports for easy transfer between Windows and Android without any cloud server.
8. **Bilingual Support**:
   - Native toggle between English and हिन्दी.

---

## 📥 Downloads

| Platform | Download Link | Version |
| :--- | :--- | :--- |
| **🤖 Android** | [Download app-release.apk](downloads/app-release.apk) | v2.0 (Official APK) |
| **💻 Windows** | [Download MyPass_Setup.exe](downloads/MyPass_Setup.exe) | v2.0 (Official Setup Installer) |

---

## 🛠️ Tech Stack

- **Framework**: Flutter 3.24+ / Dart SDK 3.5+
- **Cryptography**: AES-256, HMAC-SHA1 (TOTP RFC 6238), PBKDF2
- **Storage**: `flutter_secure_storage` (Android KeyStore / Windows DPAPI-backed secure credentials)
- **UI Engine**: Reactive Flutter Custom Painters, BackdropFilter frosted glass, smooth mesh shaders

---

## 📄 License & Privacy

MyPass Vault is designed with **Privacy by Design**. All data is stored locally on the user's device and never leaves the machine.
