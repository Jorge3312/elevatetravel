import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DestinationsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api`;

  getPublicDestinations() {
    return this.http.get<any[]>(`${this.apiUrl}/destinations`);
  }

  getAdminDestinations() {
    return this.http.get<any[]>(`${this.apiUrl}/admin/destinations`);
  }

  create(data: any) {
    return this.http.post<any>(`${this.apiUrl}/admin/destinations`, data);
  }

  update(id: string, data: any) {
    return this.http.put<any>(`${this.apiUrl}/admin/destinations/${id}`, data);
  }

  delete(id: string) {
    return this.http.delete<any>(`${this.apiUrl}/admin/destinations/${id}`);
  }

  toggleStatus(id: string) {
    return this.http.patch<any>(`${this.apiUrl}/admin/destinations/${id}/toggle-status`, {});
  }
}
