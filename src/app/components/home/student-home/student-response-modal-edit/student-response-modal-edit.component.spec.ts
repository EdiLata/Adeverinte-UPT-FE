import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';

import {StudentResponseModalEditComponent} from './student-response-modal-edit.component';

describe('StudentResponseModalEditComponent', () => {
  let component: StudentResponseModalEditComponent;
  let fixture: ComponentFixture<StudentResponseModalEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentResponseModalEditComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      StudentResponseModalEditComponent,
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
