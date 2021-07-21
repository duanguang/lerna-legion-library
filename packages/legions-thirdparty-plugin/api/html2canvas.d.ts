import { RenderOptions } from './html2canvas/render/canvas/canvas-renderer';
import { CloneOptions } from './html2canvas/dom/document-cloner';
import { ResourceOptions } from './html2canvas/core/cache-storage';
export declare type html2canvasOptions = CloneOptions &
  RenderOptions &
  ResourceOptions & {
    backgroundColor: string | null;
    foreignObjectRendering: boolean;
    logging: boolean;
    removeContainer?: boolean;
  };
