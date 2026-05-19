import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { DestinationsService } from '../../core/services/destinations';
import { PackagesService } from '../../core/services/packages';
import { EventsService } from '../../core/services/events';
import { OffersService } from '../../core/services/offers';
import { VisasService } from '../../core/services/visas';
import { ThemeService } from '../../core/services/theme.service';
import { ConfigService } from '../../core/services/config';

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
  private offerService = inject(OffersService);
  private visaService = inject(VisasService);
  public themeService = inject(ThemeService);
  private configService = inject(ConfigService);

  destinations: any[] = [];
  packages: any[] = [];
  events: any[] = [];
  offers: any[] = [];
  visas: any[] = [];
  heroDestination: any = null;
  whatsappNumber = '1234567890';

  loadingDest = true;
  loadingPkg = true;
  loadingEvt = true;
  loadingOfr = true;
  loadingVis = true;

  ngOnInit() {
    this.configService.getSettings().subscribe(settings => {
      if (settings && settings.whatsapp_general) {
        this.whatsappNumber = settings.whatsapp_general.replace(/\D/g, '');
      }
    });

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
      next: (data) => {
        this.packages = data;
        this.loadingPkg = false;
        this.activePkgIndex = Math.floor(data.length / 2) || 0;
      },
      error: () => { this.loadingPkg = false; }
    });

    this.evtService.getPublicEvents().subscribe({
      next: (data) => {
        this.events = data;
        this.loadingEvt = false;
        this.activeEvtIndex = Math.floor(data.length / 2) || 0;
      },
      error: () => { this.loadingEvt = false; }
    });

    this.offerService.getPublicOffers().subscribe({
      next: (data) => {
        this.offers = data;
        this.loadingOfr = false;
        this.activeOfrIndex = Math.floor(data.length / 2) || 0;
      },
      error: () => { this.loadingOfr = false; }
    });

    this.visaService.getPublicVisas().subscribe({
      next: (data) => {
        this.visas = data;
        this.loadingVis = false;
        this.activeVisIndex = Math.floor(data.length / 2) || 0;
      },
      error: () => { this.loadingVis = false; }
    });
  }

  scrollToDestinations() {
    const el = document.getElementById('tour-catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    }
  }

  // Carousel Logic
  activeDestIndex = 0;
  activePkgIndex = 0;
  activeEvtIndex = 0;
  activeOfrIndex = 0;
  activeVisIndex = 0;

  getDestCardStyle(index: number) {
    return this.getGenericCardStyle(index, this.activeDestIndex);
  }

  getPkgCardStyle(index: number) {
    return this.getGenericCardStyle(index, this.activePkgIndex);
  }

  getEvtCardStyle(index: number) {
    return this.getGenericCardStyle(index, this.activeEvtIndex);
  }

  getOfrCardStyle(index: number) {
    return this.getGenericCardStyle(index, this.activeOfrIndex);
  }

  getVisCardStyle(index: number) {
    return this.getGenericCardStyle(index, this.activeVisIndex);
  }

  private getGenericCardStyle(index: number, activeIndex: number) {
    const diff = index - activeIndex;
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
    if (this.activeDestIndex !== index) {
      event.preventDefault();
      event.stopPropagation();
      this.activeDestIndex = index;
    } else {
      this.router.navigate(['/destinations'], { queryParams: { id: this.destinations[index].id } });
    }
  }

  goToPkg(index: number, event: Event) {
    if (this.activePkgIndex !== index) {
      event.preventDefault();
      event.stopPropagation();
      this.activePkgIndex = index;
    } else {
      this.router.navigate(['/packages'], { queryParams: { id: this.packages[index].id } });
    }
  }

  goToEvt(index: number, event: Event) {
    if (this.activeEvtIndex !== index) {
      event.preventDefault();
      event.stopPropagation();
      this.activeEvtIndex = index;
    } else {
      this.router.navigate(['/events'], { queryParams: { id: this.events[index].id } });
    }
  }

  goToOfr(index: number, event: Event) {
    if (this.activeOfrIndex !== index) {
      event.preventDefault();
      event.stopPropagation();
      this.activeOfrIndex = index;
    } else {
      this.router.navigate(['/offers'], { queryParams: { id: this.offers[index].id } });
    }
  }

  goToVis(index: number, event: Event) {
    if (this.activeVisIndex !== index) {
      event.preventDefault();
      event.stopPropagation();
      this.activeVisIndex = index;
    } else {
      this.router.navigate(['/visas'], { queryParams: { id: this.visas[index].id } });
    }
  }

  nextDest() {
    if (this.activeDestIndex < this.destinations.length - 1) this.activeDestIndex++;
  }

  prevDest() {
    if (this.activeDestIndex > 0) this.activeDestIndex--;
  }

  nextPkg() {
    if (this.activePkgIndex < this.packages.length - 1) this.activePkgIndex++;
  }

  prevPkg() {
    if (this.activePkgIndex > 0) this.activePkgIndex--;
  }

  nextEvt() {
    if (this.activeEvtIndex < this.events.length - 1) this.activeEvtIndex++;
  }

  prevEvt() {
    if (this.activeEvtIndex > 0) this.activeEvtIndex--;
  }

  nextOfr() {
    if (this.activeOfrIndex < this.offers.length - 1) this.activeOfrIndex++;
  }

  prevOfr() {
    if (this.activeOfrIndex > 0) this.activeOfrIndex--;
  }

  nextVis() {
    if (this.activeVisIndex < this.visas.length - 1) this.activeVisIndex++;
  }

  prevVis() {
    if (this.activeVisIndex > 0) this.activeVisIndex--;
  }
}