#!/bin/bash

# 🚀 Vercel Otomatik Deployment Script
# Bu script projenizi Vercel'e otomatik olarak deploy eder

echo "🚀 Vercel Deployment Başlatılıyor..."

# Vercel CLI'nin yüklü olup olmadığını kontrol et
if ! command -v vercel &> /dev/null; then
    echo "📦 Vercel CLI yükleniyor..."
    npm install -g vercel
fi

# Git durumunu kontrol et
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Değişiklikler commit ediliyor..."
    git add .
    git commit -m "🚀 Auto-deploy to Vercel: $(date '+%Y-%m-%d %H:%M:%S')"
fi

# Main branch'e push et
echo "📤 Main branch'e push ediliyor..."
git push origin main

# Vercel'e deploy et
echo "🌐 Vercel'e deploy ediliyor..."
vercel --prod

echo "✅ Deployment tamamlandı!"
echo "🌐 Site URL'nizi Vercel Dashboard'dan kontrol edebilirsiniz"
echo "📊 https://vercel.com/dashboard"
