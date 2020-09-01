import type { EditorConfig } from '@editorjs/editorjs';

interface IframeWindow extends Window {
  editorJSInline: {
    closeToolbars: () => void;
    load: (arg: {
      id: string;
      editorConfig: Omit<EditorConfig, 'holder'>;
    }) => void;
  };
}

export default IframeWindow;
