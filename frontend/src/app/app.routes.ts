import { Routes } from '@angular/router';
import { MainLayout } from './layouts/main-layout/main-layout';
import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/admin/dashboard/dashboard';
import { authGuard } from './core/guards/auth-guard';
import { Destinations } from './pages/admin/destinations/destinations';
import { Events } from './pages/admin/events/events';
import { Packages } from './pages/admin/packages/packages';
import { Offers } from './pages/admin/offers/offers';
import { Visas } from './pages/admin/visas/visas';
import { Config } from './pages/admin/config/config';
import { Catalog } from './pages/catalog/catalog';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', component: Home },
      { path: 'destinations', loadComponent: () => import('./pages/public/destinations/destinations').then(m => m.PublicDestinations) },
      { path: 'packages', loadComponent: () => import('./pages/public/packages/packages').then(m => m.PublicPackages) },
      { path: 'events', loadComponent: () => import('./pages/public/events/events').then(m => m.PublicEvents) },
      { path: 'visas', loadComponent: () => import('./pages/public/visas/visas').then(m => m.PublicVisas) },
      { path: 'privacy-policy', loadComponent: () => import('./pages/public/privacy-policy/privacy-policy').then(m => m.PrivacyPolicy) }
    ]
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [authGuard],
    children: [
      { path: '', component: Dashboard },
      { path: 'destinations', component: Destinations },
      { path: 'events', component: Events },
      { path: 'packages', component: Packages },
      { path: 'offers', component: Offers },
      { path: 'visas', component: Visas },
      { path: 'config', component: Config }
    ]
  },
  { path: '**', redirectTo: '' }
];
