import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBankComponent } from './new-bank.component';

describe('NewBankComponent', () => {
  let component: NewBankComponent;
  let fixture: ComponentFixture<NewBankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewBankComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
