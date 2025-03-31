import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EachAttractionPageComponent } from './each-attraction-page.component';

describe('EachAttractionPageComponent', () => {
  let component: EachAttractionPageComponent;
  let fixture: ComponentFixture<EachAttractionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EachAttractionPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EachAttractionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
