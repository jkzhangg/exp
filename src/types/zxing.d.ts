declare module '@zxing/browser' {
  import { Result } from '@zxing/library';

  export class BrowserMultiFormatReader {
    decodeOnce(source: HTMLVideoElement): Promise<Result>;
    decodeFromStream(
      stream: MediaStream,
      video: HTMLVideoElement,
      callbackFn: (result: Result | null) => void
    ): Promise<void>;
    reset(): void;
  }
} 