import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { EditAgentDto } from 'src/dto/agent-update.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AgentsService {
  constructor(
    private prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}
  async findOne(username: string): Promise<User | undefined> {
    return await this.prisma.user.findUnique({
      where: {
        username,
      },
    });
  }

  async editAgent(
    id: string,
    editedData: EditAgentDto,
    files: {
      id?: Express.Multer.File;
      tradePermission?: Express.Multer.File;
    },
  ) {
    const data = JSON.parse(JSON.stringify(editedData));
    console.log(data)
    const field = JSON.parse(data.nonFileData);

    if (files.id && files.tradePermission) {
      const tradeResult = await this.cloudinary.uploadFile(
        files.tradePermission[0],
      );

      const idResult = await this.cloudinary.uploadFile(files.id[0]);

      const tradeUrl = tradeResult.secure_url;
      const idUrl = idResult.secure_url;
      field.idUrl = idUrl;
      field.tradeUrl = tradeUrl;
    } else if (files.id) {
      const idResult = await this.cloudinary.uploadFile(files.id[0]);
      const idUrl = idResult.secure_url;
      field.idUrl = idUrl;
    } else if (files.tradePermission) {
      const tradeResult = await this.cloudinary.uploadFile(
        field.tradePermission[0],
      );
      const tradeUrl = tradeResult.secure_url;
      field.tradeUrl = tradeUrl;
    } 
    return await this.prisma.user.update({
      where: { id },
      data: field,
    });
  }
}
