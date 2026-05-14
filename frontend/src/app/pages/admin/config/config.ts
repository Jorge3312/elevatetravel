import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfigService } from '../../../core/services/config';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule],
  templateUrl: './config.html',
})
export class Config implements OnInit {
  private configService = inject(ConfigService);

  settings: any = null;
  loading = true;
  saving = false;
  successMsg = '';

  ngOnInit() {
    this.loadSettings();
  }

  loadSettings() {
    this.loading = true;
    this.configService.getSettings().subscribe({
      next: (data) => {
        this.settings = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando configuración', err);
        this.loading = false;
      }
    });
  }

  saveSettings() {
    this.saving = true;
    this.successMsg = '';
    // ✅ Envía el objeto completo, no por clave individual
    this.configService.updateSettings({
      whatsapp_general: this.settings.whatsapp_general,
      whatsapp_visas: this.settings.whatsapp_visas,
    }).subscribe({
      next: () => {
        this.saving = false;
        this.successMsg = 'Configuración guardada correctamente';
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: (err) => {
        console.error('Error guardando', err);
        this.saving = false;
      }
    });
  }
}
