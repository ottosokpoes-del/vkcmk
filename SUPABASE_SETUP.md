# Supabase Kurulum Rehberi

Bu proje Supabase ile entegre edilmiştir. Aşağıdaki adımları takip ederek Supabase'i kurun ve yapılandırın.

## 1. Supabase Projesi Oluşturma

1. [Supabase](https://supabase.com) sitesine gidin
2. "Start your project" butonuna tıklayın
3. GitHub hesabınızla giriş yapın
4. "New Project" butonuna tıklayın
5. Proje detaylarını doldurun:
   - **Name**: premium-car-marketplace
   - **Database Password**: Güçlü bir şifre oluşturun
   - **Region**: Size en yakın bölgeyi seçin

## 2. Veritabanı Tablolarını Oluşturma

Supabase Dashboard'da SQL Editor'a gidin ve aşağıdaki SQL komutlarını çalıştırın:

```sql
-- Users tablosu (Supabase Auth ile otomatik oluşturulur, sadece profil bilgileri için)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  avatar_url TEXT,
  is_admin BOOLEAN DEFAULT FALSE
);

-- Cars tablosu
CREATE TABLE public.cars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  price DECIMAL(12,2) NOT NULL,
  mileage INTEGER NOT NULL,
  fuel_type TEXT NOT NULL,
  transmission TEXT NOT NULL,
  color TEXT NOT NULL,
  description TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  features TEXT[] DEFAULT '{}',
  location TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT FALSE,
  is_sold BOOLEAN DEFAULT FALSE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL
);

-- Favorites tablosu
CREATE TABLE public.favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  car_id UUID REFERENCES public.cars(id) ON DELETE CASCADE NOT NULL,
  UNIQUE(user_id, car_id)
);

-- RLS (Row Level Security) politikalarını etkinleştir
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Users tablosu için politikalar
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Cars tablosu için politikalar
CREATE POLICY "Anyone can view cars" ON public.cars
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create cars" ON public.cars
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own cars" ON public.cars
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cars" ON public.cars
  FOR DELETE USING (auth.uid() = user_id);

-- Admin politikaları
CREATE POLICY "Admins can do everything with cars" ON public.cars
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Favorites tablosu için politikalar
CREATE POLICY "Users can view their own favorites" ON public.favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own favorites" ON public.favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" ON public.favorites
  FOR DELETE USING (auth.uid() = user_id);

-- Trigger fonksiyonları
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, phone)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger'ı oluştur
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger fonksiyonu
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Updated_at trigger'larını oluştur
CREATE TRIGGER handle_updated_at_users
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_cars
  BEFORE UPDATE ON public.cars
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
```

## 3. Storage Bucket Oluşturma

1. Supabase Dashboard'da "Storage" sekmesine gidin
2. "Create a new bucket" butonuna tıklayın
3. Bucket adı: `car-images`
4. Public bucket olarak işaretleyin
5. "Create bucket" butonuna tıklayın

Storage politikalarını ayarlayın:

```sql
-- Storage politikaları
CREATE POLICY "Anyone can view car images" ON storage.objects
  FOR SELECT USING (bucket_id = 'car-images');

CREATE POLICY "Authenticated users can upload car images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'car-images' AND 
    auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update their own car images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'car-images' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own car images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'car-images' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

## 4. Environment Variables Ayarlama

1. Proje kök dizininde `.env.local` dosyası oluşturun
2. `env.example` dosyasını kopyalayın ve aşağıdaki değerleri doldurun:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Supabase URL ve Anon Key'i şuradan bulabilirsiniz:
- Supabase Dashboard → Settings → API
- Project URL: `https://your-project-id.supabase.co`
- Anon/Public Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 5. Admin Kullanıcısı Oluşturma

1. Supabase Dashboard'da "Authentication" sekmesine gidin
2. "Add user" butonuna tıklayın
3. Email ve şifre girin
4. "Add user" butonuna tıklayın
5. SQL Editor'da aşağıdaki komutu çalıştırarak kullanıcıyı admin yapın:

```sql
UPDATE public.users 
SET is_admin = true 
WHERE email = 'admin@example.com';
```

## 6. Test Verisi Ekleme (Opsiyonel)

```sql
-- Test kullanıcısı oluştur
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'test@example.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW()
);

-- Test araçları ekle
INSERT INTO public.cars (
  brand, model, year, price, mileage, fuel_type, transmission, 
  color, description, images, features, location, contact_phone, 
  contact_email, is_featured, user_id
) VALUES 
(
  'BMW', '3 Serisi', 2020, 1250000, 45000, 'Dizel', 'Otomatik',
  'Siyah', 'Tek elden, bakımlı BMW 3 Serisi', 
  ARRAY['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800'],
  ARRAY['Klima', 'Elektrikli Camlar', 'Merkezi Kilit', 'ABS', 'ESP'],
  'İstanbul', '+90 555 123 4567', 'test@example.com', true,
  (SELECT id FROM auth.users WHERE email = 'test@example.com' LIMIT 1)
),
(
  'Mercedes', 'C200', 2019, 980000, 62000, 'Benzin', 'Otomatik',
  'Beyaz', 'Mercedes-Benz C200, full paket', 
  ARRAY['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800'],
  ARRAY['Klima', 'Elektrikli Camlar', 'Merkezi Kilit', 'ABS', 'ESP', 'Navigasyon'],
  'Ankara', '+90 555 987 6543', 'test@example.com', true,
  (SELECT id FROM auth.users WHERE email = 'test@example.com' LIMIT 1)
);
```

## 7. Projeyi Çalıştırma

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev
```

## 8. Önemli Notlar

- **Güvenlik**: Production'da güçlü şifreler kullanın
- **RLS**: Row Level Security politikaları aktif, veriler güvenli
- **Storage**: Resim yükleme için storage bucket'ı yapılandırıldı
- **Auth**: Supabase Auth sistemi kullanılıyor
- **Real-time**: Supabase real-time özellikleri kullanılabilir

## 9. Sorun Giderme

### Yaygın Hatalar:

1. **"Missing Supabase environment variables"**
   - `.env.local` dosyasının doğru yerde olduğundan emin olun
   - Environment variable'ların doğru yazıldığından emin olun

2. **"Invalid API key"**
   - Supabase Dashboard'dan doğru API key'i kopyaladığınızdan emin olun
   - Project URL'in doğru olduğundan emin olun

3. **"Permission denied"**
   - RLS politikalarını kontrol edin
   - Kullanıcının doğru izinlere sahip olduğundan emin olun

4. **"Table doesn't exist"**
   - SQL komutlarını tekrar çalıştırın
   - Tabloların doğru oluşturulduğundan emin olun

Bu rehberi takip ederek Supabase'i başarıyla kurmuş olacaksınız!


