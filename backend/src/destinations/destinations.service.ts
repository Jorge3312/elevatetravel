import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Destination } from './entities/destination.entity';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';

@Injectable()
export class DestinationsService {
  constructor(
    @InjectRepository(Destination)
    private destinationsRepository: Repository<Destination>,
  ) {}

  findAllActive(query: any) {
    const qb = this.destinationsRepository
      .createQueryBuilder('destination')
      .where('destination.is_active = :isActive', { isActive: true })
      .orderBy('destination.city', 'ASC');

    if (query.country) {
      qb.andWhere('destination.country ILIKE :country', {
        country: `%${query.country}%`,
      });
    }
    if (query.city) {
      qb.andWhere('destination.city ILIKE :city', { city: `%${query.city}%` });
    }
    return qb.getMany();
  }

  async findActiveCountries() {
    const results = await this.destinationsRepository
      .createQueryBuilder('destination')
      .select('destination.country', 'country')
      .where('destination.is_active = :isActive', { isActive: true })
      .distinct(true)
      .getRawMany();
    return results.map((r) => r.country);
  }

  findAll(query: any) {
    const qb = this.destinationsRepository
      .createQueryBuilder('destination')
      .orderBy('destination.created_at', 'DESC');

    if (query.search) {
      qb.andWhere(
        '(destination.country ILIKE :search OR destination.city ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }
    return qb.getMany();
  }

  async findOneWithRelations(id: string) {
    const destination = await this.destinationsRepository.findOne({
      where: { id },
      relations: ['events', 'packages'],
    });
    if (!destination) throw new NotFoundException('Destino no encontrado');

    // Filtrar para mostrar solo eventos y paquetes activos
    destination.events = destination.events.filter((e) => e.is_active);
    destination.packages = destination.packages.filter((p) => p.is_active);

    return destination;
  }

  create(createDestinationDto: CreateDestinationDto) {
    const destination =
      this.destinationsRepository.create(createDestinationDto);
    return this.destinationsRepository.save(destination);
  }

  async update(id: string, updateDestinationDto: UpdateDestinationDto) {
    const destination = await this.destinationsRepository.preload({
      id,
      ...updateDestinationDto,
    });
    if (!destination) throw new NotFoundException('Destino no encontrado');
    return this.destinationsRepository.save(destination);
  }

  async remove(id: string) {
    const destination = await this.destinationsRepository.findOne({
      where: { id },
      relations: ['events', 'packages'],
    });
    if (!destination) throw new NotFoundException('Destino no encontrado');
    if (destination.events.length > 0 || destination.packages.length > 0) {
      throw new ConflictException(
        'No se puede eliminar porque tiene eventos o paquetes vinculados',
      );
    }
    return this.destinationsRepository.remove(destination);
  }

  async toggleStatus(id: string) {
    const destination = await this.destinationsRepository.findOne({
      where: { id },
    });
    if (!destination) throw new NotFoundException('Destino no encontrado');
    destination.is_active = !destination.is_active;
    return this.destinationsRepository.save(destination);
  }
}
