declare module 'react-quill' {
  import * as React from 'react';

  export interface ReactQuillProps {
    value?: string;
    defaultValue?: string;
    onChange?: (
      content: string,
      delta: any,
      source: string,
      editor: any
    ) => void;
    theme?: string;
    readOnly?: boolean;
    placeholder?: string;
    modules?: any;
    formats?: string[];
    bounds?: string | HTMLElement;
    style?: React.CSSProperties;
    className?: string;
  }

  const ReactQuill: React.ComponentType<ReactQuillProps>;
  export default ReactQuill;
}
