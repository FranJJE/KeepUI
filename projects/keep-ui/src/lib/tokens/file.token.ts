import { InjectionToken } from '@angular/core';
import { FilePort } from '../ports/file.port';

/**
 * Injection token for the platform file/image adapter.
 *
 * Register a concrete implementation with:
 * - `provideKeepUi()` for web projects
 * - `provideKeepUiCapacitor()` for Angular + Capacitor projects
 */
export const FILE_PORT = new InjectionToken<FilePort>('FILE_PORT');
