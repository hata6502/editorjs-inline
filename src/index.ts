import type {
  InlineTool,
  InlineToolConstructorOptions,
  OutputData,
} from '@editorjs/editorjs';
import { v4 as uuidv4 } from 'uuid';
import type IframeWindow from './IframeWindow';
import type MessageData from './MessageData';
import type { SavedMessageData } from './MessageData';
// @ts-ignore
import iframeWorker from '../dist/iframeWorker.js';

export interface EditorJSInlineConfig {}

interface EditorJSInlineConstructorOptions
  extends InlineToolConstructorOptions {
  config: EditorJSInlineConfig | object;
}

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

  private static createSpan({ data }: { data?: OutputData }) {
    const id = uuidv4();
    const span = document.createElement('span');

    span.contentEditable = 'false';

    if (data) {
      span.dataset.editorjsInline = JSON.stringify(data);
    }

    span.dataset.editorjsInlineId = id;

    const iframe = document.createElement('iframe');

    iframe.style.border = 'none';
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

      iframeWorkerWindow.editorJSInline.load({ id, data });
    });

    span.appendChild(iframe);

    return span;
  }

  constructor({ api, config }: EditorJSInlineConstructorOptions) {
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
    range.insertNode(EditorJSInline.createSpan({}));
  }

  checkState() {
    return false;
  }

  render() {
    const button = document.createElement('button');

    button.type = 'button';
    button.innerHTML = 'EditorJS';

    setTimeout(() => {
      const codexEditor = button.closest('.codex-editor');

      if (!codexEditor) {
        throw new Error("Couldn't load editorjs-inline. ");
      }

      const mutationObserver = new MutationObserver(() => {
        if (codexEditor.querySelector('.codex-editor__loader')) {
          return;
        }

        codexEditor
          .querySelectorAll('span[data-editorjs-inline]')
          .forEach((element) => {
            const span = element as HTMLSpanElement;
            const data: OutputData = JSON.parse(
              span.dataset.editorjsInline ?? ''
            );
            const newSpan = EditorJSInline.createSpan({ data });

            span.parentNode?.insertBefore(newSpan, span);
            span.remove();
          });

        mutationObserver.disconnect();
      });

      mutationObserver.observe(codexEditor, { childList: true });
    });

    return button;
  }
}

export default EditorJSInline;
