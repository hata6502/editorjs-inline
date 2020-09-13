import type IframeWindow from './IframeWindow';
import { v4 as uuidv4 } from 'uuid';
import type EditorJSInlineWindow from './EditorJSInlineWindow';
// @ts-ignore
import iframeWorker from '../dist/iframeWorker.js';

declare const window: EditorJSInlineWindow;

class EditorJSInlineElement extends HTMLElement {
  connectedCallback() {
    const id = uuidv4();

    this.contentEditable = 'false';
    this.dataset.id = id;
    this.style.display = 'inline-block';

    this.append('\u200b');

    const iframe = document.createElement('iframe');

    iframe.scrolling = 'no';
    iframe.style.border = 'none';
    iframe.style.width = '100%';
    iframe.title = 'editorjs-inline';

    const styleHTML = Array.from(document.querySelectorAll('style'))
      .map((style) => style.outerHTML)
      .join('');

    iframe.srcdoc = `
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

    iframe.addEventListener('load', () => {
      if (!iframe.contentWindow) {
        throw new Error("Couldn't create iframe for editorjs-inline. ");
      }

      const iframeWorkerWindow = iframe.contentWindow as IframeWindow;

      iframeWorkerWindow.editorJSInline.load({
        id,
        editorConfig: {
          ...window.editorJSInlineConfig?.editorConfig,
          ...(this.dataset.output && { data: JSON.parse(this.dataset.output) }),
        },
      });
    });

    this.append(iframe);
  }

  disconnectedCallback() {
    this.innerHTML = '';
  }
}

export default EditorJSInlineElement;
