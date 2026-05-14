import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VisasService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api`;

  getPublicVisas() {
    return this.http.get<any[]>(`${this.apiUrl}/visas`);
  }

  getAdminVisas() {
    return this.http.get<any[]>(`${this.apiUrl}/admin/visas`);
  }

  create(data: any) {
    return this.http.post<any>(`${this.apiUrl}/admin/visas`, data);
  }

  update(id: string, data: any) {
    return this.http.put<any>(`${this.apiUrl}/admin/visas/${id}`, data);
  }

  delete(id: string) {
    return this.http.delete<any>(`${this.apiUrl}/admin/visas/${id}`);
  }

  toggleStatus(id: string) {
    return this.http.patch<any>(`${this.apiUrl}/admin/visas/${id}/toggle-status`, {});
  }
}
