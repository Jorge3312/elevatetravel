import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Destination } from '../../destinations/entities/destination.entity';

@Entity('visas')
export class Visa {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  country: string;

  @Column({ type: 'uuid', nullable: true })
  destination_id: string;

  @ManyToOne(() => Destination, (destination) => destination.visas, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'destination_id' })
  destination: Destination;

  @Column({ type: 'varchar', length: 100, nullable: true })
  visa_type: string;

  @Column({ type: 'text', nullable: true })
  requirements: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  photo_url: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}