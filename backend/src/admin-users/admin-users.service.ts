import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AdminUser } from './entities/admin-user.entity';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto';

@Injectable()
export class AdminUsersService {
  constructor(
    @InjectRepository(AdminUser)
    private adminUsersRepository: Repository<AdminUser>,
  ) {}

  findAll() {
    return this.adminUsersRepository.find({
      select: ['id', 'name', 'email', 'is_active', 'created_at'],
    });
  }

  async findOneByEmail(email: string): Promise<AdminUser | undefined> {
    const user = await this.adminUsersRepository.findOne({ where: { email } });
    return user || undefined;
  }

  async create(createAdminUserDto: CreateAdminUserDto) {
    const existing = await this.findOneByEmail(createAdminUserDto.email);
    if (existing) {
      throw new ConflictException('El correo ya está registrado');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createAdminUserDto.password, salt);

    const adminUser = this.adminUsersRepository.create({
      name: createAdminUserDto.name,
      email: createAdminUserDto.email,
      password_hash: hashedPassword,
    });

    const savedUser = await this.adminUsersRepository.save(adminUser);
    const { password_hash, ...result } = savedUser;
    return result as AdminUser;
  }

  async update(id: string, updateAdminUserDto: UpdateAdminUserDto) {
    const user = await this.adminUsersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    if (updateAdminUserDto.email && updateAdminUserDto.email !== user.email) {
      const existing = await this.findOneByEmail(updateAdminUserDto.email);
      if (existing) throw new ConflictException('El correo ya está registrado');
    }

    if (updateAdminUserDto.password) {
      const salt = await bcrypt.genSalt();
      user.password_hash = await bcrypt.hash(updateAdminUserDto.password, salt);
    }

    if (updateAdminUserDto.name) user.name = updateAdminUserDto.name;
    if (updateAdminUserDto.email) user.email = updateAdminUserDto.email;
    if (updateAdminUserDto.is_active !== undefined)
      user.is_active = updateAdminUserDto.is_active;
    const updatedUser = await this.adminUsersRepository.save(user);
    const { password_hash, ...result } = updatedUser;
    return result;
  }

  async toggleStatus(id: string) {
    const user = await this.adminUsersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    user.is_active = !user.is_active;
    const updatedUser = await this.adminUsersRepository.save(user);
    const { password_hash, ...result } = updatedUser;
    return result;
  }
}
