import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DestinationsService } from '../../../core/services/destinations';
import { EventsService } from '../../../core/services/events';
import { PackagesService } from '../../../core/services/packages';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-public-destinations',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './destinations.html'
})
export class PublicDestinations implements OnInit {
  private destinationsService = inject(DestinationsService);
  private eventsService = inject(EventsService);
  private packagesService = inject(PackagesService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  destinations: any[] = [];
  events: any[] = [];
  packages: any[] = [];
  
  selectedDestination: any = null;
  destEvents: any[] = [];
  destPackages: any[] = [];

  ngOnInit() {
    forkJoin({
      dests: this.destinationsService.getPublicDestinations(),
      evts: this.eventsService.getPublicEvents(),
      pkgs: this.packagesService.getPublicPackages()
    }).subscribe(data => {
      this.destinations = data.dests;
      this.events = data.evts;
      this.packages = data.pkgs;

      this.route.queryParams.subscribe(params => {
        if (params['id']) {
          this.selectedDestination = this.destinations.find(d => d.id === params['id']) || null;
          if (this.selectedDestination) {
            this.destEvents = this.events.filter(e => e.destination_id === this.selectedDestination.id || e.destination?.id === this.selectedDestination.id);
            this.destPackages = this.packages.filter(p => p.destination_id === this.selectedDestination.id || p.destination?.id === this.selectedDestination.id);
          }
        } else {
          this.selectedDestination = null;
        }
      });
    });
  }

  showDetails(dest: any) {
    this.router.navigate([], { queryParams: { id: dest.id } });
  }

  closeDetails() {
    this.router.navigate([], { queryParams: {} });
  }
}
