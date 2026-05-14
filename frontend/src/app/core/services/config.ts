import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private http = inject(HttpClient);

  // ✅ Endpoint público para GET (sin JWT)
  private publicUrl = `${environment.apiUrl}/api/config`;
  // ✅ Endpoint admin para PUT (con JWT via interceptor)
  private adminUrl = `${environment.apiUrl}/api/admin/config`;

  // Retorna el objeto singleton de configuración { id, whatsapp_general, whatsapp_visas }
  getSettings() {
    return this.http.get<any>(this.publicUrl);
  }

  // ✅ BE espera PUT /api/admin/config con el body completo, sin parámetro de clave en la URL
  updateSettings(data: { whatsapp_general: string; whatsapp_visas: string }) {
    return this.http.put<any>(this.adminUrl, data);
  }
}
