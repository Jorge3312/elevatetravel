import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { PackagesService } from '../../../core/services/packages';
import { DestinationsService } from '../../../core/services/destinations';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';

import { MultiSelectModule } from 'primeng/multiselect';

const nightsValidator = (control: AbstractControl): ValidationErrors | null => {
  const days = control.get('days')?.value || 0;
  const nights = control.get('nights')?.value || 0;
  return nights > days ? { invalidNights: true } : null;
};

@Component({
  selector: 'app-packages',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, TableModule, ButtonModule, DialogModule, InputTextModule, ToggleSwitchModule, SelectModule, TextareaModule, MultiSelectModule],
  templateUrl: './packages.html'
})
export class Packages implements OnInit {
  private packagesService = inject(PackagesService);
  private destService = inject(DestinationsService);
  private fb = inject(FormBuilder);

  packages: any[] = [];
  destinations: any[] = [];
  displayDialog = false;
  isEditing = false;
  currentId: string | null = null;

  includesOptions = [
    { label: 'NOCHES DE ALOJAMIENTO HOTEL A ELECCIÓN.', value: 'ALOJAMIENTO' },
    { label: 'DESAYUNOS', value: 'DESAYUNOS' },
    { label: 'Seguro DE ASISTENCIA AL VIAJERO.', value: 'Seguro DE ASISTENCIA AL VIAJERO.' },
    { label: 'TRASLADOS AEROPUERTO - HOTEL - AEROPUERTO.', value: 'TRASLADOS AEROPUERTO - HOTEL - AEROPUERTO.' }
  ];

  form: FormGroup = this.fb.group({
    destination_id: ['', Validators.required],
    name: ['', Validators.required],
    description: [''],
    days: [0, Validators.required],
    nights: [0, Validators.required],
    includes: [[]],
    photo_url: [''],
    price_from: [0, Validators.required],
    is_active: [true]
  }, { validators: nightsValidator });

  ngOnInit() {
    this.loadPackages();
    this.destService.getAdminDestinations().subscribe(data => this.destinations = data);

    this.form.get('days')?.valueChanges.subscribe(days => {
      if (days && typeof days === 'number' && days > 0) {
        // Only auto-update nights if it hasn't been manually set to something higher
        // Or actually, just strictly set it to days - 1 as requested: "ejemplo 3 dias seria 2 noches"
        const currentNights = this.form.get('nights')?.value;
        const newNights = days - 1;
        // Only update if currentNights is less than or equal to previous days - 1, or just always update
        this.form.patchValue({ nights: newNights }, { emitEvent: false });
      } else if (days === 0) {
        this.form.patchValue({ nights: 0 }, { emitEvent: false });
      }
    });
  }

  loadPackages() {
    this.packagesService.getAdminPackages().subscribe({
      next: (data) => this.packages = data,
      error: (err) => console.error(err)
    });
  }

  showDialog() {
    this.isEditing = false;
    this.currentId = null;
    this.form.reset({ is_active: true, price_from: 0, days: 0, nights: 0, includes: [] });
    this.displayDialog = true;
  }

  editPackage(pkg: any) {
    this.isEditing = true;
    this.currentId = pkg.id;
    this.form.patchValue({
      ...pkg,
      destination_id: pkg.destination?.id
    });
    this.displayDialog = true;
  }

  savePackage() {
    if (this.form.invalid) return;
    const req = this.isEditing && this.currentId
      ? this.packagesService.update(this.currentId, this.form.value)
      : this.packagesService.create(this.form.value);

    req.subscribe({
      next: () => {
        this.displayDialog = false;
        this.loadPackages();
      },
      error: (err) => console.error(err)
    });
  }

  deletePackage(id: string) {
    if (confirm('¿Eliminar paquete?')) {
      this.packagesService.delete(id).subscribe(() => this.loadPackages());
    }
  }

  toggleStatus(pkg: any) {
    this.packagesService.toggleStatus(pkg.id).subscribe({
      next: () => pkg.is_active = !pkg.is_active,
      error: () => {}
    });
  }
}
