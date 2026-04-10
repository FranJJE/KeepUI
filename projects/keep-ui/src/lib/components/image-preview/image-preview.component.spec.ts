import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImagePreviewComponent } from './image-preview.component';
import { FILE_PORT } from '../../tokens/file.token';
import { MockFileService } from '../../testing/mock-file.service';

describe('ImagePreviewComponent', () => {
  let fixture: ComponentFixture<ImagePreviewComponent>;
  let component: ImagePreviewComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImagePreviewComponent],
      providers: [{ provide: FILE_PORT, useClass: MockFileService }],
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

  it('should pick image and display preview', async () => {
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

  it('should set error when filePort rejects', async () => {
    const filePort = TestBed.inject(FILE_PORT) as MockFileService;
    filePort.nextError = new Error('Camera cancelled');

    await component.pickImage();
    fixture.detectChanges();

    expect(component.error()).toBe('Camera cancelled');
    expect(component.imageUrl()).toBeNull();
  });

  it('should render the error message in the DOM', async () => {
    const filePort = TestBed.inject(FILE_PORT) as MockFileService;
    filePort.nextError = new Error('Permission denied');

    await component.pickImage();
    fixture.detectChanges();

    // El error se muestra en un <p role="alert">
    const errorEl = fixture.nativeElement.querySelector('[role="alert"]') as HTMLElement;
    expect(errorEl).toBeTruthy();
    expect(errorEl.textContent?.trim()).toBe('Permission denied');
  });
});
