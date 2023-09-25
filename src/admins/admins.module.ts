import { Module } from '@nestjs/common';
import { AdminsController } from './admins.controller';
import { AdminsService } from './admins.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [AdminsController],
  providers: [AdminsService, PrismaService],
})
export class AdminsModule {}
