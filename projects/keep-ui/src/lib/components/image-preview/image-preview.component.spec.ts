import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImagePreviewComponent } from './image-preview.component';
import { FILE_PORT } from '../../tokens/file.token';
import { MockFileService } from '../../testing/mock-file.service';
import { provideKeepUiI18n } from '../../providers/keep-ui-i18n.provider';

describe('ImagePreviewComponent', () => {
  let fixture: ComponentFixture<ImagePreviewComponent>;
  let component: ImagePreviewComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImagePreviewComponent],
      providers: [
        { provide: FILE_PORT, useClass: MockFileService },
        provideKeepUiI18n(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ImagePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show no image initially', () => {
    expect(component.imageUrl()).toBeNull();
    const img = fixture.nativeElement.querySelector('img');
    expect(img).toBeNull();
  });

  it('should show no error initially', () => {
    expect(component.error()).toBeNull();
  });

  it('should not be loading initially', () => {
    expect(component.loading()).toBeFalse();
  });

  describe('pick button', () => {
    it('should render a <keepui-button> element', () => {
      const btn = fixture.nativeElement.querySelector('keepui-button');
      expect(btn).toBeTruthy();
    });

    it('should not have aria-busy when idle', () => {
      const btn = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
      expect(btn.getAttribute('aria-busy')).toBeNull();
    });

    it('should set aria-busy on the inner button when loading', () => {
      component.loading.set(true);
      fixture.detectChanges();
      const btn = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
      expect(btn.getAttribute('aria-busy')).toBe('true');
    });

    it('should disable the inner button when loading', () => {
      component.loading.set(true);
      fixture.detectChanges();
      const btn = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
      expect(btn.disabled).toBeTrue();
    });

    it('should show the spinner when loading', () => {
      component.loading.set(true);
      fixture.detectChanges();
      const spinner = fixture.nativeElement.querySelector('.keepui-btn-spinner');
      expect(spinner).toBeTruthy();
    });
  });

  describe('image pick success', () => {
    it('should display the preview image after picking', async () => {
      await component.pickImage();
      fixture.detectChanges();

      expect(component.imageUrl()).toBe('data:image/jpeg;base64,mockImageData==');
      const img = fixture.nativeElement.querySelector('img') as HTMLImageElement;
      expect(img).toBeTruthy();
      expect(img.getAttribute('src')).toBe('data:image/jpeg;base64,mockImageData==');
    });

    it('should clear loading state after pick', async () => {
      await component.pickImage();
      expect(component.loading()).toBeFalse();
    });

    it('should show the live region status when image is loaded', async () => {
      await component.pickImage();
      fixture.detectChanges();

      const status = fixture.nativeElement.querySelector('[role="status"]') as HTMLElement;
      expect(status).toBeTruthy();
      expect(status.textContent?.trim().length).toBeGreaterThan(0);
    });

    it('should keep live region empty when no image is loaded', () => {
      const status = fixture.nativeElement.querySelector('[role="status"]') as HTMLElement;
      expect(status).toBeTruthy();
      expect(status.textContent?.trim()).toBe('');
    });
  });

  describe('image pick error', () => {
    it('should set error when filePort rejects', async () => {
      const filePort = TestBed.inject(FILE_PORT) as MockFileService;
      filePort.nextError = new Error('Camera cancelled');

      await component.pickImage();
      fixture.detectChanges();

      expect(component.error()).toBe('Camera cancelled');
      expect(component.imageUrl()).toBeNull();
    });

    it('should render the error in a role="alert" element', async () => {
      const filePort = TestBed.inject(FILE_PORT) as MockFileService;
      filePort.nextError = new Error('Permission denied');

      await component.pickImage();
      fixture.detectChanges();

      const errorEl = fixture.nativeElement.querySelector('[role="alert"]') as HTMLElement;
      expect(errorEl).toBeTruthy();
      expect(errorEl.textContent?.trim()).toBe('Permission denied');
    });
  });
});
