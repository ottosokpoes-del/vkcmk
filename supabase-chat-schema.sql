-- Supabase Chat Analytics Tabloları
-- KVKK uyumlu, anonim veri toplama için

-- Chat Analytics Tablosu (Anonim veri)
CREATE TABLE IF NOT EXISTS chat_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message_type TEXT NOT NULL CHECK (message_type IN ('question', 'answer')),
  message_length INTEGER NOT NULL,
  question_category TEXT CHECK (question_category IN ('price', 'contact', 'product', 'greeting', 'other')),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat Sessions Tablosu (Anonim oturum takibi)
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_time TIMESTAMP WITH TIME ZONE,
  message_count INTEGER DEFAULT 0,
  consent_given BOOLEAN DEFAULT FALSE,
  consent_timestamp TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat Performance Tablosu (Performans metrikleri)
CREATE TABLE IF NOT EXISTS chat_performance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  response_time_ms INTEGER NOT NULL,
  message_type TEXT NOT NULL,
  success BOOLEAN DEFAULT TRUE,
  error_message TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index'ler (Performans için)
CREATE INDEX IF NOT EXISTS idx_chat_analytics_timestamp ON chat_analytics(timestamp);
CREATE INDEX IF NOT EXISTS idx_chat_analytics_category ON chat_analytics(question_category);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_session_id ON chat_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_performance_timestamp ON chat_performance(timestamp);

-- RLS (Row Level Security) Politikaları
ALTER TABLE chat_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_performance ENABLE ROW LEVEL SECURITY;

-- Admin kullanıcıları için okuma izni
CREATE POLICY "Admin can read chat analytics" ON chat_analytics
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin can read chat sessions" ON chat_sessions
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin can read chat performance" ON chat_performance
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

-- Anonim kullanıcılar için ekleme izni
CREATE POLICY "Anyone can insert chat analytics" ON chat_analytics
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can insert chat sessions" ON chat_sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can insert chat performance" ON chat_performance
  FOR INSERT WITH CHECK (true);

-- Veri saklama politikası (30 gün)
CREATE OR REPLACE FUNCTION cleanup_old_chat_data()
RETURNS void AS $$
BEGIN
  -- 30 günden eski chat analytics verilerini sil
  DELETE FROM chat_analytics 
  WHERE created_at < NOW() - INTERVAL '30 days';
  
  -- 30 günden eski chat sessions verilerini sil
  DELETE FROM chat_sessions 
  WHERE created_at < NOW() - INTERVAL '30 days';
  
  -- 30 günden eski performance verilerini sil
  DELETE FROM chat_performance 
  WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- Otomatik temizlik için cron job (Supabase Pro'da)
-- SELECT cron.schedule('cleanup-chat-data', '0 2 * * *', 'SELECT cleanup_old_chat_data();');

-- Chat Analytics View (Admin dashboard için)
CREATE OR REPLACE VIEW chat_analytics_summary AS
SELECT 
  DATE_TRUNC('day', timestamp) as date,
  question_category,
  COUNT(*) as message_count,
  AVG(message_length) as avg_message_length,
  COUNT(CASE WHEN message_type = 'question' THEN 1 END) as question_count,
  COUNT(CASE WHEN message_type = 'answer' THEN 1 END) as answer_count
FROM chat_analytics
GROUP BY DATE_TRUNC('day', timestamp), question_category
ORDER BY date DESC;

-- Chat Performance View
CREATE OR REPLACE VIEW chat_performance_summary AS
SELECT 
  DATE_TRUNC('hour', timestamp) as hour,
  AVG(response_time_ms) as avg_response_time,
  COUNT(*) as total_requests,
  COUNT(CASE WHEN success = true THEN 1 END) as successful_requests,
  COUNT(CASE WHEN success = false THEN 1 END) as failed_requests
FROM chat_performance
GROUP BY DATE_TRUNC('hour', timestamp)
ORDER BY hour DESC;

-- Chat Stats Function (Dashboard için)
CREATE OR REPLACE FUNCTION get_chat_stats()
RETURNS TABLE (
  total_messages BIGINT,
  total_questions BIGINT,
  total_answers BIGINT,
  avg_message_length NUMERIC,
  most_common_category TEXT,
  total_sessions BIGINT,
  avg_session_duration INTERVAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_messages,
    COUNT(CASE WHEN message_type = 'question' THEN 1 END) as total_questions,
    COUNT(CASE WHEN message_type = 'answer' THEN 1 END) as total_answers,
    AVG(message_length) as avg_message_length,
    (SELECT question_category FROM chat_analytics 
     WHERE question_category IS NOT NULL 
     GROUP BY question_category 
     ORDER BY COUNT(*) DESC 
     LIMIT 1) as most_common_category,
    (SELECT COUNT(*) FROM chat_sessions) as total_sessions,
    (SELECT AVG(end_time - start_time) FROM chat_sessions 
     WHERE end_time IS NOT NULL) as avg_session_duration
  FROM chat_analytics
  WHERE timestamp >= NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;

-- Test verisi (geliştirme için)
INSERT INTO chat_analytics (message_type, message_length, question_category) VALUES
('question', 15, 'greeting'),
('answer', 45, 'greeting'),
('question', 25, 'price'),
('answer', 60, 'price'),
('question', 20, 'contact'),
('answer', 35, 'contact');

-- Başarı mesajı
SELECT 'Chat analytics tables created successfully!' as message;
