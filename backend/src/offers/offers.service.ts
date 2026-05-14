import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
  ) {}

  findAllActive() {
    return this.offersRepository.createQueryBuilder('offer')
      .leftJoinAndSelect('offer.package', 'package')
      .where('offer.is_active = :isActive', { isActive: true })
      .andWhere('(offer.valid_until IS NULL OR offer.valid_until >= CURRENT_DATE)')
      .orderBy('offer.created_at', 'DESC')
      .getMany();
  }

  findAll(query: any) {
    const qb = this.offersRepository.createQueryBuilder('offer')
      .leftJoinAndSelect('offer.package', 'package')
      .orderBy('offer.created_at', 'DESC');

    if (query.search) {
      qb.andWhere('offer.title ILIKE :search', { search: `%${query.search}%` });
    }
    return qb.getMany();
  }

  async findOne(id: string) {
    const offer = await this.offersRepository.findOne({ 
      where: { id },
      relations: ['package']
    });
    if (!offer) throw new NotFoundException('Oferta no encontrada');
    return offer;
  }

  create(createOfferDto: CreateOfferDto) {
    const offer = this.offersRepository.create(createOfferDto);
    return this.offersRepository.save(offer);
  }

  async update(id: string, updateOfferDto: UpdateOfferDto) {
    const offer = await this.offersRepository.preload({ id, ...updateOfferDto });
    if (!offer) throw new NotFoundException('Oferta no encontrada');
    return this.offersRepository.save(offer);
  }

  async remove(id: string) {
    const offer = await this.offersRepository.findOne({ where: { id } });
    if (!offer) throw new NotFoundException('Oferta no encontrada');
    return this.offersRepository.remove(offer);
  }

  async toggleStatus(id: string) {
    const offer = await this.offersRepository.findOne({ where: { id } });
    if (!offer) throw new NotFoundException('Oferta no encontrada');
    offer.is_active = !offer.is_active;
    return this.offersRepository.save(offer);
  }
}