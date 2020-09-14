import type IframeWindow from './IframeWindow';
import { v4 as uuidv4 } from 'uuid';
import type EditorJSInlineWindow from './EditorJSInlineWindow';
// @ts-ignore
import iframeWorker from '../dist/iframeWorker.js';

declare const window: EditorJSInlineWindow;

class EditorJSInlineElement extends HTMLElement {
  #iframe?: HTMLIFrameElement;
  #shadow: ShadowRoot;

  constructor() {
    super();

    this.#shadow = this.attachShadow({ mode: 'open' });
  }

  closeToolbars() {
    if (!this.#iframe?.contentWindow) {
      throw new Error("Couldn't close toolbars of editorjs-inline. ");
    }

    const iframeWorkerWindow = this.#iframe.contentWindow as IframeWindow;

    iframeWorkerWindow.editorJSInline.closeToolbars();
  }

  connectedCallback() {
    const id = uuidv4();

    this.dataset.id = id;
    this.style.display = 'inline-block';

    this.#iframe = document.createElement('iframe');

    this.#iframe.scrolling = 'no';
    this.#iframe.style.border = 'none';
    this.#iframe.style.width = '100%';
    this.#iframe.title = 'editorjs-inline';

    const styleHTML = Array.from(document.querySelectorAll('style'))
      .map((style) => style.outerHTML)
      .join('');

    this.#iframe.srcdoc = `
      <!doctype html>
      <html>
        <head>
          ${styleHTML}

          <style>
            body {
              margin: 0 16px;
              padding: 0;
            }

            .ce-toolbox, .ce-inline-toolbar, .ce-conversion-toolbar {
              display: none;
            }

            .ce-inline-toolbar--showed, .ce-conversion-toolbar--showed {
              display: block;
            }

            .ce-toolbox--opened {
              display: -webkit-box;
              display: -ms-flexbox;
              display: flex;
            }
          </style>
        </head>

        <body>
          <script>${iframeWorker}</script>
        </body>
      </html>
    `;

    this.#iframe.addEventListener('load', () => {
      if (!this.#iframe?.contentWindow) {
        throw new Error("Couldn't create iframe for editorjs-inline. ");
      }

      const iframeWorkerWindow = this.#iframe.contentWindow as IframeWindow;

      iframeWorkerWindow.editorJSInline.load({
        id,
        editorConfig: {
          ...window.editorJSInlineConfig?.editorConfig,
          ...(this.dataset.output && { data: JSON.parse(this.dataset.output) }),
        },
      });
    });

    this.#shadow.append(this.#iframe);
  }

  disconnectedCallback() {
    this.#shadow.innerHTML = '';
  }

  setHeight({ height }: { height: string }) {
    if (!this.#iframe) {
      throw new Error("Couldn't set height of editorjs-inline. ");
    }

    this.#iframe.style.height = height;
  }
}

export default EditorJSInlineElement;
