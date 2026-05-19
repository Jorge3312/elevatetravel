import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DestinationsService } from '../../core/services/destinations';
import { EventsService } from '../../core/services/events';
import { PackagesService } from '../../core/services/packages';
import { ConfigService } from '../../core/services/config';
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
  private configService = inject(ConfigService);
  private route = inject(ActivatedRoute);

  events: any[] = [];
  whatsappNumber = '1234567890';
  packages: any[] = [];
  filter: 'all' | 'events' | 'packages' = 'all';

  displayModal = false;
  selectedItem: any = null;
  selectedType: 'event' | 'package' | null = null;

  ngOnInit() {
    this.configService.getSettings().subscribe(settings => {
      if (settings && settings.whatsapp_general) {
        this.whatsappNumber = settings.whatsapp_general.replace(/\D/g, '');
      }
    });

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
