# Cloudflare Optimization Setup Guide

Bu rehber, Grader Marketplace projenizi Cloudflare ile optimize etmek için gerekli adımları içerir.

## 1. Cloudflare Hesap Kurulumu

### Adım 1: Domain Ekleme
1. [Cloudflare Dashboard](https://dash.cloudflare.com) üzerinden hesabınıza giriş yapın
2. "Add a Site" butonuna tıklayın
3. Domain adınızı girin (örn: `yourdomain.com`)
4. Plan seçin (Free plan yeterli başlangıç için)

### Adım 2: DNS Ayarları
1. Nameserver'ları Cloudflare'e yönlendirin
2. DNS kayıtlarınızı Cloudflare'e ekleyin:
   ```
   Type: A
   Name: @
   Content: [Vercel IP adresi]
   Proxy: ✅ (Orange cloud)
   
   Type: CNAME
   Name: www
   Content: yourdomain.com
   Proxy: ✅ (Orange cloud)
   ```

## 2. Performance Optimizasyonları

### Caching Ayarları
1. **Caching** > **Configuration** bölümüne gidin
2. Ayarları şu şekilde yapılandırın:
   ```
   Caching Level: Aggressive
   Browser Cache TTL: 4 hours
   Edge Cache TTL: 1 day
   ```

### Minification
1. **Speed** > **Optimization** bölümüne gidin
2. Aşağıdaki seçenekleri aktif edin:
   ```
   ✅ Auto Minify: CSS, HTML, JavaScript
   ✅ Brotli Compression
   ✅ Early Hints
   ✅ HTTP/2
   ✅ HTTP/3 (with QUIC)
   ✅ 0-RTT Connection Resumption
   ```

### Image Optimization
1. **Speed** > **Optimization** bölümünde:
   ```
   ✅ Polish: Lossless
   ✅ WebP Conversion
   ✅ AVIF Conversion
   ✅ Mirage (Mobile optimization)
   ```

## 3. Security Ayarları

### Security Level
1. **Security** > **Settings** bölümüne gidin
2. Security Level'i "High" olarak ayarlayın

### Security Headers
1. **Security** > **WAF** bölümüne gidin
2. Custom Rules oluşturun:
   ```javascript
   // Security Headers Rule
   (http.request.uri.path contains "/") and (http.host eq "yourdomain.com")
   ```

### Bot Fight Mode
1. **Security** > **Bots** bölümüne gidin
2. Bot Fight Mode'u aktif edin
3. Super Bot Fight Mode'u aktif edin (Pro plan gerekli)

## 4. Page Rules Konfigürasyonu

### API Endpoints
```
URL Pattern: yourdomain.com/api/*
Settings:
- Cache Level: Bypass Cache
- Security Level: High
- Browser Integrity Check: On
```

### Admin Panel
```
URL Pattern: yourdomain.com/admin/*
Settings:
- Cache Level: Bypass Cache
- Security Level: High
- Browser Integrity Check: On
```

### Static Assets
```
URL Pattern: yourdomain.com/static/*
Settings:
- Cache Level: Cache Everything
- Edge Cache TTL: 1 year
- Browser Cache TTL: 1 year
```

### Images
```
URL Pattern: yourdomain.com/images/*
Settings:
- Cache Level: Cache Everything
- Edge Cache TTL: 1 month
- Polish: Lossless
- WebP: On
```

## 5. Cloudflare Workers (Opsiyonel)

### Performance Worker
1. **Workers & Pages** bölümüne gidin
2. "Create a Service" butonuna tıklayın
3. `cloudflare-worker.js` dosyasını yükleyin
4. Route'ları ayarlayın:
   ```
   Pattern: yourdomain.com/*
   Service: performance-worker
   ```

## 6. Analytics ve Monitoring

### Web Analytics
1. **Analytics** > **Web Analytics** bölümüne gidin
2. Web Analytics'i aktif edin
3. Privacy-first analytics için Cloudflare Analytics'i kullanın

### Real User Monitoring (RUM)
1. **Analytics** > **Web Analytics** bölümünde
2. Real User Monitoring'i aktif edin
3. Performance metriklerini takip edin

## 7. Vercel Integration

### Environment Variables
Vercel dashboard'unda aşağıdaki environment variables'ları ekleyin:

```bash
# Cloudflare
CLOUDFLARE_API_TOKEN=your_api_token
CLOUDFLARE_ZONE_ID=your_zone_id
CLOUDFLARE_ACCOUNT_ID=your_account_id

# Performance
NEXT_PUBLIC_CLOUDFLARE_ANALYTICS=true
NEXT_PUBLIC_PERFORMANCE_MONITORING=true
```

### Vercel Configuration
`vercel.json` dosyasını güncelleyin:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
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
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        }
      ]
    },
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/images/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=2592000"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## 8. Performance Monitoring

### Core Web Vitals
1. Google PageSpeed Insights ile test edin
2. Cloudflare Analytics'te Core Web Vitals'ı takip edin
3. Real User Monitoring ile gerçek kullanıcı deneyimini ölçün

### Optimization Checklist
- [ ] DNS ayarları tamamlandı
- [ ] Caching ayarları yapılandırıldı
- [ ] Minification aktif edildi
- [ ] Image optimization aktif edildi
- [ ] Security headers eklendi
- [ ] Page Rules yapılandırıldı
- [ ] Analytics aktif edildi
- [ ] Performance monitoring kuruldu

## 9. Troubleshooting

### Common Issues
1. **Cache Issues**: Page Rules'da cache bypass ayarlarını kontrol edin
2. **Mixed Content**: HTTPS redirect'leri aktif edin
3. **CORS Issues**: Security headers'ı kontrol edin
4. **Performance Issues**: Minification ayarlarını kontrol edin

### Support
- Cloudflare Documentation: https://developers.cloudflare.com/
- Community Forum: https://community.cloudflare.com/
- Status Page: https://www.cloudflarestatus.com/

## 10. Advanced Features (Pro Plan)

### Argo Smart Routing
- Global network optimization
- Intelligent traffic routing
- Reduced latency

### Load Balancing
- Health checks
- Failover protection
- Geographic distribution

### Rate Limiting
- API protection
- DDoS mitigation
- Custom rules

Bu rehberi takip ederek Cloudflare ile projenizi optimize edebilir ve performansınızı önemli ölçüde artırabilirsiniz.
