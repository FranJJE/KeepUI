import { Injectable } from '@angular/core';
import { FilePort } from '../ports/file.port';
import { FileResult } from '../models/file-result.model';

/**
 * A controllable mock implementation of `FilePort` for use in unit tests.
 *
 * By default, `pickImage()` resolves successfully. Set `nextError` to make the
 * next call reject with that error.
 *
 * ```ts
 * providers: [{ provide: FILE_PORT, useClass: MockFileService }]
 * ```
 */
@Injectable()
export class MockFileService implements FilePort {
  /** Set this to make the next `pickImage()` call reject with this error. */
  nextError: Error | null = null;

  pickImage(): Promise<FileResult> {
    if (this.nextError) {
      const err = this.nextError;
      this.nextError = null;
      return Promise.reject(err);
    }
    return Promise.resolve({
      dataUrl: 'data:image/jpeg;base64,mockImageData==',
      mimeType: 'image/jpeg',
    });
  }
}
