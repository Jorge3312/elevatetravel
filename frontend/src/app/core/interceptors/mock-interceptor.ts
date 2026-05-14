import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, catchError } from 'rxjs/operators';

// Datos de prueba premium
const mockDestinations = [
  { id: '1', country: 'Japón', city: 'Kioto', photo_url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070', is_active: true },
  { id: '2', country: 'Maldivas', city: 'Atolón de Malé', photo_url: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1965', is_active: true },
  { id: '3', country: 'Francia', city: 'París', photo_url: 'https://images.unsplash.com/photo-1502602898657-3e907a5ea586?q=80&w=2072', is_active: true },
  { id: '4', country: 'Emiratos Árabes', city: 'Dubái', photo_url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070', is_active: true }
];

const mockEvents = [
  { id: '1', destination: mockDestinations[0], name: 'Ceremonia del Té Privada', event_date: new Date('2026-10-15'), base_price: 1500, photo_url: 'https://images.unsplash.com/photo-1531214159280-079b95d26139?q=80&w=2070', is_active: true },
  { id: '2', destination: mockDestinations[2], name: 'Cena en la Torre Eiffel', event_date: new Date('2026-12-31'), base_price: 2500, photo_url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070', is_active: true }
];

const mockPackages = [
  { id: '1', destination: mockDestinations[1], name: 'Escape de Lujo', days: 7, nights: 6, base_price: 12000, is_active: true, description: 'Una semana en villa sobre el agua con mayordomo privado.' },
  { id: '2', destination: mockDestinations[3], name: 'Safari en el Desierto VIP', days: 5, nights: 4, base_price: 8500, is_active: true, description: 'Aventuras exclusivas y cenas bajo las estrellas.' }
];

const mockVisas = [
  { id: '1', destination: mockDestinations[0], visa_type: 'Turista Electrónica', requirements: '<h3>Requisitos:</h3><ul><li>Pasaporte válido</li><li>Foto digital</li></ul>', is_active: true }
];

const mockOffers = [
  { id: '1', title: 'Black Friday Lujo', discount_percentage: 20, valid_from: new Date(), valid_until: new Date(new Date().setMonth(new Date().getMonth() + 1)), package: mockPackages[0], is_active: true }
];

const mockConfig = [
  { key: 'whatsapp_number', value: '+1234567890' },
  { key: 'contact_email', value: 'hello@elevatetravel.com' }
];

export const mockInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const url = req.url;

  // Interceptar Login
  if (url.includes('/auth/login') && req.method === 'POST') {
    return of(new HttpResponse({ status: 200, body: { access_token: 'mock-jwt-token-12345' } })).pipe(delay(800));
  }

  // Interceptar Destinos
  if (url.includes('/destinations')) {
    if (req.method === 'GET') return of(new HttpResponse({ status: 200, body: mockDestinations })).pipe(delay(500));
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH' || req.method === 'DELETE') {
      return of(new HttpResponse({ status: 200, body: { success: true } })).pipe(delay(500));
    }
  }

  // Interceptar Eventos
  if (url.includes('/events')) {
    if (req.method === 'GET') return of(new HttpResponse({ status: 200, body: mockEvents })).pipe(delay(500));
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH' || req.method === 'DELETE') {
      return of(new HttpResponse({ status: 200, body: { success: true } })).pipe(delay(500));
    }
  }

  // Interceptar Paquetes
  if (url.includes('/packages')) {
    if (req.method === 'GET') return of(new HttpResponse({ status: 200, body: mockPackages })).pipe(delay(500));
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH' || req.method === 'DELETE') {
      return of(new HttpResponse({ status: 200, body: { success: true } })).pipe(delay(500));
    }
  }

  // Interceptar Visas
  if (url.includes('/visas')) {
    if (req.method === 'GET') return of(new HttpResponse({ status: 200, body: mockVisas })).pipe(delay(500));
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH' || req.method === 'DELETE') {
      return of(new HttpResponse({ status: 200, body: { success: true } })).pipe(delay(500));
    }
  }

  // Interceptar Ofertas
  if (url.includes('/offers')) {
    if (req.method === 'GET') return of(new HttpResponse({ status: 200, body: mockOffers })).pipe(delay(500));
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH' || req.method === 'DELETE') {
      return of(new HttpResponse({ status: 200, body: { success: true } })).pipe(delay(500));
    }
  }

  // Interceptar Config
  if (url.includes('/config')) {
    if (req.method === 'GET') return of(new HttpResponse({ status: 200, body: mockConfig })).pipe(delay(500));
    if (req.method === 'PUT') return of(new HttpResponse({ status: 200, body: { success: true } })).pipe(delay(500));
  }

  // Por defecto, dejar pasar la petición
  return next(req);
};
