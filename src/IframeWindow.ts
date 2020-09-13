import type { EditorJSInlineConfig } from './EditorJSInline';

interface IframeWindow extends Window {
  editorJSInline: {
    closeToolbars: () => void;
    load: (arg: {
      id: string;
      editorConfig: EditorJSInlineConfig['editorConfig'];
    }) => void;
  };
}

export default IframeWindow;
