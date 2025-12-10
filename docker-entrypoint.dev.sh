#!/bin/sh
set -e

echo "🔄 Aguardando PostgreSQL..."
until npx prisma db push --accept-data-loss 2>/dev/null; do
  echo "⏳ PostgreSQL ainda não está pronto - aguardando..."
  sleep 2
done

echo "✅ PostgreSQL conectado!"
echo "🔄 Gerando Prisma Client..."
npx prisma generate

echo "🚀 Iniciando servidor..."
npm run dev
