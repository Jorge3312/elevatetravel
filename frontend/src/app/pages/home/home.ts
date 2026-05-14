import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { DestinationsService } from '../../core/services/destinations';
import { PackagesService } from '../../core/services/packages';
import { EventsService } from '../../core/services/events';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styles: [`
    @keyframes bounce-slow {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(6px); }
    }
    .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class Home implements OnInit {
  private destService = inject(DestinationsService);
  private pkgService = inject(PackagesService);
  private evtService = inject(EventsService);

  destinations: any[] = [];
  packages: any[] = [];
  events: any[] = [];
  heroDestination: any = null;

  loadingDest = true;
  loadingPkg = true;
  loadingEvt = true;

  ngOnInit() {
    this.destService.getPublicDestinations().subscribe({
      next: (data) => {
        this.destinations = data;
        this.heroDestination = data[0] ?? null;
        this.loadingDest = false;
        // Set the active index to the middle if there are enough items
        this.activeDestIndex = Math.floor(data.length / 2) || 0;
      },
      error: () => { this.loadingDest = false; }
    });

    this.pkgService.getPublicPackages().subscribe({
      next: (data) => { this.packages = data; this.loadingPkg = false; },
      error: () => { this.loadingPkg = false; }
    });

    this.evtService.getPublicEvents().subscribe({
      next: (data) => { this.events = data; this.loadingEvt = false; },
      error: () => { this.loadingEvt = false; }
    });
  }

  // Carousel Logic
  activeDestIndex = 0;

  getDestCardStyle(index: number) {
    const diff = index - this.activeDestIndex;
    let translateX = 0;
    let scale = 1;
    let rotateY = 0;
    let zIndex = 50;
    let opacity = 1;
    let blur = 0;

    if (diff === 0) {
      translateX = 0;
      scale = 1;
      rotateY = 0;
      zIndex = 50;
      opacity = 1;
      blur = 0;
    } else if (diff === 1) {
      translateX = 75;
      scale = 0.85;
      rotateY = -15;
      zIndex = 40;
      opacity = 0.9;
      blur = 0;
    } else if (diff === 2) {
      translateX = 145;
      scale = 0.7;
      rotateY = -25;
      zIndex = 30;
      opacity = 0.7;
      blur = 0;
    } else if (diff === -1) {
      translateX = -75;
      scale = 0.85;
      rotateY = 15;
      zIndex = 40;
      opacity = 0.9;
      blur = 0;
    } else if (diff === -2) {
      translateX = -145;
      scale = 0.7;
      rotateY = 25;
      zIndex = 30;
      opacity = 0.7;
      blur = 0;
    } else if (diff > 2) {
      translateX = 200;
      scale = 0.5;
      rotateY = -35;
      zIndex = 10;
      opacity = 0.3;
      blur = 4;
    } else if (diff < -2) {
      translateX = -200;
      scale = 0.5;
      rotateY = 35;
      zIndex = 10;
      opacity = 0.3;
      blur = 4;
    }

    return {
      'transform': `translateX(${translateX}%) scale(${scale}) rotateY(${rotateY}deg)`,
      'z-index': zIndex,
      'opacity': opacity,
      'filter': `blur(${blur}px)`,
      'transition': 'all 0.6s cubic-bezier(0.25, 1, 0.5, 1)'
    };
  }

  private router = inject(Router);

  goToDest(index: number, event: Event) {
    // If not active, prevent default click and just slide to it
    if (this.activeDestIndex !== index) {
      event.preventDefault();
      event.stopPropagation();
      this.activeDestIndex = index;
    } else {
      // If it is active, clicking anywhere on the card navigates
      this.router.navigate(['/destinations'], { queryParams: { id: this.destinations[index].id } });
    }
  }

  nextDest() {
    if (this.activeDestIndex < this.destinations.length - 1) {
      this.activeDestIndex++;
    }
  }

  prevDest() {
    if (this.activeDestIndex > 0) {
      this.activeDestIndex--;
    }
  }
}
