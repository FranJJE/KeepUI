import { TestBed } from '@angular/core/testing';
import { provideKeepUi } from './provide-keep-ui';
import { FILE_PORT } from '../tokens/file.token';
import { WebFileService } from '../services/web-file.service';

describe('provideKeepUi', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideKeepUi()],
    });
  });

  it('should resolve FILE_PORT as WebFileService', () => {
    const port = TestBed.inject(FILE_PORT);
    expect(port).toBeInstanceOf(WebFileService);
  });

  it('should register a singleton FILE_PORT', () => {
    const port1 = TestBed.inject(FILE_PORT);
    const port2 = TestBed.inject(FILE_PORT);
    expect(port1).toBe(port2);
  });
});
