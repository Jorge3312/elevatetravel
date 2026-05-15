import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { EventsService } from '../../../core/services/events';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-public-events',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './events.html'
})
export class PublicEvents implements OnInit {
  private eventsService = inject(EventsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  events: any[] = [];
  searchCountry: string = '';
  startDate: string = '';
  endDate: string = '';

  get filteredEvents() {
    return this.events.filter(e => {
      const matchCountry = !this.searchCountry || 
        e.destination?.country?.toLowerCase().includes(this.searchCountry.toLowerCase()) ||
        e.country?.toLowerCase().includes(this.searchCountry.toLowerCase());
      
      const eventDate = e.event_date;
      let matchDate = true;

      if (this.startDate && eventDate) {
        matchDate = matchDate && (eventDate >= this.startDate);
      }
      if (this.endDate && eventDate) {
        matchDate = matchDate && (eventDate <= this.endDate);
      }
      
      return matchCountry && matchDate;
    });
  }

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
