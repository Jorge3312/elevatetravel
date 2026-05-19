import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { EventsService } from '../../../core/services/events';
import { DestinationsService } from '../../../core/services/destinations';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, TableModule, ButtonModule, DialogModule, InputTextModule, ToggleSwitchModule, DatePickerModule, SelectModule, TextareaModule, MultiSelectModule],
  templateUrl: './events.html',
})
export class Events implements OnInit {
  private eventsService = inject(EventsService);
  private destService = inject(DestinationsService);
  private fb = inject(FormBuilder);

  events: any[] = [];
  destinations: any[] = [];
  displayDialog = false;
  isEditing = false;
  currentId: string | null = null;

  includesList: string[] = [];
  newService = '';

  addService() {
    if (this.newService.trim()) {
      const upperService = this.newService.trim().toUpperCase();
      if (!this.includesList.includes(upperService)) {
        this.includesList.push(upperService);
      }
      this.newService = '';
    }
  }

  addSuggestion(suggestion: string) {
    const upperSuggestion = suggestion.toUpperCase();
    if (!this.includesList.includes(upperSuggestion)) {
      this.includesList.push(upperSuggestion);
    }
  }

  removeService(index: number) {
    this.includesList.splice(index, 1);
  }

  form: FormGroup = this.fb.group({
    destination_id: ['', Validators.required],
    name: ['', Validators.required],
    description: [''],
    start_date: [null, Validators.required],
    end_date: [null, Validators.required],
    includes: [[]],
    base_price: [0, Validators.required],
    photo_url: [''],
    is_active: [true]
  });

  ngOnInit() {
    this.loadEvents();
    this.destService.getAdminDestinations().subscribe(data => this.destinations = data);
  }

  loadEvents() {
    this.eventsService.getAdminEvents().subscribe({
      next: (data) => this.events = data,
      error: (err) => console.error(err)
    });
  }

  showDialog() {
    this.isEditing = false;
    this.currentId = null;
    this.includesList = [];
    this.newService = '';
    this.form.reset({ is_active: true, base_price: 0, includes: [] });
    this.displayDialog = true;
  }

  editEvent(evt: any) {
    this.isEditing = true;
    this.currentId = evt.id;

    // Map the string back to the token if it contains 'NOCHES DE ALOJAMIENTO'
    const mappedIncludes = (evt.includes || []).map((inc: string) => {
      if (inc && inc.includes('NOCHES DE ALOJAMIENTO')) return 'ALOJAMIENTO';
      return inc;
    });

    this.includesList = mappedIncludes;
    this.newService = '';

    this.form.patchValue({
      ...evt,
      destination_id: evt.destination?.id,
      start_date: evt.start_date ? new Date(evt.start_date) : null,
      end_date: evt.end_date ? new Date(evt.end_date) : null,
      base_price: evt.price_from || 0
    });
    this.displayDialog = true;
  }

  saveEvent() {
    if (this.form.invalid) return;

    // Calculate nights for Alojamiento if present
    let finalIncludes = [...this.includesList];
    if (this.form.value.start_date && this.form.value.end_date) {
      const start = new Date(this.form.value.start_date);
      const end = new Date(this.form.value.end_date);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const nights = diffDays > 0 ? diffDays : 0;
      const paddedNights = nights < 10 ? `0${nights}` : nights;

      finalIncludes = finalIncludes.map((inc: string) => {
        if (inc === 'ALOJAMIENTO' || (inc.includes('NOCHES DE ALOJAMIENTO') && !/^\d+/.test(inc))) {
          return `${paddedNights} NOCHES DE ALOJAMIENTO HOTEL A ELECCION.`;
        }
        return inc;
      });
    }

    this.form.patchValue({
      includes: finalIncludes
    });

    const formValue = { ...this.form.value };

    const req = this.isEditing && this.currentId
      ? this.eventsService.update(this.currentId, formValue)
      : this.eventsService.create(formValue);

    req.subscribe({
      next: () => {
        this.displayDialog = false;
        this.loadEvents();
      },
      error: (err) => console.error(err)
    });
  }

  deleteEvent(id: string) {
    if (confirm('¿Eliminar evento?')) {
      this.eventsService.delete(id).subscribe(() => this.loadEvents());
    }
  }

  toggleStatus(evt: any) {
    this.eventsService.toggleStatus(evt.id).subscribe({
      next: () => evt.is_active = !evt.is_active,
      error: () => {}
    });
  }
}
