import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  let fixture: ComponentFixture<ButtonComponent>;
  let component: ButtonComponent;
  let btn: HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    btn = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a <button> element', () => {
    expect(btn).toBeTruthy();
  });

  it('should default to type="button"', () => {
    expect(btn.getAttribute('type')).toBe('button');
  });

  it('should be enabled by default', () => {
    expect(btn.disabled).toBeFalse();
  });

  it('should apply type attribute', () => {
    fixture.componentRef.setInput('type', 'submit');
    fixture.detectChanges();
    expect(btn.getAttribute('type')).toBe('submit');
  });

  describe('disabled state', () => {
    it('should disable the button when disabled=true', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      expect(btn.disabled).toBeTrue();
    });

    it('should set aria-disabled when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      expect(btn.getAttribute('aria-disabled')).toBe('true');
    });

    it('should remove aria-disabled when not disabled', () => {
      expect(btn.getAttribute('aria-disabled')).toBeNull();
    });
  });

  describe('loading state', () => {
    it('should disable the button when loading=true', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();
      expect(btn.disabled).toBeTrue();
    });

    it('should set aria-busy when loading', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();
      expect(btn.getAttribute('aria-busy')).toBe('true');
    });

    it('should show the spinner when loading', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();
      expect(btn.querySelector('.keepui-btn-spinner')).toBeTruthy();
    });

    it('should not show the spinner when not loading', () => {
      expect(btn.querySelector('.keepui-btn-spinner')).toBeNull();
    });
  });

  describe('ariaLabel', () => {
    it('should set aria-label when provided', () => {
      fixture.componentRef.setInput('ariaLabel', 'Close dialog');
      fixture.detectChanges();
      expect(btn.getAttribute('aria-label')).toBe('Close dialog');
    });

    it('should not set aria-label when empty', () => {
      expect(btn.getAttribute('aria-label')).toBeNull();
    });
  });

  describe('clicked output', () => {
    it('should emit clicked when button is clicked', () => {
      let emitted = false;
      component.clicked.subscribe(() => (emitted = true));
      btn.click();
      expect(emitted).toBeTrue();
    });

    it('should not emit clicked when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      let emitted = false;
      component.clicked.subscribe(() => (emitted = true));
      btn.click();
      expect(emitted).toBeFalse();
    });

    it('should not emit clicked when loading', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();
      let emitted = false;
      component.clicked.subscribe(() => (emitted = true));
      btn.click();
      expect(emitted).toBeFalse();
    });
  });

  describe('shape', () => {
    it('should apply rounded-full class for pill shape', () => {
      fixture.componentRef.setInput('shape', 'pill');
      fixture.detectChanges();
      expect(btn.className).toContain('rounded-full');
    });

    it('should apply rounded-2xl class for rounded shape', () => {
      fixture.componentRef.setInput('shape', 'rounded');
      fixture.detectChanges();
      expect(btn.className).toContain('rounded-2xl');
    });
  });

  describe('fullWidth', () => {
    it('should contain w-full class when fullWidth=true', () => {
      fixture.componentRef.setInput('fullWidth', true);
      fixture.detectChanges();
      expect(btn.className).toContain('w-full');
    });

    it('should contain w-40 class when fullWidth=false and size=md', () => {
      fixture.componentRef.setInput('fullWidth', false);
      fixture.componentRef.setInput('size', 'md');
      fixture.detectChanges();
      expect(btn.className).toContain('w-40');
    });
  });
});
