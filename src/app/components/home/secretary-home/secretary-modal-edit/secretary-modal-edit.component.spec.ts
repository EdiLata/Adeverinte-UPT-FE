import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';

import {SecretaryModalEditComponent} from './secretary-modal-edit.component';

describe('SecretaryModalEditComponent', () => {
  let component: SecretaryModalEditComponent;
  let fixture: ComponentFixture<SecretaryModalEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecretaryModalEditComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      SecretaryModalEditComponent,
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
