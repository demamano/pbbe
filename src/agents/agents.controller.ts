import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LocalAgentGuard } from 'src/auth/local-agent-auth.guard';
import { AgentsService } from './agents.service';
import { EditAgentDto } from 'src/dto/agent-update.dto';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { FileValidationPipe } from 'pipes/fileValidation.pipe';

@Controller('agents')
export class AgentsController {
  constructor(
    private agentService: AgentsService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  @UseGuards(LocalAgentGuard)
  @Post('login')
  login(@Request() req) {
    return req.user;
  }

  @UseGuards(AuthenticatedGuard)
  @Get('logout')
  logout(@Request() req) {
    req.session.destroy();
    return {
      message: 'logged out successfully',
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Get('profile')
  async getAgent(@Request() req) {
    return req.user;
  }

  @UseGuards(AuthenticatedGuard)
  @Patch('edit/:id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'id', maxCount: 1 },
      { name: 'tradePermission', maxCount: 1 },
    ]),
  )
  async edit(
    @Param('id') id: string,
    @Body() editedData: EditAgentDto,
    @UploadedFiles(FileValidationPipe)
    files: {
      id?: Express.Multer.File;
      tradePermission?: Express.Multer.File;
    },
    @Request() req,
  ) {
    const data = JSON.parse(JSON.stringify(editedData));
     console.log(editedData);
    if (id === req.user.id) {
     console.log(id);
     console.log(req.user.id);
     console.log(files);
      return this.agentService.editAgent(id, data, files);
    }
  }
}
