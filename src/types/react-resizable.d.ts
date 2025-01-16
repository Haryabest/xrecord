declare module 'react-resizable' {
    import { ReactElement } from 'react';
  
    export interface ResizeCallbackData {
      node: HTMLElement;
      size: { width: number; height: number };
      handle: string;
    }
  
    export interface ResizableBoxProps {
      width: number;
      height: number;
      onResize?: (e: React.SyntheticEvent, data: ResizeCallbackData) => void;
      minConstraints?: [number, number];
      maxConstraints?: [number, number];
      resizeHandles?: Array<'s' | 'w' | 'e' | 'n' | 'sw' | 'nw' | 'se' | 'ne'>;
      axis?: 'both' | 'x' | 'y' | 'none';
      handle?: ReactElement;
      handleSize?: [number, number];
      lockAspectRatio?: boolean;
      className?: string;
      children?: React.ReactNode;
    }
  
    export class ResizableBox extends React.Component<ResizableBoxProps> {}
  }