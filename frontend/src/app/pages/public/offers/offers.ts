import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { OffersService } from '../../../core/services/offers';
import { ConfigService } from '../../../core/services/config';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-public-offers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './offers.html'
})
export class PublicOffers implements OnInit {
  private offersService = inject(OffersService);
  private configService = inject(ConfigService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  public themeService = inject(ThemeService);

  offers: any[] = [];
  searchCountry: string = '';
  whatsappNumber: string = '1234567890';

  get filteredOffers() {
    if (!this.searchCountry) return this.offers;
    const search = this.searchCountry.toLowerCase();
    return this.offers.filter(o => 
      o.country?.toLowerCase().includes(search) ||
      o.title?.toLowerCase().includes(search) ||
      o.package?.name?.toLowerCase().includes(search) ||
      o.package?.destination?.country?.toLowerCase().includes(search) ||
      o.package?.destination?.city?.toLowerCase().includes(search)
    );
  }

  selectedItem: any = null;

  ngOnInit() {
    this.configService.getSettings().subscribe(settings => {
      if (settings && settings.whatsapp_general) {
        this.whatsappNumber = settings.whatsapp_general.replace(/\D/g, '');
      }
    });

    this.offersService.getPublicOffers().subscribe(data => {
      this.offers = data;
      this.route.queryParams.subscribe(params => {
        if (params['id']) {
          this.selectedItem = this.offers.find(o => o.id === params['id']) || null;
        } else {
          this.selectedItem = null;
        }
      });
    });
  }

  showDetails(offer: any) {
    this.router.navigate([], { queryParams: { id: offer.id } });
  }

  closeDetails() {
    this.router.navigate([], { queryParams: {} });
  }

  getDiscountedPrice(price: number, percentage: number): number {
    const rawPrice = price || 0;
    const rawPercent = percentage || 0;
    return rawPrice * (1 - rawPercent / 100);
  }
}
