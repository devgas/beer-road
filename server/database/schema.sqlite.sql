-- Beer Road Save schema (SQLite variant)
-- Idempotent: safe to run on every build/seeding.
-- Converted from the Postgres schema:
--   SERIAL PRIMARY KEY            -> INTEGER PRIMARY KEY AUTOINCREMENT
--   TIMESTAMP ... DEFAULT CURRENT_TIMESTAMP -> TEXT
--   (SQLite stores ISO-8601 text timestamps)

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT,
  created_at TEXT
);

CREATE TABLE IF NOT EXISTS breweries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT NOT NULL DEFAULT 'USA',
  lat REAL,
  lng REAL,
  website TEXT,
  phone TEXT,
  description TEXT,
  type TEXT,
  image_url TEXT,
  created_at TEXT
);

CREATE TABLE IF NOT EXISTS trips (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_date TEXT,
  end_date TEXT,
  created_at TEXT,
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS trip_stops (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  trip_id INTEGER NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  brewery_id INTEGER NOT NULL REFERENCES breweries(id) ON DELETE CASCADE,
  stop_order INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  visited_at TEXT,
  created_at TEXT
);

CREATE TABLE IF NOT EXISTS favorites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  brewery_id INTEGER NOT NULL REFERENCES breweries(id) ON DELETE CASCADE,
  created_at TEXT,
  UNIQUE (user_id, brewery_id)
);

CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  brewery_id INTEGER NOT NULL REFERENCES breweries(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TEXT,
  UNIQUE (user_id, brewery_id)
);

CREATE TABLE IF NOT EXISTS beers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  brewery_id INTEGER NOT NULL REFERENCES breweries(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  style TEXT,
  abv REAL,
  ibu INTEGER,
  description TEXT,
  image_url TEXT,
  created_at TEXT
);

CREATE TABLE IF NOT EXISTS challenges (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT DEFAULT 'medium',
  points INTEGER DEFAULT 10,
  category TEXT,
  image_url TEXT,
  is_active INTEGER DEFAULT 1,
  created_at TEXT
);

CREATE TABLE IF NOT EXISTS user_challenges (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  challenge_id INTEGER NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending',
  proof_image_url TEXT,
  review TEXT,
  completed_at TEXT,
  created_at TEXT,
  UNIQUE(user_id, challenge_id)
);

CREATE INDEX IF NOT EXISTS idx_challenges_category ON challenges(category);
CREATE INDEX IF NOT EXISTS idx_user_challenges_user ON user_challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_challenges_status ON user_challenges(status);

CREATE INDEX IF NOT EXISTS idx_breweries_city ON breweries(city);
CREATE INDEX IF NOT EXISTS idx_breweries_state ON breweries(state);
CREATE INDEX IF NOT EXISTS idx_breweries_type ON breweries(type);
CREATE INDEX IF NOT EXISTS idx_trips_user ON trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trip_stops_trip ON trip_stops(trip_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_brewery ON reviews(brewery_id);
CREATE INDEX IF NOT EXISTS idx_beers_brewery_id ON beers(brewery_id);
CREATE INDEX IF NOT EXISTS idx_beers_style ON beers(style);
