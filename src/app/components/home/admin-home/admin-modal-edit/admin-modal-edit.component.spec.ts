import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';

import {AdminModalEditComponent} from './admin-modal-edit.component';

describe('ModalEditComponent', () => {
  let component: AdminModalEditComponent;
  let fixture: ComponentFixture<AdminModalEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminModalEditComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      AdminModalEditComponent,
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
