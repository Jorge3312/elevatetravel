import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Put,
} from '@nestjs/common';
import { VisasService } from './visas.service';
import { CreateVisaDto } from './dto/create-visa.dto';
import { UpdateVisaDto } from './dto/update-visa.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller()
export class VisasController {
  constructor(private readonly visasService: VisasService) {}

  // PÚBLICOS
  @Get('api/visas')
  findAllActive(@Query() query: any) {
    return this.visasService.findAllActive(query);
  }

  @Get('api/visas/:id')
  findOne(@Param('id') id: string) {
    return this.visasService.findOne(id);
  }

  // ADMIN
  @UseGuards(JwtAuthGuard)
  @Get('api/admin/visas')
  findAll(@Query() query: any) {
    return this.visasService.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Post('api/admin/visas')
  create(@Body() createVisaDto: CreateVisaDto) {
    return this.visasService.create(createVisaDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('api/admin/visas/:id')
  update(@Param('id') id: string, @Body() updateVisaDto: UpdateVisaDto) {
    return this.visasService.update(id, updateVisaDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('api/admin/visas/:id')
  remove(@Param('id') id: string) {
    return this.visasService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('api/admin/visas/:id/toggle-status')
  toggleStatus(@Param('id') id: string) {
    return this.visasService.toggleStatus(id);
  }
}
