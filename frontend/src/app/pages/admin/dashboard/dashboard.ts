import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DestinationsService } from '../../../core/services/destinations';
import { EventsService } from '../../../core/services/events';
import { PackagesService } from '../../../core/services/packages';
import { OffersService } from '../../../core/services/offers';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  private destinationsService = inject(DestinationsService);
  private eventsService = inject(EventsService);
  private packagesService = inject(PackagesService);
  private offersService = inject(OffersService);

  stats: { destinations?: number; events?: number; packages?: number; offers?: number } = {};

  ngOnInit() {
    // ✅ Carga datos reales en lugar de números estáticos hardcodeados
    this.destinationsService.getAdminDestinations().subscribe({
      next: (data) => this.stats.destinations = data.length,
      error: () => {}
    });
    this.eventsService.getAdminEvents().subscribe({
      next: (data) => this.stats.events = data.length,
      error: () => {}
    });
    this.packagesService.getAdminPackages().subscribe({
      next: (data) => this.stats.packages = data.length,
      error: () => {}
    });
    this.offersService.getAdminOffers().subscribe({
      next: (data) => this.stats.offers = data.filter((o: any) => o.is_active).length,
      error: () => {}
    });
  }
}
