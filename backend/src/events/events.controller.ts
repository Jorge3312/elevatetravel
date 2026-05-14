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
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller()
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  // PÚBLICOS
  @Get('api/events')
  findAllActive(@Query() query: any) {
    return this.eventsService.findAllActive(query);
  }

  @Get('api/events/:id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  // ADMIN
  @UseGuards(JwtAuthGuard)
  @Get('api/admin/events')
  findAll(@Query() query: any) {
    return this.eventsService.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Post('api/admin/events')
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('api/admin/events/:id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(id, updateEventDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('api/admin/events/:id')
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('api/admin/events/:id/toggle-status')
  toggleStatus(@Param('id') id: string) {
    return this.eventsService.toggleStatus(id);
  }
}
