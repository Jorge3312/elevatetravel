import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { VisasService } from '../../../core/services/visas';
import { DestinationsService } from '../../../core/services/destinations';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { SelectModule } from 'primeng/select';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-visas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, TableModule, ButtonModule, DialogModule, InputTextModule, ToggleSwitchModule, SelectModule, QuillModule],
  templateUrl: './visas.html'
})
export class Visas implements OnInit {
  private visasService = inject(VisasService);
  private destService = inject(DestinationsService);
  private fb = inject(FormBuilder);

  visas: any[] = [];
  destinations: any[] = [];
  displayDialog = false;
  isEditing = false;
  currentId: string | null = null;

  requirementsList: string[] = [];
  newRequirement = '';

  form: FormGroup = this.fb.group({
    destination_id: ['', Validators.required],
    visa_type: ['', Validators.required],
    photo_url: ['', Validators.required],
    is_active: [true]
  });

  ngOnInit() {
    this.loadVisas();
    this.destService.getAdminDestinations().subscribe(data => this.destinations = data);
  }

  loadVisas() {
    this.visasService.getAdminVisas().subscribe({
      next: (data) => this.visas = data,
      error: (err) => console.error(err)
    });
  }

  showDialog() {
    this.isEditing = false;
    this.currentId = null;
    this.form.reset({ is_active: true });
    this.requirementsList = [];
    this.newRequirement = '';
    this.displayDialog = true;
  }

  editVisa(visa: any) {
    this.isEditing = true;
    this.currentId = visa.id;
    let reqs = [];
    if (visa.requirements) {
      try { reqs = JSON.parse(visa.requirements); } catch(e) { reqs = []; }
    }
    this.requirementsList = reqs;
    this.newRequirement = '';
    this.form.patchValue({
      ...visa,
      destination_id: visa.destination?.id
    });
    this.displayDialog = true;
  }

  addRequirement() {
    if (this.newRequirement.trim()) {
      this.requirementsList.push(this.newRequirement.trim());
      this.newRequirement = '';
    }
  }

  removeRequirement(index: number) {
    this.requirementsList.splice(index, 1);
  }

  saveVisa() {
    if (this.form.invalid) return;
    
    const payload = {
      ...this.form.value,
      requirements: JSON.stringify(this.requirementsList)
    };

    const req = this.isEditing && this.currentId
      ? this.visasService.update(this.currentId, payload)
      : this.visasService.create(payload);

    req.subscribe({
      next: () => {
        this.displayDialog = false;
        this.loadVisas();
      },
      error: (err) => console.error(err)
    });
  }

  deleteVisa(id: string) {
    if (confirm('¿Eliminar visa?')) {
      this.visasService.delete(id).subscribe(() => this.loadVisas());
    }
  }

  toggleStatus(visa: any) {
    this.visasService.toggleStatus(visa.id).subscribe({
      next: () => visa.is_active = !visa.is_active,
      error: () => {}
    });
  }
}
