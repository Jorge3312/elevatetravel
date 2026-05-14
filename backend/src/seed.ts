import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AdminUsersService } from './admin-users/admin-users.service';
import { ConfigService } from './config/config.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const adminUsersService = app.get(AdminUsersService);
  const configService = app.get(ConfigService);

  console.log('Seeding initial data...');

  // Configuración
  console.log('Initializing Configuration...');
  await configService.getConfiguration(); // Esto crea el singleton si no existe
  await configService.updateConfiguration({
    whatsapp_number: '+1234567890',
    instagram_url: 'https://instagram.com/elevatetravel',
    facebook_url: 'https://facebook.com/elevatetravel',
    contact_email: 'hello@elevatetravel.com',
  });

  // Admin User
  console.log('Initializing Admin User...');
  const email = 'admin@elevatetravel.com';
  const existingUser = await adminUsersService.findOneByEmail(email);
  if (!existingUser) {
    await adminUsersService.create({
      name: 'Super Admin',
      email: email,
      password: 'adminPassword123!', // En producción cambiar la contraseña!
      is_active: true,
    });
    console.log(`Admin created: ${email} / adminPassword123!`);
  } else {
    console.log(`Admin ${email} already exists.`);
  }

  console.log('Seeding completed successfully!');
  await app.close();
}

bootstrap().catch((err) => {
  console.error('Seeding failed', err);
  process.exit(1);
});
