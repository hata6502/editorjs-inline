import type {
  InlineTool,
  InlineToolConstructorOptions,
} from '@editorjs/editorjs';
import { v4 as uuidv4 } from 'uuid';
import type IframeWindow from './IframeWindow';
import type MessageData from './MessageData';
import type { SavedMessageData } from './MessageData';
// @ts-ignore
import iframeWorker from '../dist/iframeWorker.js';

class EditorJSInline implements InlineTool {
  static get isInline() {
    return true;
  }

  static get sanitize() {
    return {
      span: {
        'data-editorjs-inline': true,
      },
    };
  }

  static get title() {
    return 'EditorJS';
  }

  constructor({ api, config }: InlineToolConstructorOptions) {
    window.addEventListener(
      'message',
      (event) => {
        const data: MessageData = event.data;

        if (typeof data !== 'object' || !('editorJSInline' in data)) {
          return;
        }

        ({
          saved: (data: SavedMessageData) => {
            const element = document.querySelector(
              `span[data-editorjs-inline-id="${data.id}"]`
            );

            if (!element) {
              throw new Error('editorjs-inline element is not found. ');
            }

            const span = element as HTMLSpanElement;

            span.dataset.editorjsInline = JSON.stringify(data.outputData);
          },
          saving: () => {},
        }[data.type](data as never));
      },
      false
    );
  }

  get shortcut() {
    return 'CMD+E';
  }

  surround(range: Range) {
    const id = uuidv4();
    const span = document.createElement('span');

    span.contentEditable = 'false';
    span.dataset.editorjsInlineId = id;

    const iframe = document.createElement('iframe');

    iframe.srcdoc = `
      <!doctype html>
      <html>
        <head></head>
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

      iframeWorkerWindow.id = id;
    });

    span.appendChild(iframe);
    range.insertNode(span);
  }

  checkState() {
    return false;
  }

  render() {
    const button = document.createElement('button');

    button.type = 'button';
    button.innerHTML = 'EditorJS';

    return button;
  }
}

export default EditorJSInline;
