import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { EventsService } from '../../../core/services/events';

@Component({
  selector: 'app-public-events',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './events.html'
})
export class PublicEvents implements OnInit {
  private eventsService = inject(EventsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  events: any[] = [];
  selectedItem: any = null;

  ngOnInit() {
    this.eventsService.getPublicEvents().subscribe(data => {
      this.events = data;
      this.route.queryParams.subscribe(params => {
        if (params['id']) {
          this.selectedItem = this.events.find(e => e.id === params['id']) || null;
        } else {
          this.selectedItem = null;
        }
      });
    });
  }

  showDetails(evt: any) {
    this.router.navigate([], { queryParams: { id: evt.id } });
  }

  closeDetails() {
    this.router.navigate([], { queryParams: {} });
  }
}
