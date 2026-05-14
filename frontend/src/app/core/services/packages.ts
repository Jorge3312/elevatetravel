import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PackagesService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api`;

  getPublicPackages() {
    return this.http.get<any[]>(`${this.apiUrl}/packages`);
  }

  getAdminPackages() {
    return this.http.get<any[]>(`${this.apiUrl}/admin/packages`);
  }

  create(data: any) {
    return this.http.post<any>(`${this.apiUrl}/admin/packages`, data);
  }

  update(id: string, data: any) {
    return this.http.put<any>(`${this.apiUrl}/admin/packages/${id}`, data);
  }

  delete(id: string) {
    return this.http.delete<any>(`${this.apiUrl}/admin/packages/${id}`);
  }

  toggleStatus(id: string) {
    return this.http.patch<any>(`${this.apiUrl}/admin/packages/${id}/toggle-status`, {});
  }
}
