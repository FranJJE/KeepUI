import { TestBed } from '@angular/core/testing';
import { WebFileService } from './web-file.service';
import { FilePort } from '../ports/file.port';

describe('WebFileService', () => {
  let service: WebFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WebFileService],
    });
    service = TestBed.inject(WebFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should implement FilePort', () => {
    const port: FilePort = service;
    expect(typeof port.pickImage).toBe('function');
  });

  it('should resolve with FileResult when a file is selected', async () => {
    const mockFile = new File(['content'], 'photo.jpg', { type: 'image/jpeg' });

    // Stub document.createElement so the hidden input triggers onchange immediately
    spyOn(document, 'createElement').and.callFake((tag: string) => {
      if (tag === 'input') {
        const stub = {
          type: '',
          accept: '',
          files: { 0: mockFile, length: 1 } as unknown as FileList,
          onchange: null as EventListener | null,
          click() {
            if (typeof this.onchange === 'function') {
              (this.onchange as () => void)();
            }
          },
        };
        return stub as unknown as HTMLInputElement;
      }
      return document.createElement(tag);
    });

    // Stub FileReader so readAsDataURL resolves synchronously
    const fakeResult = 'data:image/jpeg;base64,abc123';
    const MockFileReader = class {
      result = fakeResult;
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      readAsDataURL(_blob: Blob) {
        if (typeof this.onload === 'function') this.onload();
      }
    };
    (window as unknown as Record<string, unknown>)['FileReader'] = MockFileReader;

    const result = await service.pickImage();

    expect(result.dataUrl).toBe(fakeResult);
    expect(result.mimeType).toBe('image/jpeg');
  });

  it('should reject when no file is selected', async () => {
    spyOn(document, 'createElement').and.callFake((tag: string) => {
      if (tag === 'input') {
        const stub = {
          type: '',
          accept: '',
          files: null as unknown as FileList,
          onchange: null as EventListener | null,
          click() {
            if (typeof this.onchange === 'function') {
              (this.onchange as () => void)();
            }
          },
        };
        return stub as unknown as HTMLInputElement;
      }
      return document.createElement(tag);
    });

    await expectAsync(service.pickImage()).toBeRejectedWithError('No file selected');
  });
});
