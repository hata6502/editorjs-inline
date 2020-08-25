import EditorJS from 'editorjs-for-editorjs-inline';
import type {
  InlineTool,
  InlineToolConstructorOptions,
} from 'editorjs-for-editorjs-inline';
// @ts-expect-error
import List from '@editorjs/list';

class EditorJSInline implements InlineTool {
  static get isInline() {
    return true;
  }

  /*static get sanitize() {
    return {
    };
  }*/

  static get title() {
    return 'EditorJS';
  }

  constructor({ api, config }: InlineToolConstructorOptions) {
  }

  get shortcut() {
    return 'CMD+E';
  }

  surround(range: Range) {
    const holder = document.createElement('span');

    holder.style.backgroundColor = '#eeeeee';
    holder.style.display = 'inline-block';
    range.insertNode(holder);

    new EditorJS({
      holder,
      minHeight: 16,
      tools: {
        list: List
      },
    });
  }

  checkState() {
    return false;
  }

  render() {
    const button = document.createElement('button');

    button.type = 'button';
    button.innerHTML = 'TEST';

    return button;
  }
}

export default EditorJSInline;
