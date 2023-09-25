import { Module } from '@nestjs/common';
import { AgentsController } from './agents.controller';
import { AgentsService } from './agents.service';
import { PrismaService } from 'src/prisma.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule],
  controllers: [AgentsController],
  providers: [AgentsService, PrismaService],
  exports: [AgentsService],
})
export class AgentsModule {}
