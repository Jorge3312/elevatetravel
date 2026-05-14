import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api`;

  getPublicEvents() {
    return this.http.get<any[]>(`${this.apiUrl}/events`);
  }

  getAdminEvents() {
    return this.http.get<any[]>(`${this.apiUrl}/admin/events`);
  }

  create(data: any) {
    return this.http.post<any>(`${this.apiUrl}/admin/events`, data);
  }

  update(id: string, data: any) {
    return this.http.put<any>(`${this.apiUrl}/admin/events/${id}`, data);
  }

  delete(id: string) {
    return this.http.delete<any>(`${this.apiUrl}/admin/events/${id}`);
  }

  toggleStatus(id: string) {
    return this.http.patch<any>(`${this.apiUrl}/admin/events/${id}/toggle-status`, {});
  }
}
