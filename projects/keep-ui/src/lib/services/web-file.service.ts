import { Injectable } from '@angular/core';
import { FilePort } from '../ports/file.port';
import { FileResult } from '../models/file-result.model';

/**
 * Web implementation of `FilePort`.
 *
 * Uses a hidden `<input type="file">` and the `FileReader` API to let the user
 * pick an image from the file system in a browser environment.
 *
 * This implementation has no dependency on Capacitor or any native plugin.
 */
@Injectable()
export class WebFileService implements FilePort {
  pickImage(): Promise<FileResult> {
    return new Promise<FileResult>((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';

      input.onchange = () => {
        const file = input.files?.[0];
        if (!file) {
          reject(new Error('No file selected'));
          return;
        }

        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            dataUrl: reader.result as string,
            mimeType: file.type,
          });
        };
        reader.onerror = () => reject(reader.error ?? new Error('FileReader error'));
        reader.readAsDataURL(file);
      };

      input.click();
    });
  }
}
