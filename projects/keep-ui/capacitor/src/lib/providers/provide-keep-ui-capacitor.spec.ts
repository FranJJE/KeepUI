import { TestBed } from '@angular/core/testing';
import { provideKeepUiCapacitor } from './provide-keep-ui-capacitor';
import { FILE_PORT } from '@keepui/ui';
import { CapacitorFileService } from '../services/capacitor-file.service';

describe('provideKeepUiCapacitor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideKeepUiCapacitor()],
    });
  });

  it('should resolve FILE_PORT as CapacitorFileService', () => {
    const port = TestBed.inject(FILE_PORT);
    expect(port).toBeInstanceOf(CapacitorFileService);
  });

  it('should register a singleton FILE_PORT', () => {
    const port1 = TestBed.inject(FILE_PORT);
    const port2 = TestBed.inject(FILE_PORT);
    expect(port1).toBe(port2);
  });
});

describe('CapacitorFileService', () => {
  let service: CapacitorFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CapacitorFileService],
    });
    service = TestBed.inject(CapacitorFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should implement FilePort', () => {
    expect(typeof service.pickImage).toBe('function');
  });

  it('should call Camera.getPhoto and return a FileResult', async () => {
    // Spy on the Camera module at runtime
    const { Camera } = await import('@capacitor/camera');
    spyOn(Camera, 'getPhoto').and.returnValue(
      Promise.resolve({
        path: '/var/mobile/Containers/photo.jpg',
        webPath: 'capacitor://localhost/_capacitor_file_/photo.jpg',
        format: 'jpeg',
        saved: false,
        exif: undefined,
        base64String: undefined,
        dataUrl: undefined,
      }),
    );

    const { Capacitor } = await import('@capacitor/core');
    spyOn(Capacitor, 'isNativePlatform').and.returnValue(false);

    const result = await service.pickImage();

    expect(result.mimeType).toBe('image/jpeg');
    expect(typeof result.dataUrl).toBe('string');
  });

  it('should use convertFileSrc on native platform', async () => {
    const { Camera } = await import('@capacitor/camera');
    spyOn(Camera, 'getPhoto').and.returnValue(
      Promise.resolve({
        path: '/var/mobile/photo.jpg',
        webPath: undefined,
        format: 'png',
        saved: false,
        exif: undefined,
        base64String: undefined,
        dataUrl: undefined,
      }),
    );

    const { Capacitor } = await import('@capacitor/core');
    spyOn(Capacitor, 'isNativePlatform').and.returnValue(true);
    spyOn(Capacitor, 'convertFileSrc').and.returnValue('http://localhost/photo.jpg');

    const result = await service.pickImage();

    expect(Capacitor.convertFileSrc).toHaveBeenCalledWith('/var/mobile/photo.jpg');
    expect(result.dataUrl).toBe('http://localhost/photo.jpg');
    expect(result.mimeType).toBe('image/png');
  });
});
