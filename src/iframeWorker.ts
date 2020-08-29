import EditorJS from '@editorjs/editorjs';
// @ts-expect-error
import List from '@editorjs/list';

new EditorJS({
  holder: document.body,
  minHeight: 0,
  tools: {
    list: List,
  },
});
