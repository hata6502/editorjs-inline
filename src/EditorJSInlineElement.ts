import { v4 as uuidv4 } from 'uuid';
import EditorJSInlineError from './EditorJSInlineError';
import type { EditorJSElementWindow } from './editorJSElement';
import element from './editorJSElement/index.html';

class EditorJSInlineElement extends HTMLElement {
  #iframe?: HTMLIFrameElement;
  #shadow: ShadowRoot;

  constructor() {
    super();

    this.contentEditable = 'false';
    this.innerHTML = '';

    // To display inline toolbar.
    this.append('\u200b');

    const span = document.createElement('span');

    this.#shadow = span.attachShadow({ mode: 'open' });
    this.append(span);
  }

  closeToolbars() {
    if (!this.#iframe?.contentWindow) {
      throw new EditorJSInlineError();
    }

    const elementWindow = this.#iframe.contentWindow as EditorJSElementWindow;

    elementWindow.editorJSElement.closeToolbars();
  }

  connectedCallback() {
    const id = uuidv4();

    this.dataset.id = id;
    this.style.display = 'inline-block';

    this.#iframe = document.createElement('iframe');

    this.#iframe.scrolling = 'no';
    this.#iframe.srcdoc = element;
    this.#iframe.style.border = 'none';
    this.#iframe.style.width = '100%';
    this.#iframe.title = 'editorjs-inline';

    this.#iframe.addEventListener('load', () => {
      if (!this.#iframe?.contentWindow) {
        throw new EditorJSInlineError();
      }

      const elementWindow = this.#iframe.contentWindow as EditorJSElementWindow;

      elementWindow.editorJSElement.load({
        id,
      });
    });

    this.#shadow.append(this.#iframe);
  }

  disconnectedCallback() {
    this.#shadow.innerHTML = '';
  }

  setHeight({ height }: { height: string }) {
    if (!this.#iframe) {
      throw new EditorJSInlineError();
    }

    this.#iframe.style.height = height;
  }
}

export default EditorJSInlineElement;
