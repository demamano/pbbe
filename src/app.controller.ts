/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';

import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CreateAgentDto } from './dto/create-agent.dto';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { PrismaService } from './prisma.service';
import { AuthService } from './auth/auth.service';
import * as bcrypt from 'bcrypt';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Controller()
export class AppController {
  [x: string]: any;
  constructor(
    private readonly cloudinary: CloudinaryService,
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}

  @Post('register')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'id', maxCount: 1 },
      { name: 'tradePermission', maxCount: 1 },
    ]),
  )
  async register(
    @Body() body: any,
    @UploadedFiles()
    files: {
      id?: Express.Multer.File[];
      tradePermission?: Express.Multer.File[];
    },
  ) {
    const data = JSON.parse(JSON.stringify(body));
    const field = JSON.parse(data.nonFileData);
    const createAgentDto = plainToClass(CreateAgentDto, field);
    const error = await validate(createAgentDto);
    if (error.length > 0) {
      console.log(error);
      throw new BadRequestException(error);
    }

    const idResult = await this.cloudinary.uploadFile(files.id[0]);
    let tradeUrl = '';
    if (files.tradePermission) {
      const tradeResult = await this.cloudinary.uploadFile(
        files?.tradePermission[0],
      );
      tradeUrl = tradeResult.secure_url;
    }

    field.hashedPassword = await bcrypt.hash(field.password, 10);
    delete field.password;

    const fields = { ...field, idUrl: idResult.secure_url, tradeUrl };

    return this.prisma.user.create({
      data: fields,
    });
  }
}
