import type { InlineTool } from '@editorjs/editorjs';

class EditorJSInline implements InlineTool {
  surround() {}

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
