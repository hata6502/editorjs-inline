import type { EditorJSInlineConfig } from './EditorJSInline';

interface EditorJSInlineWindow extends Window {
  editorJSInlineConfig?: EditorJSInlineConfig;
}

export default EditorJSInlineWindow;
