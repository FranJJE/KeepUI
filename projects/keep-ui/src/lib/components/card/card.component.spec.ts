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
    const card = fixture.nativeElement.querySelector('div') as HTMLElement;
    expect(card).toBeTruthy();
  });

  it('should default to elevation 1', () => {
    expect(component.elevation()).toBe(1);
  });

  it('should apply shadow class for elevation 1 by default', () => {
    const card = fixture.nativeElement.querySelector('div') as HTMLElement;
    expect(card.classList).toContain('shadow-keepui-sm');
  });

  it('should apply correct shadow class for elevation 2', () => {
    fixture.componentRef.setInput('elevation', 2);
    fixture.detectChanges();
    const card = fixture.nativeElement.querySelector('div') as HTMLElement;
    expect(card.classList).toContain('shadow-keepui-md');
  });

  it('should apply correct shadow class for elevation 3', () => {
    fixture.componentRef.setInput('elevation', 3);
    fixture.detectChanges();
    const card = fixture.nativeElement.querySelector('div') as HTMLElement;
    expect(card.classList).toContain('shadow-keepui-lg');
  });

  it('should not apply shadow class for elevation 0', () => {
    fixture.componentRef.setInput('elevation', 0);
    fixture.detectChanges();
    const card = fixture.nativeElement.querySelector('div') as HTMLElement;
    expect(card.classList).not.toContain('shadow-keepui-sm');
    expect(card.classList).not.toContain('shadow-keepui-md');
    expect(card.classList).not.toContain('shadow-keepui-lg');
  });

  it('should project content via ng-content', () => {
    const host: HTMLElement = fixture.nativeElement;
    host.querySelector('div')!.innerHTML = '<span id="test-content">Hello</span>';
    expect(host.querySelector('#test-content')).toBeTruthy();
  });
});
