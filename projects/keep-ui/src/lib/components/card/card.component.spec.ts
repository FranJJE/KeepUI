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

  it('should render an inner wrapper div', () => {
    const div = fixture.nativeElement.querySelector('div') as HTMLElement;
    expect(div).toBeTruthy();
  });

  describe('variant', () => {
    it('should apply outlined border by default', () => {
      const div = fixture.nativeElement.querySelector('div') as HTMLElement;
      expect(div.className).toContain('border-ku-secondary-border');
    });

    it('should not apply border for flat variant', () => {
      fixture.componentRef.setInput('variant', 'flat');
      fixture.detectChanges();
      const div = fixture.nativeElement.querySelector('div') as HTMLElement;
      expect(div.className).not.toContain('border-ku-secondary-border');
    });

    it('should apply brand border when selected regardless of variant', () => {
      fixture.componentRef.setInput('selected', true);
      fixture.detectChanges();
      const div = fixture.nativeElement.querySelector('div') as HTMLElement;
      expect(div.className).toContain('border-ku-brand-border');
    });

    it('should apply brand border when selected and flat', () => {
      fixture.componentRef.setInput('variant', 'flat');
      fixture.componentRef.setInput('selected', true);
      fixture.detectChanges();
      const div = fixture.nativeElement.querySelector('div') as HTMLElement;
      expect(div.className).toContain('border-ku-brand-border');
    });
  });

  describe('padding', () => {
    it('should apply md padding (p-4) by default', () => {
      const div = fixture.nativeElement.querySelector('div') as HTMLElement;
      expect(div.className).toContain('p-4');
    });

    it('should apply sm padding (p-3)', () => {
      fixture.componentRef.setInput('padding', 'sm');
      fixture.detectChanges();
      const div = fixture.nativeElement.querySelector('div') as HTMLElement;
      expect(div.className).toContain('p-3');
    });

    it('should apply lg padding (p-6)', () => {
      fixture.componentRef.setInput('padding', 'lg');
      fixture.detectChanges();
      const div = fixture.nativeElement.querySelector('div') as HTMLElement;
      expect(div.className).toContain('p-6');
    });

    it('should apply screen padding with px-4 and pt-4 but no full p-4', () => {
      fixture.componentRef.setInput('padding', 'screen');
      fixture.detectChanges();
      const div = fixture.nativeElement.querySelector('div') as HTMLElement;
      expect(div.className).toContain('px-4');
      expect(div.className).toContain('pt-4');
    });

    it('should render the auto spacer div for screen padding', () => {
      fixture.componentRef.setInput('padding', 'screen');
      fixture.detectChanges();
      const spacer = fixture.nativeElement.querySelector('[aria-hidden="true"]') as HTMLElement;
      expect(spacer).toBeTruthy();
      expect(spacer.className).toContain('h-4');
    });

    it('should not render the spacer div for non-screen padding', () => {
      const spacer = fixture.nativeElement.querySelector('[aria-hidden="true"]');
      expect(spacer).toBeNull();
    });

    it('should not apply any padding for none', () => {
      fixture.componentRef.setInput('padding', 'none');
      fixture.detectChanges();
      const div = fixture.nativeElement.querySelector('div') as HTMLElement;
      expect(div.className).not.toContain('p-3');
      expect(div.className).not.toContain('p-4');
      expect(div.className).not.toContain('p-6');
      expect(div.className).not.toContain('px-4');
    });
  });

  describe('colors', () => {
    it('should apply primary background by default', () => {
      const div = fixture.nativeElement.querySelector('div') as HTMLElement;
      expect(div.className).toContain('bg-ku-primary');
    });

    it('should apply secondary background', () => {
      fixture.componentRef.setInput('colors', 'secondary');
      fixture.detectChanges();
      const div = fixture.nativeElement.querySelector('div') as HTMLElement;
      expect(div.className).toContain('bg-ku-secondary');
    });
  });

  describe('clickable', () => {
    it('should not have role or tabindex when not clickable', () => {
      const div = fixture.nativeElement.querySelector('div') as HTMLElement;
      expect(div.getAttribute('role')).toBeNull();
      expect(div.getAttribute('tabindex')).toBeNull();
    });

    it('should have role=button and tabindex=0 when clickable', () => {
      fixture.componentRef.setInput('clickable', true);
      fixture.detectChanges();
      const div = fixture.nativeElement.querySelector('div') as HTMLElement;
      expect(div.getAttribute('role')).toBe('button');
      expect(div.getAttribute('tabindex')).toBe('0');
    });

    it('should emit clicked output on click when clickable', () => {
      fixture.componentRef.setInput('clickable', true);
      fixture.detectChanges();
      let emitted = false;
      component.clicked.subscribe(() => (emitted = true));
      (fixture.nativeElement.querySelector('div') as HTMLElement).click();
      expect(emitted).toBeTrue();
    });

    it('should not emit clicked on click when not clickable', () => {
      let emitted = false;
      component.clicked.subscribe(() => (emitted = true));
      (fixture.nativeElement.querySelector('div') as HTMLElement).click();
      expect(emitted).toBeFalse();
    });

    it('should emit clicked on Enter key when clickable', () => {
      fixture.componentRef.setInput('clickable', true);
      fixture.detectChanges();
      let emitted = false;
      component.clicked.subscribe(() => (emitted = true));
      const div = fixture.nativeElement.querySelector('div') as HTMLElement;
      div.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      expect(emitted).toBeTrue();
    });

    it('should emit clicked on Space key when clickable', () => {
      fixture.componentRef.setInput('clickable', true);
      fixture.detectChanges();
      let emitted = false;
      component.clicked.subscribe(() => (emitted = true));
      const div = fixture.nativeElement.querySelector('div') as HTMLElement;
      div.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
      expect(emitted).toBeTrue();
    });

    it('should apply cursor-pointer and focus ring when clickable', () => {
      fixture.componentRef.setInput('clickable', true);
      fixture.detectChanges();
      const div = fixture.nativeElement.querySelector('div') as HTMLElement;
      expect(div.className).toContain('cursor-pointer');
      expect(div.className).toContain('focus-visible:ring-ku-brand-border');
    });
  });

  describe('scrollable', () => {
    it('should apply overflow-y-auto and overflow-x-auto when scrollable', () => {
      fixture.componentRef.setInput('scrollable', true);
      fixture.detectChanges();
      const div = fixture.nativeElement.querySelector('div') as HTMLElement;
      expect(div.className).toContain('overflow-y-auto');
      expect(div.className).toContain('overflow-x-auto');
    });

    it('should not apply overflow classes when not scrollable', () => {
      const div = fixture.nativeElement.querySelector('div') as HTMLElement;
      expect(div.className).not.toContain('overflow-y-auto');
    });
  });

  describe('fullHeight', () => {
    it('should apply h-full on host element and inner div when fullHeight is true', () => {
      fixture.componentRef.setInput('fullHeight', true);
      fixture.detectChanges();
      const host = fixture.nativeElement as HTMLElement;
      const div = fixture.nativeElement.querySelector('div') as HTMLElement;
      expect(host.classList).toContain('h-full');
      expect(div.className).toContain('h-full');
    });

    it('should not apply h-full by default', () => {
      const host = fixture.nativeElement as HTMLElement;
      expect(host.classList).not.toContain('h-full');
    });
  });

  it('should project content via ng-content', () => {
    const inner = fixture.nativeElement.querySelector('div') as HTMLElement;
    inner.innerHTML = '<span id="projected">Hello</span>';
    expect(fixture.nativeElement.querySelector('#projected')).toBeTruthy();
  });
});
