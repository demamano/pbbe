import {
  Body,
  Controller,
  Get,
  Put,
  Param,
  Query,
  Res,
  UseGuards,
  UseFilters,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FilterAgentDto } from 'src/dto/filter-agent-query.dto';
import { Response as ResponseType } from 'express';
import { PrismaService } from 'src/prisma.service';
import { UnauthorizedExceptionFilter } from 'exceptionFilters/unauthorized-exception.filter';

@Controller('admin')
export class AdminsController {
  constructor(private prisma: PrismaService) {}

  @UseGuards(JwtAuthGuard)
  @UseFilters(UnauthorizedExceptionFilter)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('resource/agents')
  async getAgents(
    @Query() query: FilterAgentDto,
    @Res({ passthrough: true }) res: ResponseType,
  ) {
    const result = await this.prisma.user.findMany({
      where: {
        phone: {
          contains: query.phone,
        },

        country: query.country || undefined,
        state: query.state || undefined,
        city: query.city || undefined,
        gender: query.gender || undefined,
        agentType: query.agentType || undefined,
      },
    });
    const total = result.length;
    res.header('x-total-count', total.toString());
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('resource/agents/:id')
  async getAgent(@Param('id') id: string) {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }

  @UseGuards(JwtAuthGuard)
  @Put('resource/agents/:id')
  async updateAgent(@Param('id') id: string, @Body() body) {
    delete body.id;
    return await this.prisma.user.update({
      where: { id },
      data: {
        ...body,
      },
    });
  }
}
