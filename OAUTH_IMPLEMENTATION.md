# Implementação Futura: Google OAuth2

Este arquivo contém instruções para implementar Google OAuth2 no futuro.

## Estrutura Preparada

O projeto já está preparado para OAuth2:

1. **Modelo User** possui campos:
   - `provider`: Identifica o provedor ("local", "google", etc.)
   - `providerId`: ID único do usuário no provedor OAuth
   - `password`: Opcional (null para OAuth)

2. **Rotas placeholder** em `/api/auth/google`:
   - `GET /api/auth/google` - Iniciar autenticação
   - `GET /api/auth/google/callback` - Callback do Google

## Passos para Implementação

### 1. Instalar Dependências

```bash
npm install passport passport-google-oauth20
npm install --save-dev @types/passport @types/passport-google-oauth20
```

### 2. Configurar Google Cloud Console

1. Acesse: https://console.cloud.google.com/
2. Crie um novo projeto ou selecione existente
3. Ative a **Google+ API**
4. Vá em **Credenciais** > **Criar Credenciais** > **ID do cliente OAuth**
5. Configure:
   - Tipo de aplicação: Aplicação da Web
   - URIs de redirecionamento autorizados:
     - `http://localhost:3000/api/auth/google/callback` (dev)
     - `https://seu-dominio.com/api/auth/google/callback` (prod)
6. Copie o **Client ID** e **Client Secret**

### 3. Atualizar .env

Adicione ao arquivo `.env`:

```env
GOOGLE_CLIENT_ID="seu-client-id-aqui"
GOOGLE_CLIENT_SECRET="seu-client-secret-aqui"
GOOGLE_CALLBACK_URL="http://localhost:3000/api/auth/google/callback"
```

### 4. Criar Estratégia Passport

Crie o arquivo `src/config/passport.ts`:

```typescript
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import prisma from './database';
import { generateToken, generateRefreshToken } from '../utils/jwt';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        
        if (!email) {
          return done(new Error('No email found'), undefined);
        }

        // Buscar ou criar usuário
        let user = await prisma.user.findFirst({
          where: {
            OR: [
              { email },
              { provider: 'google', providerId: profile.id }
            ]
          }
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email,
              name: profile.displayName || email,
              provider: 'google',
              providerId: profile.id,
              password: null,
            }
          });
        } else if (user.provider !== 'google') {
          // Vincular conta Google a usuário existente
          user = await prisma.user.update({
            where: { id: user.id },
            data: {
              provider: 'google',
              providerId: profile.id,
            }
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error as Error, undefined);
      }
    }
  )
);

export default passport;
```

### 5. Atualizar AuthController

Substitua os métodos placeholder no `AuthController.ts`:

```typescript
import passport from '../config/passport';

// ...

async googleAuth(req: Request, res: Response, next: NextFunction) {
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })(req, res, next);
}

async googleCallback(req: Request, res: Response, next: NextFunction) {
  passport.authenticate('google', { session: false }, (err, user) => {
    if (err || !user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
    }

    const token = generateToken(user.id, user.email);
    const refreshToken = generateRefreshToken(user.id, user.email);

    // Redirecionar para frontend com tokens
    return res.redirect(
      `${process.env.FRONTEND_URL}/auth/callback?token=${token}&refreshToken=${refreshToken}`
    );
  })(req, res, next);
}
```

### 6. Atualizar app.ts

Adicione o Passport ao Express:

```typescript
import passport from './config/passport';

// ...
app.use(passport.initialize());
```

### 7. Adicionar ao docker-compose

Adicione as variáveis de ambiente no `docker-compose.yml`:

```yaml
environment:
  # ... outras variáveis
  GOOGLE_CLIENT_ID: ${GOOGLE_CLIENT_ID}
  GOOGLE_CLIENT_SECRET: ${GOOGLE_CLIENT_SECRET}
  GOOGLE_CALLBACK_URL: ${GOOGLE_CALLBACK_URL:-http://localhost:3000/api/auth/google/callback}
  FRONTEND_URL: ${FRONTEND_URL:-http://localhost:3000}
```

## Fluxo de Autenticação Google

1. Frontend redireciona para `/api/auth/google`
2. Usuário faz login no Google
3. Google redireciona para `/api/auth/google/callback`
4. Backend cria/atualiza usuário e gera tokens
5. Backend redireciona frontend com tokens na URL
6. Frontend salva tokens e faz login automático

## Segurança

- ✅ Tokens JWT com expiração
- ✅ Refresh tokens para renovação
- ✅ Senhas com hash bcrypt (para usuários locais)
- ✅ Validação de email com express-validator
- ✅ Suporta múltiplos provedores de autenticação
- ⚠️ Implemente rate limiting (ex: express-rate-limit)
- ⚠️ Use HTTPS em produção
- ⚠️ Configure CORS adequadamente

## Referências

- [Passport.js](http://www.passportjs.org/)
- [Google OAuth2](https://developers.google.com/identity/protocols/oauth2)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
