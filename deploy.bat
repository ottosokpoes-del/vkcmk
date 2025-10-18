@echo off
REM 🚀 Otomatik GitHub Pages Deployment Script (Windows)
REM Bu script projenizi GitHub Pages'e otomatik olarak deploy eder

echo 🚀 GitHub Pages Deployment Başlatılıyor...

REM Git durumunu kontrol et
git status --porcelain > temp_status.txt
set /p status=<temp_status.txt
del temp_status.txt

if not "%status%"=="" (
    echo 📝 Değişiklikler commit ediliyor...
    git add .
    for /f "tokens=1-3 delims=/ " %%a in ('date /t') do set mydate=%%c-%%a-%%b
    for /f "tokens=1-2 delims=: " %%a in ('time /t') do set mytime=%%a:%%b
    git commit -m "🚀 Auto-deploy: %mydate% %mytime%"
)

REM Main branch'e push et
echo 📤 Main branch'e push ediliyor...
git push origin main

echo ✅ Deployment tamamlandı!
echo 🌐 Site URL: https://ottosokpoes-del.github.io/ss/
echo ⏱️  Deployment genellikle 2-3 dakika sürer
echo 📊 İlerlemeyi GitHub Actions sekmesinden takip edebilirsiniz

pause
