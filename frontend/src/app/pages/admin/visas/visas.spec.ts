import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Visas } from './visas';

describe('Visas', () => {
  let component: Visas;
  let fixture: ComponentFixture<Visas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Visas],
    }).compileComponents();

    fixture = TestBed.createComponent(Visas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
