# ZENDO - Backend Architecture Specification (V1)

## 1. Stack Technique
- **Runtime** : Node.js (v20+)
- **Framework** : Express.js (ou NestJS pour plus de rigueur)
- **Database** : PostgreSQL + PostGIS (pour les requêtes géospatiales)
- **Cache / Real-time** : Redis (pour le tracking GPS rapide) + Socket.io
- **Paiement** : Stripe Connect (Marketplace)
- **Storage** : AWS S3 (Documents artisans, Photos interventions)
- **Security** : Helmet, CORS, Rate Limiting, BCrypt

## 2. Modèle de Données (PostgreSQL Schema)

```sql
-- Users (Clients & Artisans bases)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL, -- BCrypt
  phone_number VARCHAR(20),
  role VARCHAR(10) CHECK (role IN ('CLIENT', 'ARTISAN', 'ADMIN')),
  is_verified BOOLEAN DEFAULT FALSE,
  refresh_token TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Profiles Artisans (Extension)
CREATE TABLE artisans (
  user_id UUID PRIMARY KEY REFERENCES users(id),
  status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, VERIFIED, REJECTED
  current_status VARCHAR(20) DEFAULT 'OFFLINE', -- ONLINE, BUSY, OFFLINE
  level VARCHAR(20) DEFAULT 'STANDARD', -- STANDARD, PRO_PLUS, ELITE
  specialty VARCHAR(50) NOT NULL,
  location GEOGRAPHY(POINT, 4326), -- PostGIS point
  rating DECIMAL(3, 2) DEFAULT 5.0,
  stripe_account_id VARCHAR(100), -- Pour les virements
  documents JSONB -- URLs des CNI, Kbis, Assurances
);
-- ... (Interventions table remains the same)
```

## 3. Authentication & Security Flow

### API Endpoints

- `POST /auth/register` : Création de compte (Hash password + JWT generation).
- `POST /auth/login` : Vérification credentials + retour Access Token (15min) & Refresh Token (7j).
- `POST /auth/refresh` : Renouvellement du token d'accès.
- `POST /auth/logout` : Invalidation du refresh token.
- `GET /auth/me` : Récupération du profil via token.

### Security Best Practices
1.  **JWT** : Stockage côté client en mémoire (ou SecureStorage sur mobile), RefreshToken en HttpOnly Cookie (Web) ou Keychain (Mobile).
2.  **Passwords** : Hashage obligatoire avec BCrypt (Salt rounds >= 10).
3.  **Role Guard** : Middleware Node.js vérifiant `req.user.role` pour protéger les routes `/admin` ou `/artisan`.

## 4. Modules Critiques (Code Snippets)
-- ... (Rest of the file remains unchanged)
