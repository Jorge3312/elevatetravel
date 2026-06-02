import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { Router } from '@angular/router';
import { ThemeService } from '../../core/services/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './admin-layout.html',
})
export class AdminLayout implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);
  private themeService = inject(ThemeService);

  sidebarVisible = signal(false);

  toggleSidebar() {
    this.sidebarVisible.update(v => !v);
  }

  closeSidebar() {
    this.sidebarVisible.set(false);
  }

  ngOnInit() {
    // Force night mode (dark theme) when entering the admin layout
    document.documentElement.classList.add('dark');
  }

  ngOnDestroy() {
    // Restore the user's preferred theme when leaving the admin layout
    if (!this.themeService.isDark()) {
      document.documentElement.classList.remove('dark');
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
