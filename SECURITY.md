# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

Kami sangat menghargai upaya Anda untuk membantu menjaga keamanan proyek ini.

### Cara Melaporkan

Jika Anda menemukan vulnerability keamanan:

1. **JANGAN** buat public issue
2. Email langsung ke: **[security@puskesmababakan.go.id]**
3. Sertakan informasi:
   - Deskripsi vulnerability
   - Langkah untuk reproduce
   - Impact yang mungkin
   - Suggested fix (jika ada)

### Response Time

- **Acknowledgment:** Dalam 48 jam
- **Initial assessment:** Dalam 1 minggu
- **Fix timeline:** Tergantung severity

### What to Include

Laporan yang baik harus mencakup:

```
Subject: [Security] Brief description

1. Vulnerability Type
   - XSS, SQL Injection, CSRF, dll

2. Affected Component
   - File/feature yang terpengaruh

3. Steps to Reproduce
   - Step 1
   - Step 2
   - Step 3

4. Impact
   - Apa yang bisa dilakukan attacker

5. Proof of Concept
   - Code snippet atau screenshot

6. Suggested Fix (Optional)
   - Bagaimana cara memperbaiki
```

## Security Best Practices

### Untuk Pengguna

#### GitHub Token
- ✅ Simpan di Apps Script saja (jangan di-commit)
- ✅ Gunakan scope minimal (`repo` saja)
- ✅ Rotate token secara berkala (setiap 90 hari)
- ✅ Jangan share token ke siapapun
- ❌ JANGAN commit token ke repository
- ❌ JANGAN share token di chat/email

#### Data Sensitif
- ✅ Gunakan repository private untuk data sensitif
- ✅ Backup data secara berkala
- ✅ Review akses permissions
- ❌ JANGAN share data pasien/pegawai tanpa izin

#### Google Apps Script
- ✅ Review code sebelum deploy
- ✅ Gunakan authorization scopes minimal
- ✅ Monitor execution logs
- ❌ JANGAN grant excess permissions

### Untuk Developers

#### Code Security
```typescript
// ✅ GOOD: Type-safe
const doctor: Doctor = getDoctorById(id);

// ❌ BAD: Using any
const doctor: any = getDoctorById(id);
```

#### Input Validation
```typescript
// ✅ GOOD: Validate input
if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
  throw new Error('Invalid date format');
}

// ❌ BAD: No validation
const date = userInput; // Could be anything
```

#### XSS Prevention
```typescript
// ✅ GOOD: React auto-escapes
<div>{userInput}</div>

// ❌ BAD: Dangerous
<div dangerouslySetInnerHTML={{__html: userInput}} />
```

#### LocalStorage
```typescript
// ✅ GOOD: Validate before use
const data = localStorage.getItem('key');
if (data) {
  try {
    const parsed = JSON.parse(data);
    // Validate structure before use
  } catch (e) {
    // Handle invalid data
  }
}

// ❌ BAD: Trust blindly
const data = JSON.parse(localStorage.getItem('key'));
```

## Security Features

### Built-in Protections

1. **React XSS Protection**
   - Auto-escape semua output
   - Safe by default

2. **TypeScript Type Safety**
   - Compile-time error detection
   - Prevent type-related bugs

3. **Content Security Policy**
   - Restrict resource loading
   - Prevent code injection

4. **GitHub Token Isolation**
   - Stored in Apps Script only
   - Never exposed to client

### Data Protection

1. **LocalStorage**
   - Browser-only storage
   - Not accessible from server
   - Cleared on browser clear

2. **Export Data**
   - User-initiated only
   - No automatic sharing
   - Encrypted in transit (HTTPS)

3. **Google Sheets**
   - Access controlled by Google
   - Audit logs available
   - Share permissions configurable

## Security Checklist

### Before Deployment

- [ ] Review all code changes
- [ ] Check for hardcoded secrets
- [ ] Validate all inputs
- [ ] Test XSS vulnerabilities
- [ ] Review dependencies
- [ ] Update to latest versions
- [ ] Test in production-like environment

### Regular Maintenance

- [ ] Update dependencies monthly
- [ ] Rotate GitHub token quarterly
- [ ] Review access permissions
- [ ] Check execution logs
- [ ] Backup data regularly
- [ ] Review security advisories

## Known Security Limitations

### LocalStorage
- **Limitation:** Accessible via browser console
- **Mitigation:** Don't store highly sensitive data
- **Workaround:** Use Google Sheets for sensitive data

### Client-Side Validation
- **Limitation:** Can be bypassed
- **Mitigation:** Always validate on server too
- **Workaround:** Use GAS for server-side validation

### GitHub Token
- **Limitation:** Stored in plain text in Apps Script
- **Mitigation:** Use minimal scope, rotate regularly
- **Workaround:** Use GitHub App for better security

## Security Resources

### Tools
- [OWASP ZAP](https://www.zaproxy.org/) - Security testing
- [Snyk](https://snyk.io/) - Vulnerability scanning
- [GitHub Security Advisories](https://github.com/advisories)

### Learning
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [React Security](https://react.dev/learn/thinking-in-react)
- [Apps Script Security](https://developers.google.com/apps-script/guides/support)

## Contact

### Security Issues
- **Email:** security@puskesmababakan.go.id
- **Response Time:** 48 hours

### General Questions
- **Email:** support@puskesmababakan.go.id
- **GitHub Issues:** For non-security issues

---

## Responsible Disclosure

Kami mendukung responsible disclosure:

1. Report vulnerability secara private
2. Beri kami waktu untuk fix
3. Jangan disclose public sebelum ada fix
4. Kami akan acknowledge kontribusi Anda

## Bug Bounty

Saat ini kami belum memiliki program bug bounty, tapi kami sangat menghargai laporan keamanan dan akan mencantumkan nama pelapor di credits (dengan izin).

---

**Last Updated:** 2025-01-15  
**Version:** 1.0  
**Status:** ✅ Active
