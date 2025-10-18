# 🚀 Production Deployment Rehberi

Bu rehber, projenizi GitHub Pages üzerinde canlıya almak için gerekli adımları içerir.

## 📋 Ön Gereksinimler

1. **GitHub Repository**: Projeniz GitHub'da olmalı
2. **Supabase Projesi**: Production için ayrı Supabase projesi oluşturun
3. **EmailJS Hesabı**: Production için EmailJS servisi ayarlayın
4. **Domain (Opsiyonel)**: Kendi domain'inizi kullanmak istiyorsanız

## 🔧 1. Environment Variables Ayarlama

### GitHub Secrets Ekleme

Repository'nizde **Settings > Secrets and variables > Actions** bölümüne gidin ve şu secrets'ları ekleyin:

```
VITE_SUPABASE_URL=https://your-production-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-supabase-anon-key
VITE_EMAILJS_SERVICE_ID=service_production_id
VITE_EMAILJS_TEMPLATE_ID=template_production_id
VITE_EMAILJS_PUBLIC_KEY=your_production_public_key
REACT_APP_ENCRYPTION_KEY=prod-super-secret-encryption-key-2024
REACT_APP_JWT_SECRET=prod-jwt-secret-key-2024
```

### Supabase Production Kurulumu

1. [Supabase](https://supabase.com) sitesinde yeni proje oluşturun
2. `SUPABASE_SETUP.md` dosyasındaki SQL komutlarını çalıştırın
3. Storage bucket'ı oluşturun (`car-images`)
4. RLS politikalarını ayarlayın
5. Production URL ve Anon Key'i alın

### EmailJS Production Kurulumu

1. [EmailJS](https://www.emailjs.com/) sitesinde production servisi oluşturun
2. Production email template'i ayarlayın
3. Production Public Key'i alın
4. Rate limiting ayarlarını yapın

## 🚀 2. GitHub Pages Deployment

### Otomatik Deployment (Önerilen)

1. Repository'nizde **Actions** sekmesine gidin
2. `.github/workflows/deploy.yml` dosyası otomatik olarak çalışacak
3. Her `main` branch'e push'ta otomatik deploy olur

### Manuel Deployment

```bash
# Bağımlılıkları yükle
npm install

# Production build
npm run build:prod

# GitHub Pages'e deploy
npm run deploy
```

## 🌐 3. GitHub Pages Ayarları

1. Repository **Settings > Pages** bölümüne gidin
2. **Source**: "GitHub Actions" seçin
3. **Custom domain** (opsiyonel): Kendi domain'inizi ekleyin
4. **Enforce HTTPS** seçeneğini aktif edin

## 🔒 4. Güvenlik Ayarları

### Content Security Policy (CSP)

Production'da CSP header'ları otomatik olarak eklenir:

```
default-src 'self'; 
script-src 'self' 'unsafe-inline'; 
style-src 'self' 'unsafe-inline'; 
img-src 'self' data: https:; 
font-src 'self' data:; 
connect-src 'self' https:;
```

### HTTPS Zorunluluğu

- GitHub Pages otomatik HTTPS sağlar
- Custom domain kullanıyorsanız SSL sertifikası otomatik verilir

## 📊 5. Monitoring ve Analytics

### Performance Monitoring

```javascript
// Vite config'de performance monitoring ekleyebilirsiniz
export default defineConfig({
  // ... diğer ayarlar
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          utils: ['zustand', 'crypto-js']
        }
      }
    }
  }
})
```

### Error Tracking

Production'da hata takibi için Sentry veya benzeri servis ekleyebilirsiniz.

## 🔧 6. Sorun Giderme

### Yaygın Sorunlar

1. **Build Hatası**
   ```bash
   # Node.js versiyonunu kontrol edin
   node --version  # 18.x olmalı
   
   # Bağımlılıkları temizleyin
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Environment Variables Hatası**
   - GitHub Secrets'ların doğru eklendiğinden emin olun
   - Variable isimlerinin büyük/küçük harf duyarlı olduğunu unutmayın

3. **Supabase Bağlantı Hatası**
   - Production Supabase URL'inin doğru olduğundan emin olun
   - RLS politikalarını kontrol edin
   - API key'inin geçerli olduğundan emin olun

4. **EmailJS Hatası**
   - Production EmailJS servisinin aktif olduğundan emin olun
   - Template ID'nin doğru olduğundan emin olun
   - Rate limiting ayarlarını kontrol edin

### Debug Modu

Production'da debug için:

```bash
# Local'de production build test et
npm run build:prod
npm run preview
```

## 📈 7. Performance Optimizasyonu

### Bundle Size Optimizasyonu

- Code splitting aktif
- Tree shaking aktif
- Minification aktif
- Gzip compression GitHub Pages'de otomatik

### Image Optimization

- WebP format kullanın
- Lazy loading aktif
- Responsive images kullanın

## 🔄 8. CI/CD Pipeline

GitHub Actions workflow'u şunları yapar:

1. ✅ Code checkout
2. ✅ Node.js setup
3. ✅ Dependencies install
4. ✅ TypeScript compile
5. ✅ Vite build
6. ✅ Deploy to GitHub Pages

## 📱 9. Mobile Optimization

- Responsive design aktif
- Touch gestures destekleniyor
- PWA özellikleri eklenebilir

## 🎯 10. Son Kontroller

Deploy öncesi kontrol listesi:

- [ ] Environment variables doğru ayarlandı
- [ ] Supabase production kuruldu
- [ ] EmailJS production ayarlandı
- [ ] Security headers aktif
- [ ] HTTPS zorunlu
- [ ] Performance optimizasyonları aktif
- [ ] Error handling çalışıyor
- [ ] Mobile responsive test edildi

## 🆘 Destek

Sorun yaşarsanız:

1. GitHub Issues'da sorun bildirin
2. Console loglarını kontrol edin
3. Network tab'ında API çağrılarını kontrol edin
4. Supabase Dashboard'da logları kontrol edin

---

**🎉 Tebrikler!** Artık projeniz production'da çalışıyor olmalı.

**Site URL**: `https://ottosokpoes-del.github.io/ss/`
