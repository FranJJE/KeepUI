import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { FilePort } from '@keepui/ui';
import { FileResult } from '@keepui/ui';

/**
 * Capacitor implementation of `FilePort`.
 *
 * Uses `@capacitor/camera` to open the native image picker on iOS/Android, and
 * falls back gracefully to the web camera on non-native platforms.
 *
 * The returned `dataUrl` is:
 * - On native: the result of `Capacitor.convertFileSrc(photo.path)`, which
 *   converts the native file path to an HTTP URL the WebView can display.
 * - On web/PWA: `photo.webPath` as-is.
 *
 * This service has no dependency on `WebFileService`; it is a fully independent
 * adapter registered by `provideKeepUiCapacitor()`.
 */
@Injectable()
export class CapacitorFileService implements FilePort {
  async pickImage(): Promise<FileResult> {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos,
      quality: 90,
    });

    // `photo.path` is the native file path (only available on native platforms).
    // `photo.webPath` is always available but may be undefined on some edge cases.
    const rawPath = photo.path ?? photo.webPath ?? '';

    // On a native Capacitor context, convert the native path to a WebView-friendly URL.
    const dataUrl = Capacitor.isNativePlatform()
      ? Capacitor.convertFileSrc(rawPath)
      : rawPath;

    return {
      dataUrl,
      mimeType: `image/${photo.format}`,
    };
  }
}
