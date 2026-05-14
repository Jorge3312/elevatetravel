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
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller()
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  // PÚBLICOS
  @Get('api/offers')
  findAllActive() {
    return this.offersService.findAllActive();
  }

  @Get('api/offers/:id')
  findOne(@Param('id') id: string) {
    return this.offersService.findOne(id);
  }

  // ADMIN
  @UseGuards(JwtAuthGuard)
  @Get('api/admin/offers')
  findAll(@Query() query: any) {
    return this.offersService.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Post('api/admin/offers')
  create(@Body() createOfferDto: CreateOfferDto) {
    return this.offersService.create(createOfferDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('api/admin/offers/:id')
  update(@Param('id') id: string, @Body() updateOfferDto: UpdateOfferDto) {
    return this.offersService.update(id, updateOfferDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('api/admin/offers/:id')
  remove(@Param('id') id: string) {
    return this.offersService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('api/admin/offers/:id/toggle-status')
  toggleStatus(@Param('id') id: string) {
    return this.offersService.toggleStatus(id);
  }
}
