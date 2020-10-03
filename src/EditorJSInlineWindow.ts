import type { EditorJSInlineConfig } from '.';

interface EditorJSInlineWindow extends Window {
  editorJSInlineConfig?: EditorJSInlineConfig;
}

export default EditorJSInlineWindow;
