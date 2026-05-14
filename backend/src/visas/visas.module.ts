import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VisasController } from './visas.controller';
import { VisasService } from './visas.service';
import { Visa } from './entities/visa.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Visa])],
  controllers: [VisasController],
  providers: [VisasService],
  exports: [VisasService],
})
export class VisasModule {}
