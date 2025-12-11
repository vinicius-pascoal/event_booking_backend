import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Verificar se o usuário admin já existe
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@eventbooking.com' }
  });

  if (existingAdmin) {
    console.log('✅ Usuário admin já existe. Pulando criação...');
    return;
  }

  // Criar usuário admin padrão
  const hashedPassword = await bcrypt.hash('Admin@123456', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@eventbooking.com',
      name: 'Administrador do Sistema',
      password: hashedPassword,
      isAdmin: true,
      provider: 'local'
    }
  });

  console.log('✅ Usuário admin criado com sucesso!');
  console.log('📧 Email:', admin.email);
  console.log('🔑 Senha: Admin@123456');
  console.log('⚠️  IMPORTANTE: Altere a senha após o primeiro login!');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
