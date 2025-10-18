#!/bin/bash

# 🚀 Otomatik GitHub Pages Deployment Script
# Bu script projenizi GitHub Pages'e otomatik olarak deploy eder

echo "🚀 GitHub Pages Deployment Başlatılıyor..."

# Git durumunu kontrol et
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Değişiklikler commit ediliyor..."
    git add .
    git commit -m "🚀 Auto-deploy: $(date '+%Y-%m-%d %H:%M:%S')"
fi

# Main branch'e push et
echo "📤 Main branch'e push ediliyor..."
git push origin main

echo "✅ Deployment tamamlandı!"
echo "🌐 Site URL: https://ottosokpoes-del.github.io/ss/"
echo "⏱️  Deployment genellikle 2-3 dakika sürer"
echo "📊 İlerlemeyi GitHub Actions sekmesinden takip edebilirsiniz"
