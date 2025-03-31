import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EachDestinationPageComponent } from './each-destination-page.component';

describe('EachDestinationPageComponent', () => {
  let component: EachDestinationPageComponent;
  let fixture: ComponentFixture<EachDestinationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EachDestinationPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EachDestinationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
