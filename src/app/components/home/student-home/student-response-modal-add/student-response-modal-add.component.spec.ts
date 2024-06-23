import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';

import {StudentResponseModalAddComponent} from './student-response-modal-add.component';

describe('StudentResponseModalAddComponent', () => {
  let component: StudentResponseModalAddComponent;
  let fixture: ComponentFixture<StudentResponseModalAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentResponseModalAddComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      StudentResponseModalAddComponent,
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
