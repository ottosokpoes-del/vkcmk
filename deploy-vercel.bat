@echo off
REM 🚀 Vercel Otomatik Deployment Script (Windows)
REM Bu script projenizi Vercel'e otomatik olarak deploy eder

echo 🚀 Vercel Deployment Başlatılıyor...

REM Vercel CLI'nin yüklü olup olmadığını kontrol et
vercel --version >nul 2>&1
if errorlevel 1 (
    echo 📦 Vercel CLI yükleniyor...
    npm install -g vercel
)

REM Git durumunu kontrol et
git status --porcelain > temp_status.txt
set /p status=<temp_status.txt
del temp_status.txt

if not "%status%"=="" (
    echo 📝 Değişiklikler commit ediliyor...
    git add .
    for /f "tokens=1-3 delims=/ " %%a in ('date /t') do set mydate=%%c-%%a-%%b
    for /f "tokens=1-2 delims=: " %%a in ('time /t') do set mytime=%%a:%%b
    git commit -m "🚀 Auto-deploy to Vercel: %mydate% %mytime%"
)

REM Main branch'e push et
echo 📤 Main branch'e push ediliyor...
git push origin main

REM Vercel'e deploy et
echo 🌐 Vercel'e deploy ediliyor...
vercel --prod

echo ✅ Deployment tamamlandı!
echo 🌐 Site URL'nizi Vercel Dashboard'dan kontrol edebilirsiniz
echo 📊 https://vercel.com/dashboard

pause
