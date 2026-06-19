-- Run this once to set up the MoodPlay database
-- MySQL 8.0+

CREATE DATABASE IF NOT EXISTS moodplay
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE moodplay;

-- Games added by admin
CREATE TABLE IF NOT EXISTS games (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(200) NOT NULL,
  src         VARCHAR(500) NOT NULL UNIQUE,
  mood        VARCHAR(50)  NOT NULL,
  tags        VARCHAR(300),
  active      TINYINT(1)   NOT NULL DEFAULT 1,
  added_by    VARCHAR(100),
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_mood (mood),
  INDEX idx_active (active)
) ENGINE=InnoDB;

-- Emotion scan sessions from users
CREATE TABLE IF NOT EXISTS emotion_sessions (
  id               BIGINT AUTO_INCREMENT PRIMARY KEY,
  session_key      VARCHAR(100),
  emotion          VARCHAR(50) NOT NULL,
  expressions_json TEXT,
  created_at       DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_emotion (emotion),
  INDEX idx_created (created_at)
) ENGINE=InnoDB;

-- Game feedback from users
CREATE TABLE IF NOT EXISTS game_feedback (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  session_key VARCHAR(100),
  emotion     VARCHAR(50),
  rating      VARCHAR(20),
  tags        VARCHAR(500),
  note        TEXT,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_rating (rating),
  INDEX idx_emotion (emotion)
) ENGINE=InnoDB;

-- Seed a sample game per mood so the UI has data immediately
INSERT IGNORE INTO games (name, src, mood, tags, added_by) VALUES
  ('Ragdoll Archers',    'https://games.crazygames.com/en_US/ragdoll-archers/index.html',           'happy',     'action,physics',   'admin'),
  ('Chess',              'https://games.crazygames.com/en_US/chess-free/index.html',                'neutral',   'board,strategy',   'admin'),
  ('Wood Block Journey', 'https://games.crazygames.com/en_US/wood-block-journey/index.html',        'sad',       'puzzle,relaxing',  'admin'),
  ('Gun Master 3D',      'https://games.crazygames.com/en_US/gun-master-3d---fps-shooting-game/index.html', 'angry', 'fps,shooting', 'admin'),
  ('Miniblox',           'https://games.crazygames.com/en_US/miniblox/index.html',                  'surprised', 'building,multiplayer', 'admin');
