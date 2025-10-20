-- Simple Database Schema for QQE App
USE grader_marketplace;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    phone VARCHAR(20),
    role ENUM('user', 'admin') DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Graders table
CREATE TABLE IF NOT EXISTS graders (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    brand VARCHAR(50),
    model VARCHAR(50),
    price DECIMAL(12,2) NOT NULL,
    year INT,
    operating_hours INT,
    fuel VARCHAR(50),
    transmission VARCHAR(50),
    location VARCHAR(100),
    images JSON,
    description TEXT,
    is_new BOOLEAN DEFAULT TRUE,
    is_sold BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    stock_country ENUM('EU', 'Kenya', 'US') DEFAULT 'EU',
    user_id VARCHAR(36),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Parts table
CREATE TABLE IF NOT EXISTS parts (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    brand VARCHAR(50) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    part_number VARCHAR(100) NOT NULL,
    compatible_models JSON,
    images JSON,
    description TEXT,
    is_new BOOLEAN DEFAULT TRUE,
    is_sold BOOLEAN DEFAULT FALSE,
    stock_quantity INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    stock_country ENUM('EU', 'Kenya', 'US') DEFAULT 'EU',
    user_id VARCHAR(36),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Favorites table
CREATE TABLE IF NOT EXISTS favorites (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    grader_id VARCHAR(36),
    part_id VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (grader_id) REFERENCES graders(id) ON DELETE CASCADE,
    FOREIGN KEY (part_id) REFERENCES parts(id) ON DELETE CASCADE,
    CHECK ((grader_id IS NOT NULL AND part_id IS NULL) OR (grader_id IS NULL AND part_id IS NOT NULL))
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(200),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample data
INSERT INTO users (id, username, email, password_hash, full_name, role) VALUES
('admin-001', 'admin', 'admin@qqe.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin User', 'admin'),
('user-001', 'testuser', 'user@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Test User', 'user');

INSERT INTO graders (id, title, brand, model, price, year, operating_hours, fuel, images, description, user_id) VALUES
('grader-001', 'Caterpillar 160M Motor Grader', 'Cat', '160M', 450000.00, 2020, 2500, 'Diesel', '["/rsm/Grader_2.jpg"]', 'Excellent condition Caterpillar 160M motor grader.', 'admin-001'),
('grader-002', 'Komatsu GD655-7 Motor Grader', 'Komatsu', 'GD655-7', 380000.00, 2019, 3200, 'Diesel', '["/rsm/Grader_2.jpg"]', 'Komatsu GD655-7 motor grader in good working condition.', 'user-001');

INSERT INTO parts (id, title, brand, category, price, part_number, images, description, stock_quantity, user_id) VALUES
('part-001', 'Caterpillar Blade Edge', 'Cat', 'Blade Parts', 15000.00, '1R-0742', '["/rsm/grader-icon.png"]', 'Original Caterpillar blade edge for motor graders.', 25, 'admin-001'),
('part-002', 'Komatsu Hydraulic Pump', 'Komatsu', 'Hydraulic Parts', 8500.00, 'GD655-7-HP', '["/rsm/grader-icon.png"]', 'Komatsu hydraulic pump for motor graders.', 15, 'user-001');
