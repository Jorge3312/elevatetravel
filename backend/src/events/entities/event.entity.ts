import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Destination } from '../../destinations/entities/destination.entity';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  destination_id: string;

  @ManyToOne(() => Destination, destination => destination.events, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'destination_id' })
  destination: Destination;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  subtitle: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  venue: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price_from: number;

  @Column({ type: 'timestamp', nullable: true })
  start_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  end_date: Date;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  photo_url: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  pdf_url: string;

  @Column({ type: 'text', array: true, default: '{}' })
  includes: string[];

  @Column({ type: 'text', array: true, default: '{}' })
  not_includes: string[];

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}