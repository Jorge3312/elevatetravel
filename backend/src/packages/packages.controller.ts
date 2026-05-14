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
import { PackagesService } from './packages.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller()
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  // PÚBLICOS
  @Get('api/packages')
  findAllActive(@Query() query: any) {
    return this.packagesService.findAllActive(query);
  }

  @Get('api/packages/:id')
  findOne(@Param('id') id: string) {
    return this.packagesService.findOne(id);
  }

  // ADMIN
  @UseGuards(JwtAuthGuard)
  @Get('api/admin/packages')
  findAll(@Query() query: any) {
    return this.packagesService.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Post('api/admin/packages')
  create(@Body() createPackageDto: CreatePackageDto) {
    return this.packagesService.create(createPackageDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('api/admin/packages/:id')
  update(@Param('id') id: string, @Body() updatePackageDto: UpdatePackageDto) {
    return this.packagesService.update(id, updatePackageDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('api/admin/packages/:id')
  remove(@Param('id') id: string) {
    return this.packagesService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('api/admin/packages/:id/toggle-status')
  toggleStatus(@Param('id') id: string) {
    return this.packagesService.toggleStatus(id);
  }
}
