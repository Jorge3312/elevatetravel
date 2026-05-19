import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { VisasService } from '../../../core/services/visas';
import { ConfigService } from '../../../core/services/config';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-public-visas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './visas.html'
})
export class PublicVisas implements OnInit {
  private visasService = inject(VisasService);
  private configService = inject(ConfigService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  visas: any[] = [];
  searchCountry: string = '';
  whatsappNumber: string = '1234567890';

  get filteredVisas() {
    if (!this.searchCountry) return this.visas;
    return this.visas.filter(v => 
      v.country?.toLowerCase().includes(this.searchCountry.toLowerCase())
    );
  }

  selectedItem: any = null;

  ngOnInit() {
    this.configService.getSettings().subscribe(settings => {
      if (settings && settings.whatsapp_visas) {
        this.whatsappNumber = settings.whatsapp_visas.replace(/\D/g, '');
      }
    });

    this.visasService.getPublicVisas().subscribe(data => {
      this.visas = data.map(v => {
        let reqs = [];
        if (v.requirements) {
          try { reqs = typeof v.requirements === 'string' ? JSON.parse(v.requirements) : v.requirements; } catch(e) {}
        }
        return { ...v, parsedRequirements: reqs };
      });
      this.route.queryParams.subscribe(params => {
        if (params['id']) {
          this.selectedItem = this.visas.find(v => v.id === params['id']) || null;
        } else {
          this.selectedItem = null;
        }
      });
    });
  }

  showDetails(visa: any) {
    this.router.navigate([], { queryParams: { id: visa.id } });
  }

  closeDetails() {
    this.router.navigate([], { queryParams: {} });
  }
}
