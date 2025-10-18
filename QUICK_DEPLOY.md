# ⚡ Hızlı Deployment Rehberi

## 🚀 Tek Komutla Deployment

### Windows için:
```bash
# Otomatik deployment
npm run deploy:windows

# Veya batch dosyasını çalıştır
deploy.bat
```

### Linux/Mac için:
```bash
# Otomatik deployment
npm run deploy:auto

# Veya shell script'i çalıştır
chmod +x deploy.sh
./deploy.sh
```

## 📋 Manuel Adımlar

1. **Değişiklikleri commit et:**
   ```bash
   git add .
   git commit -m "🚀 Deploy to production"
   ```

2. **Main branch'e push et:**
   ```bash
   git push origin main
   ```

3. **GitHub Actions'ı kontrol et:**
   - Repository'nizde **Actions** sekmesine gidin
   - Deployment'ın başarılı olduğunu kontrol edin

## 🌐 Site URL'niz:
**https://ottosokpoes-del.github.io/ss/**

## ⚙️ GitHub Pages Ayarları

1. Repository **Settings > Pages** bölümüne gidin
2. **Source**: "GitHub Actions" seçin
3. **Enforce HTTPS** aktif edin

## 🔧 Sorun Giderme

### Deployment başarısız olursa:
1. GitHub Actions loglarını kontrol edin
2. Environment variables eksikse demo değerler kullanılır
3. Build hatası varsa local'de test edin: `npm run build`

### Site açılmıyorsa:
1. GitHub Pages ayarlarını kontrol edin
2. Repository public olduğundan emin olun
3. Actions sekmesinde deployment'ın tamamlandığını kontrol edin

## 📊 Deployment Durumu

- ✅ Otomatik deployment aktif
- ✅ HTTPS zorunlu
- ✅ Security headers aktif
- ✅ Performance optimizasyonu aktif
- ✅ Mobile responsive

## 🎯 Sonraki Adımlar

Gerçek verilerle çalışmak için:

1. **Supabase Projesi Oluşturun:**
   - [Supabase.com](https://supabase.com) → New Project
   - `SUPABASE_SETUP.md` dosyasındaki SQL'leri çalıştırın

2. **EmailJS Servisi Ayarlayın:**
   - [EmailJS.com](https://emailjs.com) → New Service
   - Template oluşturun

3. **GitHub Secrets Ekleyin:**
   - Repository Settings → Secrets and variables → Actions
   - Gerçek API key'leri ekleyin

---

**🎉 Artık projeniz canlıda!** Herhangi bir sorun yaşarsanız GitHub Issues'da bildirin.
