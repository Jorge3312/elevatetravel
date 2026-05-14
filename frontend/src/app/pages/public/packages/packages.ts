import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PackagesService } from '../../../core/services/packages';

@Component({
  selector: 'app-public-packages',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './packages.html'
})
export class PublicPackages implements OnInit {
  private packagesService = inject(PackagesService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  packages: any[] = [];
  selectedItem: any = null;

  ngOnInit() {
    this.packagesService.getPublicPackages().subscribe(data => {
      this.packages = data;
      this.route.queryParams.subscribe(params => {
        if (params['id']) {
          this.selectedItem = this.packages.find(p => p.id === params['id']) || null;
        } else {
          this.selectedItem = null;
        }
      });
    });
  }

  showDetails(pkg: any) {
    this.router.navigate([], { queryParams: { id: pkg.id } });
  }

  closeDetails() {
    this.router.navigate([], { queryParams: {} });
  }
}
