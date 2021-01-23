import type EditorJS from '@editorjs/editorjs';
import type { EditorConfig } from '@editorjs/editorjs';

interface EditorJSInlineToolConfig {
  EditorJS: typeof EditorJS;
  editorJSConfig: Omit<
    EditorConfig,
    'holder' | 'data' | 'minHeight' | 'readOnly'
  >;
}

interface EditorJSInlineWindow extends Window {
  editorJSInline: {
    tool: {
      config: EditorJSInlineToolConfig;
    };
  };
}

export type { EditorJSInlineToolConfig, EditorJSInlineWindow };
