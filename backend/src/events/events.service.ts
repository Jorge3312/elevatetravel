import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event as TravelEvent } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Destination } from '../destinations/entities/destination.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(TravelEvent)
    private eventsRepository: Repository<TravelEvent>,
    @InjectRepository(Destination)
    private destinationsRepository: Repository<Destination>,
  ) { }

  async findAllActive(query: any) {
    const qb = this.eventsRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.destination', 'destination')
      .where('event.is_active = :isActive', { isActive: true })
      .orderBy('event.start_date', 'ASC');

    if (query.destination_id) {
      qb.andWhere('destination.id = :destId', { destId: query.destination_id });
    }

    return qb.getMany();
  }

  findAll(query: any) {
    const qb = this.eventsRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.destination', 'destination')
      .orderBy('event.created_at', 'DESC');

    if (query.search) {
      qb.andWhere('event.title ILIKE :search', { search: `%${query.search}%` });
    }
    return qb.getMany();
  }

  async findOne(id: string) {
    const event = await this.eventsRepository.findOne({
      where: { id },
      relations: ['destination'],
    });
    if (!event) throw new NotFoundException('Evento no encontrado');
    return event;
  }

  async create(createEventDto: CreateEventDto) {
    const destination = await this.destinationsRepository.findOne({
      where: { id: createEventDto.destination_id }
    });
    if (!destination) throw new NotFoundException('Destino no encontrado');

    const event = this.eventsRepository.create({
      destination,
      destination_id: createEventDto.destination_id,
      name: createEventDto.name,
      subtitle: createEventDto.subtitle,
      description: createEventDto.description,
      venue: createEventDto.venue,
      price_from: createEventDto.base_price,
      start_date: createEventDto.event_date ? new Date(createEventDto.event_date) : null,
      end_date: createEventDto.end_date ? new Date(createEventDto.end_date) : null,
      photo_url: createEventDto.photo_url,
      pdf_url: createEventDto.pdf_url,
      is_active: createEventDto.is_active ?? true,
      includes: createEventDto.includes || [],
      not_includes: createEventDto.not_includes || [],
    } as TravelEvent);

    return this.eventsRepository.save(event);
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    const event = await this.eventsRepository.findOne({
      where: { id },
      relations: ['destination'],
    });
    if (!event) throw new NotFoundException('Evento no encontrado');

    if (updateEventDto.destination_id) {
      const destination = await this.destinationsRepository.findOne({
        where: { id: updateEventDto.destination_id },
      });
      if (!destination) throw new NotFoundException('Destino no encontrado');
      event.destination = destination;
    }

    if (updateEventDto.base_price !== undefined) {
      event.price_from = updateEventDto.base_price;
    }
    Object.assign(event, updateEventDto);
    return this.eventsRepository.save(event);
  }

  async remove(id: string) {
    const event = await this.eventsRepository.findOne({ where: { id } });
    if (!event) throw new NotFoundException('Evento no encontrado');
    return this.eventsRepository.remove(event);
  }

  async toggleStatus(id: string) {
    const event = await this.eventsRepository.findOne({ where: { id } });
    if (!event) throw new NotFoundException('Evento no encontrado');
    event.is_active = !event.is_active;
    return this.eventsRepository.save(event);
  }
}
