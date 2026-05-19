import { Component, HostListener, inject, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../core/services/theme.service';
import { ConfigService } from '../../core/services/config';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './main-layout.html',
})
export class MainLayout implements OnInit {
  scrolled = false;
  menuOpen = false;
  themeService = inject(ThemeService);
  private configService = inject(ConfigService);
  isHome = true;
  router = inject(Router);
  whatsappNumber = '1234567890';

  constructor() {
    this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        const url = e.urlAfterRedirects.split('?')[0];
        this.isHome = url === '/' || url === '/home';
      }
    });
  }

  ngOnInit() {
    this.configService.getSettings().subscribe(settings => {
      if (settings && settings.whatsapp_general) {
        this.whatsappNumber = settings.whatsapp_general.replace(/\D/g, '');
      }
    });
  }

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled = window.scrollY > 60;
  }
}
