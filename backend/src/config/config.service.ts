import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Configuration } from './entities/configuration.entity';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';

@Injectable()
export class ConfigService {
  constructor(
    @InjectRepository(Configuration)
    private configRepository: Repository<Configuration>,
  ) {}

  async getConfiguration() {
    let config = await this.configRepository.findOne({
      where: { id: 'singleton' },
    });
    if (!config) {
      config = this.configRepository.create({ id: 'singleton' });
      await this.configRepository.save(config);
    }
    return config;
  }

  async updateConfiguration(updateConfigurationDto: UpdateConfigurationDto) {
    const config = await this.getConfiguration();
    Object.assign(config, updateConfigurationDto);
    return this.configRepository.save(config);
  }
}
