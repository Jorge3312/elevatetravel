import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { OffersService } from '../../../core/services/offers';
import { PackagesService } from '../../../core/services/packages';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-offers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, TableModule, ButtonModule, DialogModule, InputTextModule, ToggleSwitchModule, SelectModule, DatePickerModule],
  templateUrl: './offers.html',
})
export class Offers implements OnInit {
  private offersService = inject(OffersService);
  private packagesService = inject(PackagesService);
  private fb = inject(FormBuilder);

  offers: any[] = [];
  packages: any[] = [];
  displayDialog = false;
  isEditing = false;
  currentId: string | null = null;

  form: FormGroup = this.fb.group({
    package_id: [null],
    title: ['', Validators.required],
    description: [''],
    discount_percentage: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
    valid_from: [null, Validators.required],
    valid_until: [null, Validators.required],
    is_active: [true]
  });

  ngOnInit() {
    this.loadOffers();
    this.packagesService.getAdminPackages().subscribe(data => this.packages = data);
  }

  loadOffers() {
    this.offersService.getAdminOffers().subscribe({
      next: (data) => this.offers = data,
      error: (err) => console.error(err)
    });
  }

  showDialog() {
    this.isEditing = false;
    this.currentId = null;
    this.form.reset({ is_active: true, discount_percentage: 0 });
    this.displayDialog = true;
  }

  editOffer(offer: any) {
    this.isEditing = true;
    this.currentId = offer.id;
    this.form.patchValue({
      ...offer,
      package_id: offer.package?.id,
      valid_from: new Date(offer.valid_from),
      valid_until: new Date(offer.valid_until)
    });
    this.displayDialog = true;
  }

  saveOffer() {
    if (this.form.invalid) return;
    const req = this.isEditing && this.currentId
      ? this.offersService.update(this.currentId, this.form.value)
      : this.offersService.create(this.form.value);

    req.subscribe({
      next: () => {
        this.displayDialog = false;
        this.loadOffers();
      },
      error: (err) => console.error(err)
    });
  }

  deleteOffer(id: string) {
    if (confirm('¿Eliminar oferta?')) {
      this.offersService.delete(id).subscribe(() => this.loadOffers());
    }
  }

  toggleStatus(offer: any) {
    this.offersService.toggleStatus(offer.id).subscribe({
      next: () => offer.is_active = !offer.is_active,
      error: () => {}
    });
  }
}
