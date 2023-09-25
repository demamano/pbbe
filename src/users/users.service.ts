import { Injectable } from '@nestjs/common';
import { UpdateAdminDto } from 'src/dto/admin-update.dto';
import { Admin } from 'src/dto/admin.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async findOne(username: string): Promise<Admin | undefined> {
    return await this.prisma.admin.findUnique({
      where: {
        username,
      },
    });
  }

  async findAndUpdateUser(
    username: string,
    updateAdminDto: UpdateAdminDto,
  ): Promise<Admin> {
    const admin = await this.findOne(username);

    return await this.prisma.admin.update({
      where: { username: admin.username },
      data: {
        ...updateAdminDto,
      },
    });
  }
}
