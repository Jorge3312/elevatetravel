import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OffersService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api`;

  getPublicOffers() {
    return this.http.get<any[]>(`${this.apiUrl}/offers`);
  }

  getAdminOffers() {
    return this.http.get<any[]>(`${this.apiUrl}/admin/offers`);
  }

  create(data: any) {
    return this.http.post<any>(`${this.apiUrl}/admin/offers`, data);
  }

  update(id: string, data: any) {
    return this.http.put<any>(`${this.apiUrl}/admin/offers/${id}`, data);
  }

  delete(id: string) {
    return this.http.delete<any>(`${this.apiUrl}/admin/offers/${id}`);
  }

  toggleStatus(id: string) {
    return this.http.patch<any>(`${this.apiUrl}/admin/offers/${id}/toggle-status`, {});
  }
}
