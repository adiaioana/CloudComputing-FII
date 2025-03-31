import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchResultPageComponentComponent } from './search-result-page-component.component';

describe('SearchResultPageComponentComponent', () => {
  let component: SearchResultPageComponentComponent;
  let fixture: ComponentFixture<SearchResultPageComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchResultPageComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchResultPageComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
