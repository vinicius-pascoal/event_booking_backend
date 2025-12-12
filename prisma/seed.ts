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

  if (!existingAdmin) {
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
  } else {
    console.log('✅ Usuário admin já existe. Pulando criação...');
  }

  // Verificar se o usuário padrão já existe
  const existingUser = await prisma.user.findUnique({
    where: { email: 'user@eventbooking.com' }
  });

  if (!existingUser) {
    // Criar usuário padrão (não-admin)
    const hashedUserPassword = await bcrypt.hash('User@123456', 10);

    const user = await prisma.user.create({
      data: {
        email: 'user@eventbooking.com',
        name: 'Usuário Padrão',
        password: hashedUserPassword,
        isAdmin: false,
        provider: 'local'
      }
    });

    console.log('\n✅ Usuário padrão criado com sucesso!');
    console.log('📧 Email:', user.email);
    console.log('🔑 Senha: User@123456');
    console.log('⚠️  IMPORTANTE: Altere a senha após o primeiro login!');
  } else {
    console.log('\n✅ Usuário padrão já existe. Pulando criação...');
  }

  // Criar venues de exemplo
  const venueCount = await prisma.venue.count();

  if (venueCount === 0) {
    console.log('\n🏢 Criando venues de exemplo...');

    const venues = await prisma.venue.createMany({
      data: [
        {
          name: 'Auditório Principal',
          description: 'Auditório moderno com capacidade para 200 pessoas, equipado com sistema de som, projetor e ar condicionado.',
          location: 'São Paulo - SP, Av. Paulista, 1000',
          capacity: 200,
          isHighlight: true,
          images: ['auditorium-1.jpg', 'auditorium-2.jpg', 'auditorium-3.jpg'],
          mainImage: 'auditorium-main.jpg'
        },
        {
          name: 'Sala de Conferências Premium',
          description: 'Sala executiva para reuniões e apresentações corporativas, com mesa de reunião para 30 pessoas.',
          location: 'São Paulo - SP, Av. Faria Lima, 2500',
          capacity: 30,
          isHighlight: true,
          images: ['conference-1.jpg', 'conference-2.jpg'],
          mainImage: 'conference-main.jpg'
        },
        {
          name: 'Espaço Multiuso Cultural',
          description: 'Espaço versátil para eventos culturais, workshops e apresentações artísticas.',
          location: 'Rio de Janeiro - RJ, Centro, Rua da Cultura, 150',
          capacity: 150,
          isHighlight: false,
          images: ['cultural-1.jpg', 'cultural-2.jpg', 'cultural-3.jpg'],
          mainImage: 'cultural-main.jpg'
        },
        {
          name: 'Salão de Eventos Golden',
          description: 'Salão elegante para eventos sociais e corporativos, com decoração sofisticada e serviço de buffet.',
          location: 'Belo Horizonte - MG, Savassi, Rua dos Eventos, 789',
          capacity: 120,
          isHighlight: true,
          images: ['golden-1.jpg', 'golden-2.jpg'],
          mainImage: 'golden-main.jpg'
        },
        {
          name: 'Teatro Municipal',
          description: 'Teatro histórico com infraestrutura completa para apresentações teatrais e musicais.',
          location: 'Porto Alegre - RS, Centro Histórico, Praça Principal',
          capacity: 300,
          isHighlight: false,
          images: ['theater-1.jpg', 'theater-2.jpg', 'theater-3.jpg', 'theater-4.jpg'],
          mainImage: 'theater-main.jpg'
        },
        {
          name: 'Sala Executiva Tech Hub',
          description: 'Sala moderna para startups e empresas de tecnologia, com internet de alta velocidade e equipamentos de ponta.',
          location: 'Florianópolis - SC, Centro Tecnológico, Rua da Inovação, 42',
          capacity: 50,
          isHighlight: true,
          images: ['techhub-1.jpg', 'techhub-2.jpg'],
          mainImage: 'techhub-main.jpg'
        }
      ]
    });

    console.log(`✅ ${venues.count} venues criados com sucesso!`);
  } else {
    console.log('✅ Venues já existem no banco. Pulando criação...');
  }
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
