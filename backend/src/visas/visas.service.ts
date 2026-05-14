import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Visa } from './entities/visa.entity';
import { CreateVisaDto } from './dto/create-visa.dto';
import { UpdateVisaDto } from './dto/update-visa.dto';

@Injectable()
export class VisasService {
  constructor(
    @InjectRepository(Visa)
    private visasRepository: Repository<Visa>,
  ) {}

  findAllActive(query: any) {
    const qb = this.visasRepository.createQueryBuilder('visa')
      .leftJoinAndSelect('visa.destination', 'destination')
      .where('visa.is_active = :isActive', { isActive: true })
      .orderBy('visa.created_at', 'DESC');

    if (query.country) {
      qb.andWhere('visa.country ILIKE :country', { country: `%${query.country}%` });
    }
    if (query.destination_id) {
      qb.andWhere('visa.destination_id = :destId', { destId: query.destination_id });
    }
    return qb.getMany();
  }

  findAll(query: any) {
    const qb = this.visasRepository.createQueryBuilder('visa')
      .leftJoinAndSelect('visa.destination', 'destination')
      .orderBy('visa.created_at', 'DESC');

    if (query.search) {
      qb.andWhere(
        '(visa.country ILIKE :search OR visa.visa_type ILIKE :search OR destination.country ILIKE :search OR destination.city ILIKE :search)',
        { search: `%${query.search}%` }
      );
    }
    return qb.getMany();
  }

  async findOne(id: string) {
    const visa = await this.visasRepository.findOne({
      where: { id },
      relations: ['destination'],
    });
    if (!visa) throw new NotFoundException('Visa no encontrada');
    return visa;
  }

  create(createVisaDto: CreateVisaDto) {
    const visa = this.visasRepository.create(createVisaDto);
    return this.visasRepository.save(visa);
  }

  async update(id: string, updateVisaDto: UpdateVisaDto) {
    const visa = await this.visasRepository.preload({ id, ...updateVisaDto });
    if (!visa) throw new NotFoundException('Visa no encontrada');
    return this.visasRepository.save(visa);
  }

  async remove(id: string) {
    const visa = await this.visasRepository.findOne({ where: { id } });
    if (!visa) throw new NotFoundException('Visa no encontrada');
    return this.visasRepository.remove(visa);
  }

  async toggleStatus(id: string) {
    const visa = await this.visasRepository.findOne({ where: { id } });
    if (!visa) throw new NotFoundException('Visa no encontrada');
    visa.is_active = !visa.is_active;
    return this.visasRepository.save(visa);
  }
}