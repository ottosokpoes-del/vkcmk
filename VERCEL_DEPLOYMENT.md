# 🚀 Vercel Deployment Rehberi

Vercel ile projenizi profesyonel bir şekilde canlıya alın!

## 🎯 Vercel'in Avantajları

- ⚡ **Hızlı**: Global CDN ile süper hızlı yükleme
- 🔄 **Otomatik**: Her push'ta otomatik deploy
- 🌐 **Custom Domain**: Ücretsiz custom domain
- 📊 **Analytics**: Detaylı performans analizi
- 🔒 **HTTPS**: Otomatik SSL sertifikası
- 📱 **Mobile**: Mükemmel mobil performans

## 🚀 Hızlı Başlangıç

### 1. Vercel Hesabı Oluşturun
1. [Vercel.com](https://vercel.com) adresine gidin
2. "Sign Up" ile GitHub hesabınızla giriş yapın
3. Ücretsiz hesap oluşturun

### 2. Projeyi Import Edin
1. Vercel Dashboard'da "New Project" tıklayın
2. GitHub repository'nizi seçin
3. "Import" butonuna tıklayın

### 3. Otomatik Deploy
- Vercel otomatik olarak projenizi analiz eder
- Build ayarlarını otomatik algılar
- İlk deploy otomatik başlar

## ⚙️ Manuel Deployment

### Vercel CLI ile:
```bash
# Vercel CLI'yi global olarak yükleyin
npm i -g vercel

# Projeyi deploy edin
vercel

# Production'a deploy edin
vercel --prod
```

### NPM Script ile:
```bash
# Preview deployment
npm run deploy:preview

# Production deployment
npm run deploy
```

## 🔧 Environment Variables

### Vercel Dashboard'da:
1. Project Settings → Environment Variables
2. Aşağıdaki değişkenleri ekleyin:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=your_public_key
REACT_APP_ENCRYPTION_KEY=your-encryption-key
REACT_APP_JWT_SECRET=your-jwt-secret
```

### GitHub Secrets ile (Otomatik Deploy):
Repository Settings → Secrets and variables → Actions:

```
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-org-id
VERCEL_PROJECT_ID=your-project-id
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=your_public_key
REACT_APP_ENCRYPTION_KEY=your-encryption-key
REACT_APP_JWT_SECRET=your-jwt-secret
```

## 🌐 Custom Domain

### Ücretsiz Domain:
1. Vercel Dashboard → Project Settings → Domains
2. "Add Domain" tıklayın
3. Domain'inizi girin (örn: `mycarmarket.com`)
4. DNS ayarlarını yapın

### DNS Ayarları:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: A
Name: @
Value: 76.76.19.61
```

## 📊 Performance Optimizasyonu

### Vercel Otomatik Optimizasyonları:
- ✅ **Image Optimization**: Otomatik WebP dönüşümü
- ✅ **Code Splitting**: Otomatik chunk'lar
- ✅ **Tree Shaking**: Kullanılmayan kod temizleme
- ✅ **Minification**: Kod sıkıştırma
- ✅ **Gzip Compression**: Otomatik sıkıştırma
- ✅ **Edge Caching**: Global cache

### Ek Optimizasyonlar:
```javascript
// vercel.json'da
{
  "functions": {
    "app/api/**/*.js": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        }
      ]
    }
  ]
}
```

## 🔄 CI/CD Pipeline

### Otomatik Deploy:
- Her `main` branch'e push'ta otomatik deploy
- Pull request'lerde preview deploy
- Rollback özelliği

### GitHub Actions ile:
```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## 📱 Mobile Optimization

### PWA Desteği:
```javascript
// vite.config.ts'de
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ]
})
```

## 🔒 Security

### Otomatik Güvenlik:
- ✅ HTTPS zorunlu
- ✅ Security headers
- ✅ DDoS koruması
- ✅ Bot koruması

### Ek Güvenlik:
```javascript
// vercel.json'da
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline'"
        }
      ]
    }
  ]
}
```

## 📈 Analytics ve Monitoring

### Vercel Analytics:
- Real-time visitor tracking
- Performance metrics
- Core Web Vitals
- Error tracking

### Ek Monitoring:
```javascript
// Sentry entegrasyonu
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: process.env.NODE_ENV
});
```

## 🆘 Sorun Giderme

### Yaygın Sorunlar:

1. **Build Hatası**:
   ```bash
   # Local'de test edin
   npm run build
   
   # Vercel CLI ile debug
   vercel --debug
   ```

2. **Environment Variables**:
   - Vercel Dashboard'da doğru eklendiğinden emin olun
   - Redeploy yapın

3. **Domain Sorunu**:
   - DNS propagation 24 saat sürebilir
   - Vercel Dashboard'da domain status'unu kontrol edin

4. **Performance Sorunu**:
   - Vercel Analytics'te Core Web Vitals'ı kontrol edin
   - Image optimization'ı kontrol edin

## 🎯 Sonraki Adımlar

1. **Supabase Production Kurulumu**:
   - Production Supabase projesi oluşturun
   - Database'i kurun
   - API keys'i Vercel'e ekleyin

2. **EmailJS Production**:
   - Production EmailJS servisi kurun
   - Template'leri ayarlayın

3. **Custom Domain**:
   - Domain satın alın
   - DNS ayarlarını yapın

4. **Monitoring**:
   - Analytics'i aktif edin
   - Error tracking ekleyin

---

**🎉 Tebrikler!** Artık projeniz Vercel'de profesyonel bir şekilde çalışıyor!

**Site URL**: `https://your-project.vercel.app`
