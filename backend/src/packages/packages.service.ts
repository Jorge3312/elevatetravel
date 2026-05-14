import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Package } from './entities/package.entity';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { Destination } from '../destinations/entities/destination.entity';

@Injectable()
export class PackagesService {
  constructor(
    @InjectRepository(Package)
    private packagesRepository: Repository<Package>,
    @InjectRepository(Destination)
    private destinationsRepository: Repository<Destination>,
  ) {}

  async findAllActive(query: any) {
    const qb = this.packagesRepository.createQueryBuilder('package')
      .leftJoinAndSelect('package.destination', 'destination')
      .where('package.is_active = :isActive', { isActive: true })
      .orderBy('package.price_from', 'ASC');

    if (query.destination_id) {
      qb.andWhere('destination.id = :destId', { destId: query.destination_id });
    }
    return qb.getMany();
  }

  findAll(query: any) {
    const qb = this.packagesRepository.createQueryBuilder('package')
      .leftJoinAndSelect('package.destination', 'destination')
      .orderBy('package.created_at', 'DESC');

    if (query.search) {
      qb.andWhere('package.name ILIKE :search', { search: `%${query.search}%` });
    }
    return qb.getMany();
  }

  async findOne(id: string) {
    const pkg = await this.packagesRepository.findOne({
      where: { id },
      relations: ['destination'],
    });
    if (!pkg) throw new NotFoundException('Paquete no encontrado');
    return pkg;
  }

  async create(createPackageDto: CreatePackageDto) {
    const destination = await this.destinationsRepository.findOne({
      where: { id: createPackageDto.destination_id }
    });
    if (!destination) throw new NotFoundException('Destino no encontrado');

    const pkg = this.packagesRepository.create({
      destination,
      name: createPackageDto.name,
      subtitle: createPackageDto.subtitle,
      description: createPackageDto.description,
      price_from: createPackageDto.price_from,
      hotel: createPackageDto.hotel || '',
      photo_url: createPackageDto.photo_url,
      pdf_url: createPackageDto.pdf_url,
      days: createPackageDto.days || 0,
      nights: createPackageDto.nights || 0,
      includes: createPackageDto.includes || [],
      not_includes: createPackageDto.not_includes || [],
      is_active: createPackageDto.is_active ?? true,
    });
    return this.packagesRepository.save(pkg);
  }

  async update(id: string, updatePackageDto: UpdatePackageDto) {
    const pkg = await this.packagesRepository.findOne({
      where: { id },
      relations: ['destination'],
    });
    if (!pkg) throw new NotFoundException('Paquete no encontrado');

    if (updatePackageDto.destination_id) {
      const destination = await this.destinationsRepository.findOne({
        where: { id: updatePackageDto.destination_id }
      });
      if (!destination) throw new NotFoundException('Destino no encontrado');
      pkg.destination = destination;
    }

    Object.assign(pkg, updatePackageDto);
    return this.packagesRepository.save(pkg);
  }

  async remove(id: string) {
    const pkg = await this.packagesRepository.findOne({ where: { id } });
    if (!pkg) throw new NotFoundException('Paquete no encontrado');
    return this.packagesRepository.remove(pkg);
  }

  async toggleStatus(id: string) {
    const pkg = await this.packagesRepository.findOne({ where: { id } });
    if (!pkg) throw new NotFoundException('Paquete no encontrado');
    pkg.is_active = !pkg.is_active;
    return this.packagesRepository.save(pkg);
  }
}