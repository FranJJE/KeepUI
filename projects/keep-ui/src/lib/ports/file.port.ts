import { FileResult } from '../models/file-result.model';

/**
 * Platform-agnostic port (interface) for file/image selection.
 *
 * Provide a concrete implementation via the `FILE_PORT` injection token.
 * - Web: `WebFileService`
 * - Capacitor: `CapacitorFileService` (from `@keepui/ui/capacitor`)
 */
export interface FilePort {
  /**
   * Opens a platform-native image picker and returns the selected image.
   * Resolves with a `FileResult` containing a displayable URL and MIME type.
   * Rejects if the user cancels or an error occurs.
   */
  pickImage(): Promise<FileResult>;
}
