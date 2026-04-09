import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardComponent } from './card.component';

describe('CardComponent', () => {
  let fixture: ComponentFixture<CardComponent>;
  let component: CardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a card div', () => {
    const card = fixture.nativeElement.querySelector('.keepui-card') as HTMLElement;
    expect(card).toBeTruthy();
  });

  it('should apply elevation-1 class by default', () => {
    const card = fixture.nativeElement.querySelector('.keepui-card') as HTMLElement;
    expect(card.classList).toContain('keepui-card--elevation-1');
  });

  it('should apply the specified elevation class', () => {
    fixture.componentRef.setInput('elevation', 3);
    fixture.detectChanges();
    const card = fixture.nativeElement.querySelector('.keepui-card') as HTMLElement;
    expect(card.classList).toContain('keepui-card--elevation-3');
  });

  it('should project content via ng-content', () => {
    const host: HTMLElement = fixture.nativeElement;
    host.querySelector('.keepui-card')!.innerHTML = '<span id="test-content">Hello</span>';
    expect(host.querySelector('#test-content')).toBeTruthy();
  });
});
