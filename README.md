# Demo CI/CD Project

Een volledig werkend demonstratieproject dat alle aspecten van CI/CD (Continuous Integration/Continuous Deployment) toont, inclusief automatisch testen, code linting, build processen, en deployment automation.

## 📋 Projectoverzicht

Dit project demonstreert de volgende CI/CD componenten:

### 🔄 Build Pipeline
- **Automatisch testen** met Jest
- **Statische code analyse** met ESLint
- **Code coverage** rapportage
- **Security scanning** met npm audit
- **Dependency vulnerability checks**

### 🚀 Deployment Pipeline
- **Omgevingsvariabelen** beheer
- **Database migraties** automation
- **Health checks** en monitoring
- **Docker containerization**
- **Multi-environment support** (development, staging, production)

## 🏗️ Architectuur

```
demo-cicd-project/
├── src/                    # Applicatie source code
│   ├── app.js             # Hoofd Express applicatie
│   ├── routes/            # API route handlers
│   └── utils/             # Utility functies (logging, etc.)
├── tests/                 # Test bestanden
├── scripts/               # Deployment en migratie scripts
├── .github/workflows/     # GitHub Actions CI/CD pipeline
├── docker-compose.yml     # Container orchestration
├── Dockerfile            # Container definitie
└── package.json          # Dependencies en scripts
```

## 🚀 Quick Start

### Vereisten
- Node.js 16+ 
- npm of yarn
- Docker (optioneel)
- Git

### Installatie

1. **Clone het project**
   ```bash
   git clone <repository-url>
   cd demo-cicd-project
   ```

2. **Installeer dependencies**
   ```bash
   npm install
   ```

3. **Configureer omgeving**
   ```bash
   cp .env.example .env
   # Bewerk .env met je eigen waarden
   ```

4. **Start de applicatie**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 🧪 Testing

### Unit Tests Uitvoeren
```bash
# Alle tests
npm test

# Tests met watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Linting
```bash
# Check code quality
npm run lint

# Auto-fix problemen
npm run lint:fix
```

## 🏗️ Build Proces

Het build proces voert automatisch de volgende stappen uit:

1. **Code linting** - ESLint controleert code kwaliteit
2. **Unit testing** - Jest voert alle tests uit
3. **Coverage check** - Controleert test coverage drempels
4. **Asset building** - Kopieert bestanden naar dist/
5. **Release packaging** - Maakt deployment artifacts

```bash
npm run build
```

## 🚀 Deployment

### Lokale Deployment
```bash
# Database migraties
npm run migrate

# Start deployment proces
node scripts/deploy.js
```

### Docker Deployment
```bash
# Build image
docker build -t demo-cicd-project .

# Run container
docker run -p 3000:3000 demo-cicd-project

# Of gebruik docker-compose
docker-compose up
```

### Production Deployment
```bash
# Set productie omgeving
export NODE_ENV=production
export DATABASE_URL=postgresql://...
export API_SECRET=your-secret-key

# Run deployment
npm run migrate
npm start
```

## 🔧 CI/CD Pipeline

### GitHub Actions Workflow

De `.github/workflows/ci-cd.yml` definieert een complete pipeline:

1. **Lint Job** - Code quality checks
2. **Test Job** - Automated testing op meerdere Node.js versies
3. **Build Job** - Application build en artifact creation
4. **Security Job** - Vulnerability scanning
5. **Docker Job** - Container image building
6. **Deploy Staging** - Automatic deployment naar staging
7. **Deploy Production** - Manual deployment naar productie

### Pipeline Triggers
- **Push naar main** - Full pipeline inclusief productie deployment
- **Push naar develop** - Full pipeline inclusief staging deployment  
- **Pull Requests** - Lint, test, en build checks

## 🌍 Omgevingen

### Development
- Lokale database
- Debug logging
- Hot reload
- Development dependencies

### Staging  
- Replica van productie
- Automated deployment
- Integration testing
- Performance monitoring

### Production
- Productie database
- Error-only logging
- Health monitoring
- Automated backups

## 📊 Monitoring

### Health Checks
```bash
# Basic health
curl http://localhost:3000/api/health

# Detailed health
curl http://localhost:3000/api/health/detailed
```

### Logging
- **Development**: Console logging met kleuren
- **Production**: File-based logging met rotatie
- **Structured logs**: JSON format voor parsing

### Metrics (optioneel)
- Prometheus metrics endpoint
- Grafana dashboards
- Application performance monitoring

## 🔒 Beveiliging

### Environment Variables
Alle gevoelige configuratie via omgevingsvariabelen:
- Database credentials
- API keys
- JWT secrets
- External service URLs

### Security Headers
- Helmet.js voor beveiligingsheaders
- CORS configuratie
- Rate limiting
- Input validatie

### Dependency Security
- Automated vulnerability scanning
- Regular dependency updates
- Security audit in CI pipeline

## 📝 API Documentatie

### Endpoints

#### Health Check
- `GET /api/health` - Basic health status
- `GET /api/health/detailed` - Detailed system health

#### Users API
- `GET /api/users` - Lijst alle gebruikers
- `GET /api/users/:id` - Haal specifieke gebruiker op
- `POST /api/users` - Maak nieuwe gebruiker
- `PUT /api/users/:id` - Update gebruiker
- `DELETE /api/users/:id` - Verwijder gebruiker

#### Calculator API (NEW!)
- `POST /api/calculator/add` - Optellen van twee getallen
- `POST /api/calculator/subtract` - Aftrekken van twee getallen
- `POST /api/calculator/multiply` - Vermenigvuldigen van twee getallen
- `POST /api/calculator/divide` - Delen van twee getallen

### Response Formats
```json
{
  "status": "success|error",
  "data": { ... },
  "message": "Human readable message",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

## 🛠️ Development

### Code Style
- ESLint configuratie gebaseerd op Airbnb style guide
- Prettier voor code formatting
- Pre-commit hooks voor code quality

### Testing Strategy
- Unit tests voor alle business logic
- Integration tests voor API endpoints
- End-to-end tests voor kritieke workflows
- Minimum 80% code coverage vereist

### Database Migraties
```bash
# Maak nieuwe migratie
echo "CREATE TABLE..." > migrations/003_new_feature.sql

# Voer migraties uit
npm run migrate

# Check migratie status
cat .migrations
```

## 🐛 Troubleshooting

### Veelvoorkomende Problemen

**Tests falen**
```bash
# Check test logs
npm test -- --verbose

# Run specifieke test
npm test -- --testNamePattern="specific test"
```

**Build problemen**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Check build logs
npm run build -- --verbose
```

**Deployment issues**
```bash
# Check environment variables
node -e "console.log(process.env)"

# Validate configuration
node scripts/validate-config.js

# Check health endpoint
curl -v http://localhost:3000/api/health
```

## 📚 Verdere Documentatie

- [API Specificatie](docs/api.md)
- [Deployment Guide](docs/deployment.md)
- [Security Guide](docs/security.md)
- [Troubleshooting Guide](docs/troubleshooting.md)

## 🤝 Bijdragen

1. Fork het project
2. Maak een feature branch (`git checkout -b feature/amazing-feature`)
3. Commit je wijzigingen (`git commit -m 'Add amazing feature'`)
4. Push naar de branch (`git push origin feature/amazing-feature`)
5. Open een Pull Request

## 📄 Licentie

Dit project is gelicenseerd onder de MIT License - zie het [LICENSE](LICENSE) bestand voor details.

## 👥 Credits

Gemaakt door [Student] als demonstratie van CI/CD best practices.

---

**Opmerking**: Dit is een demonstratieproject voor educatieve doeleinden. Voor productiegebruik moeten aanvullende beveiligings- en performance optimalisaties worden toegepast.
