/**
 * Represents the result of a file/image selection operation.
 * This model is platform-agnostic and used across all adapters.
 */
export interface FileResult {
  /** A data URL (e.g. `data:image/jpeg;base64,...`) or an HTTP/file URL ready to display. */
  dataUrl: string;
  /** MIME type of the selected file, e.g. `image/jpeg`. */
  mimeType: string;
}
