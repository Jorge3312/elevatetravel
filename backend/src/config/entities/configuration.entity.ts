import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

// ✅ Cambiado de @PrimaryGeneratedColumn('uuid') a @PrimaryColumn
//    para poder usar el id fijo 'singleton' en el servicio.
//    Con @PrimaryGeneratedColumn TypeORM ignora el id que pasas manualmente.
@Entity('configuration')
export class Configuration {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id: string;

  // ✅ nullable: true porque al crear el singleton por primera vez
  //    aún no tenemos valores; antes lanzaba error de DB NOT NULL.
  @Column({ type: 'varchar', length: 25, nullable: true })
  whatsapp_general: string;

  @Column({ type: 'varchar', length: 25, nullable: true })
  whatsapp_visas: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
