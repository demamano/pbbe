import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
// import { PrismaService } from './prisma.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AgentsModule } from './agents/agents.module';
import { LocalAgentStrategy } from './auth/local-agent.strategy';
import { AdminsModule } from './admins/admins.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CloudinaryModule,
    AuthModule,
    UsersModule,
    AgentsModule,
    AdminsModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, LocalAgentStrategy],
})
export class AppModule {}
