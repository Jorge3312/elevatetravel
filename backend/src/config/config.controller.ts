import { Controller, Get, Body, UseGuards, Put } from '@nestjs/common';
import { ConfigService } from './config.service';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller()
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  // PÚBLICOS
  @Get('api/config')
  getConfiguration() {
    return this.configService.getConfiguration();
  }

  // ADMIN
  @UseGuards(JwtAuthGuard)
  @Put('api/admin/config')
  updateConfiguration(@Body() updateConfigurationDto: UpdateConfigurationDto) {
    return this.configService.updateConfiguration(updateConfigurationDto);
  }
}
