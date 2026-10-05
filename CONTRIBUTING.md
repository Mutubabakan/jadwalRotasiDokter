# Contributing to Jadwal Rotasi Dokter

Terima kasih atas minat Anda untuk berkontribusi! 🎉

---

## 🎯 Cara Berkontribusi

### 1. Report Bugs
Jika menemukan bug, silakan buat issue dengan informasi:
- Deskripsi bug
- Langkah untuk reproduce
- Expected vs actual behavior
- Screenshot (jika perlu)
- Environment (browser, device, OS)

### 2. Suggest Features
Punya ide fitur baru? Buat issue dengan label `enhancement`:
- Deskripsi fitur
- Use case / manfaat
- Mockup (jika ada)

### 3. Submit Code
Langkah-langkah:
1. Fork repository
2. Clone ke lokal
   ```bash
   git clone https://github.com/username/jadwal-rotasi-dokter.git
   cd jadwal-rotasi-dokter
   ```
3. Buat branch baru
   ```bash
   git checkout -b feature/nama-fitur
   # atau
   git checkout -b fix/nama-bug
   ```
4. Buat perubahan
5. Test perubahan
6. Commit dengan pesan yang jelas
   ```bash
   git commit -m "feat: tambah fitur auto schedule"
   # atau
   git commit -m "fix: perbaiki bug drag drop di mobile"
   ```
7. Push ke fork
   ```bash
   git push origin feature/nama-fitur
   ```
8. Buat Pull Request

---

## 📝 Commit Message Format

Gunakan format Conventional Commits:

```
<type>: <description>

[optional body]

[optional footer]
```

### Types
- **feat**: Fitur baru
- **fix**: Bug fix
- **docs**: Dokumentasi
- **style**: Formatting, missing semi colons, dll
- **refactor**: Refactoring code
- **test**: Menambah atau update test
- **chore**: Maintenance, dependencies, dll

### Examples
```
feat: tambah color picker neon mode
fix: perbaiki auto sync tidak berjalan
docs: update README dengan screenshot
style: format code dengan prettier
refactor: simplify drag drop logic
test: add unit test for schedule rotation
chore: update dependencies
```

---

## 🎨 Code Style

### TypeScript
- Gunakan TypeScript strict mode
- Type semua variables dan functions
- Hindari `any` type
- Gunakan interfaces untuk objects

### React
- Functional components dengan hooks
- Gunakan TypeScript untuk props
- Pisahkan logic ke custom hooks jika kompleks
- Gunakan memoization untuk performance critical components

### CSS/Tailwind
- Gunakan Tailwind utility classes
- Hindari inline styles (kecuali dynamic)
- Mobile-first approach
- Gunakan semantic class names

### File Organization
```
src/
├── components/          # React components
│   ├── JadwalTab.tsx
│   ├── DokterTab.tsx
│   └── SettingTab.tsx
├── utils/              # Utility functions
│   ├── storage.ts
│   └── types.ts
├── hooks/              # Custom hooks (jika ada)
└── App.tsx             # Main app
```

---

## 🧪 Testing

Sebelum submit PR:
1. Test di browser desktop
2. Test di mobile browser
3. Test di mobile webview (jika bisa)
4. Jalankan build
   ```bash
   npm run build
   ```
5. Pastikan tidak ada error

### Manual Testing Checklist
- [ ] Drag & drop bekerja di desktop
- [ ] Tap to select bekerja di mobile
- [ ] Auto schedule menghasilkan jadwal yang benar
- [ ] Auto update melanjutkan rotasi dengan benar
- [ ] Color picker bekerja (standar, neon, custom)
- [ ] Hari libur muncul di jadwal
- [ ] Export/Import data bekerja
- [ ] Clone app bekerja
- [ ] Reset data bekerja
- [ ] Responsive di berbagai ukuran layar

---

## 📚 Documentation

Jika menambah fitur baru:
1. Update README.md (jika perlu)
2. Update CHANGELOG.md
3. Tambahkan komentar di code
4. Update dokumentasi GAS (jika terkait)

---

## 🔄 Pull Request Process

### 1. Create PR
- Title yang jelas dan deskriptif
- Deskripsi perubahan
- Link ke issue (jika ada)
- Screenshot/video (jika UI change)

### 2. PR Template
```markdown
## Description
Jelaskan perubahan yang dilakukan

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested di desktop browser
- [ ] Tested di mobile browser
- [ ] Tested di mobile webview
- [ ] Build successful

## Screenshots
(jika ada perubahan UI)

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests added/updated (jika ada)
```

### 3. Review Process
- Maintainer akan review PR
- Mungkin ada request changes
- Setelah approved, akan di-merge

---

## 🎨 Design Guidelines

### Color Palette
- Primary: Purple (`#9b59b6`)
- Secondary: Pink (`#e91e8c`)
- Background: Light (`#f0eef5`)
- Text: Dark (`#2d2d3d`)

### Typography
- Font: System fonts (San Francisco, Segoe UI, Roboto)
- Sizes: 10px - 14px untuk mobile
- Weights: 400 (normal), 600 (semibold), 700 (bold)

### Spacing
- Mobile: 8px - 16px padding
- Desktop: 16px - 24px padding
- Border radius: 8px - 16px

### Icons
- Library: Lucide React
- Size: 12px - 20px
- Color: Inherit dari parent

---

## 🐛 Debugging Tips

### Common Issues

#### Drag & Drop tidak bekerja di mobile
**Solusi:** Gunakan tap to select sebagai fallback

#### Export download tidak bekerja
**Solusi:** Gunakan opsi "Copy to Clipboard"

#### Hari libur tidak muncul
**Solusi:** Cek tahun di tab Setting, pastikan sudah tambah libur untuk tahun tersebut

#### Warna tidak berubah
**Solusi:** Clear cache browser, hard refresh (Ctrl+Shift+R)

---

## 📦 Build & Deploy

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Deploy
Upload folder `dist/` ke hosting:
- Netlify
- Vercel
- GitHub Pages
- Firebase Hosting
- Atau hosting lainnya

---

## 🤝 Community

### Communication
- GitHub Issues untuk bugs dan features
- GitHub Discussions untuk questions
- Pull Requests untuk code contributions

### Code of Conduct
- Be respectful
- Be inclusive
- Be constructive
- Focus on what's best for the community

---

## 🎓 Learning Resources

### React & TypeScript
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app)

### Tailwind CSS
- [Tailwind Documentation](https://tailwindcss.com/docs)
- [Tailwind Cheat Sheet](https://tailwindcomponents.com/cheatsheet)

### Google Apps Script
- [Apps Script Documentation](https://developers.google.com/apps-script)
- [Apps Script Samples](https://developers.google.com/apps-script/samples)

---

## 🏆 Recognition

Contributors akan dicantumkan di:
- README.md (Contributors section)
- CHANGELOG.md
- Release notes

---

## ❓ Questions?

Jika ada pertanyaan:
1. Cek dokumentasi (README, FAQ, dll)
2. Cari di issues (mungkin sudah ada yang tanya)
3. Buat issue baru dengan label `question`

---

## 🎉 Thank You!

Terima kasih sudah berkontribusi! Setiap kontribusi, sekecil apapun, sangat berarti. 💜

---

**Happy Coding!** 🚀
