import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DestinationsService } from '../../core/services/destinations';
import { EventsService } from '../../core/services/events';
import { PackagesService } from '../../core/services/packages';
import { DialogModule } from 'primeng/dialog';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, DialogModule],
  templateUrl: './catalog.html',
  styles: [`
    ::ng-deep .premium-dialog .p-dialog-header { background: transparent !important; color: white; }
    ::ng-deep .premium-dialog .p-dialog-content { background: transparent !important; color: white; }
  `]
})
export class Catalog implements OnInit {
  private eventsService = inject(EventsService);
  private packagesService = inject(PackagesService);
  private route = inject(ActivatedRoute);

  events: any[] = [];
  packages: any[] = [];
  filter: 'all' | 'events' | 'packages' = 'all';

  displayModal = false;
  selectedItem: any = null;
  selectedType: 'event' | 'package' | null = null;

  ngOnInit() {
    forkJoin({
      events: this.eventsService.getPublicEvents(),
      packages: this.packagesService.getPublicPackages()
    }).subscribe(data => {
      this.events = data.events;
      this.packages = data.packages;

      // Check for query params to auto-open an item
      this.route.queryParams.subscribe(params => {
        if (params['item'] && params['type']) {
          const type = params['type'];
          const id = params['item'];
          
          if (type === 'event') {
            const evt = this.events.find(e => e.id === id);
            if (evt) this.showDetails(evt, 'event');
          } else if (type === 'package') {
            const pkg = this.packages.find(p => p.id === id);
            if (pkg) this.showDetails(pkg, 'package');
          }
        }
      });
    });
  }

  showDetails(item: any, type: 'event' | 'package') {
    this.selectedItem = item;
    this.selectedType = type;
    this.displayModal = true;
  }
}
