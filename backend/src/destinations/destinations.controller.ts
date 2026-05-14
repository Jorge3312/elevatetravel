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
import { DestinationsService } from './destinations.service';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller()
export class DestinationsController {
  constructor(private readonly destinationsService: DestinationsService) {}

  // PÚBLICOS
  @Get('api/destinations')
  findAllActive(@Query() query: any) {
    return this.destinationsService.findAllActive(query);
  }

  @Get('api/destinations/countries')
  findActiveCountries() {
    return this.destinationsService.findActiveCountries();
  }

  @Get('api/destinations/:id')
  findOneWithRelations(@Param('id') id: string) {
    return this.destinationsService.findOneWithRelations(id);
  }

  // ADMIN
  @UseGuards(JwtAuthGuard)
  @Get('api/admin/destinations')
  findAll(@Query() query: any) {
    return this.destinationsService.findAll(query);
  }

  // ✅ Guard restaurado — estaba comentado, era un hueco de seguridad
  @UseGuards(JwtAuthGuard)
  @Post('api/admin/destinations')
  create(@Body() createDestinationDto: CreateDestinationDto) {
    return this.destinationsService.create(createDestinationDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('api/admin/destinations/:id')
  update(
    @Param('id') id: string,
    @Body() updateDestinationDto: UpdateDestinationDto,
  ) {
    return this.destinationsService.update(id, updateDestinationDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('api/admin/destinations/:id')
  remove(@Param('id') id: string) {
    return this.destinationsService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('api/admin/destinations/:id/toggle-status')
  toggleStatus(@Param('id') id: string) {
    return this.destinationsService.toggleStatus(id);
  }
}
