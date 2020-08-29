import EditorJS from 'editorjs-for-editorjs-inline';
// @ts-expect-error
import List from '@editorjs/list';

new EditorJS({
  holder: document.body,
  minHeight: 0,
  tools: {
    list: List,
  },
});
