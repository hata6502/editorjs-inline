import { v4 as uuidv4 } from 'uuid';
import { EditorJSInlineError } from './EditorJSInlineError';
import type { EditorJSInlineWindow } from './window';

declare const window: EditorJSInlineWindow;

class EditorJSInlineElement extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const editorJSHolder = document.createElement('div');
    const editorJSHolderID = uuidv4();

    editorJSHolder.id = editorJSHolderID;
    editorJSHolder.contentEditable = 'false';

    this.append(editorJSHolder);

    const config = window.editorJSInline.tool.config;
    const editorJSDataJSONString = this.dataset.editorjs;

    if (!editorJSDataJSONString) {
      throw new EditorJSInlineError();
    }

    new config.EditorJS({
      ...config.editorJSConfig,
      holder: editorJSHolderID,
      data: JSON.parse(editorJSDataJSONString),
      minHeight: 0,
      readOnly: true,
    });
  }

  disconnectedCallback() {
    this.innerHTML = '';
  }
}

export { EditorJSInlineElement };
