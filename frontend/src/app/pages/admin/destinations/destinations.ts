import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { DestinationsService } from '../../../core/services/destinations';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

@Component({
  selector: 'app-destinations',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, TableModule, ButtonModule, DialogModule, InputTextModule, ToggleSwitchModule],
  templateUrl: './destinations.html',
  styles: [`
    ::ng-deep .p-datatable-dark .p-datatable-header,
    ::ng-deep .p-datatable-dark .p-datatable-thead > tr > th {
      background: rgba(0,0,0,0.5) !important;
      color: white !important;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    ::ng-deep .p-datatable-dark .p-datatable-tbody > tr > td {
      background: transparent !important;
      color: rgba(255,255,255,0.8);
      border-bottom: 1px solid rgba(255,255,255,0.05);
    }
    ::ng-deep .p-dialog {
      background: #111;
      border: 1px solid rgba(255,255,255,0.1);
    }
    ::ng-deep .p-dialog-header, ::ng-deep .p-dialog-content, ::ng-deep .p-dialog-footer {
      background: transparent !important;
      color: white;
    }
  `]
})
export class Destinations implements OnInit {
  private destinationsService = inject(DestinationsService);
  private fb = inject(FormBuilder);

  destinations: any[] = [];
  displayDialog = false;
  isEditing = false;
  currentId: string | null = null;

  countries = [
    'Afganistán', 'Albania', 'Alemania', 'Andorra', 'Angola', 'Antigua y Barbuda', 'Arabia Saudita', 'Argelia', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaiyán',
    'Bahamas', 'Bangladés', 'Barbados', 'Baréin', 'Bélgica', 'Belice', 'Benín', 'Bielorrusia', 'Birmania', 'Bolivia', 'Bosnia y Herzegovina', 'Botsuana', 'Brasil', 'Brunéi', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Bután',
    'Cabo Verde', 'Camboya', 'Camerún', 'Canadá', 'Catar', 'Chad', 'Chile', 'China', 'Chipre', 'Ciudad del Vaticano', 'Colombia', 'Comoras', 'Corea del Norte', 'Corea del Sur', 'Costa de Marfil', 'Costa Rica', 'Croacia', 'Cuba',
    'Dinamarca', 'Dominica',
    'Ecuador', 'Egipto', 'El Salvador', 'Emiratos Árabes Unidos', 'Eritrea', 'Eslovaquia', 'Eslovenia', 'España', 'Estados Unidos', 'Estonia', 'Etiopía',
    'Filipinas', 'Finlandia', 'Fiyi', 'Francia',
    'Gabón', 'Gambia', 'Georgia', 'Ghana', 'Granada', 'Grecia', 'Guatemala', 'Guyana', 'Guinea', 'Guinea ecuatorial', 'Guinea-Bisáu',
    'Haití', 'Honduras', 'Hungría',
    'India', 'Indonesia', 'Irak', 'Irán', 'Irlanda', 'Islandia', 'Islas Marshall', 'Islas Salomón', 'Israel', 'Italia',
    'Jamaica', 'Japón', 'Jordania',
    'Kazajistán', 'Kenia', 'Kirguistán', 'Kiribati', 'Kuwait',
    'Laos', 'Lesoto', 'Letonia', 'Líbano', 'Liberia', 'Libia', 'Liechtenstein', 'Lituania', 'Luxemburgo',
    'Macedonia del Norte', 'Madagascar', 'Malasia', 'Malaui', 'Maldivas', 'Malí', 'Malta', 'Marruecos', 'Mauricio', 'Mauritania', 'México', 'Micronesia', 'Moldavia', 'Mónaco', 'Mongolia', 'Montenegro', 'Mozambique',
    'Namibia', 'Nauru', 'Nepal', 'Nicaragua', 'Níger', 'Nigeria', 'Noruega', 'Nueva Zelanda',
    'Omán',
    'Países Bajos', 'Pakistán', 'Palaos', 'Panamá', 'Papúa Nueva Guinea', 'Paraguay', 'Perú', 'Polonia', 'Portugal',
    'Reino Unido', 'República Centroafricana', 'República Checa', 'República del Congo', 'República Democrática del Congo', 'República Dominicana', 'Ruanda', 'Rumanía', 'Rusia',
    'Samoa', 'San Cristóbal y Nieves', 'San Marino', 'San Vicente y las Granadinas', 'Santa Lucía', 'Santo Tomé y Príncipe', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leona', 'Singapur', 'Siria', 'Somalia', 'Sri Lanka', 'Suazilandia', 'Sudáfrica', 'Sudán', 'Sudán del Sur', 'Suecia', 'Suiza', 'Surinam',
    'Tailandia', 'Tanzania', 'Tayikistán', 'Timor Oriental', 'Togo', 'Tonga', 'Trinidad y Tobago', 'Túnez', 'Turkmenistán', 'Turquía', 'Tuvalu',
    'Ucrania', 'Uganda', 'Uruguay', 'Uzbekistán',
    'Vanuatu', 'Venezuela', 'Vietnam',
    'Yemen',
    'Yibuti',
    'Zambia', 'Zimbabue'
  ];

  form: FormGroup = this.fb.group({
    country: ['', Validators.required],
    city: [''],
    photo_url: ['', Validators.required],
    is_active: [true]
  });

  ngOnInit() {
    this.loadDestinations();
  }

  loadDestinations() {
    this.destinationsService.getAdminDestinations().subscribe({
      next: (data) => this.destinations = data,
      error: (err) => console.error('Error cargando destinos', err)
    });
  }

  showDialog() {
    this.isEditing = false;
    this.currentId = null;
    this.form.reset({ is_active: true });
    this.displayDialog = true;
  }

  editDestination(dest: any) {
    this.isEditing = true;
    this.currentId = dest.id;
    this.form.patchValue(dest);
    this.displayDialog = true;
  }

  saveDestination() {
    if (this.form.invalid) return;

    const req = this.isEditing && this.currentId
      ? this.destinationsService.update(this.currentId, this.form.value)
      : this.destinationsService.create(this.form.value);

    req.subscribe({
      next: () => {
        this.displayDialog = false;
        this.loadDestinations();
      },
      error: (err) => console.error('Error guardando', err)
    });
  }

  deleteDestination(id: string) {
    if (confirm('¿Estás seguro de eliminar este destino?')) {
      this.destinationsService.delete(id).subscribe({
        next: () => this.loadDestinations(),
        error: (err) => alert(err.error?.message || 'Error eliminando destino')
      });
    }
  }

  toggleStatus(dest: any) {
    this.destinationsService.toggleStatus(dest.id).subscribe({
      next: () => { dest.is_active = !dest.is_active; },
      error: (err) => console.error('Error cambiando estado', err)
    });
  }
}
