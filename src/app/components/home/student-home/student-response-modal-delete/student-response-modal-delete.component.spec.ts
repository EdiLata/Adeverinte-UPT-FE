import {ComponentFixture, TestBed} from '@angular/core/testing';

import {StudentResponseModalDeleteComponent} from './student-response-modal-delete.component';

describe('StudentResponseModalDeleteComponent', () => {
  let component: StudentResponseModalDeleteComponent;
  let fixture: ComponentFixture<StudentResponseModalDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentResponseModalDeleteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentResponseModalDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
