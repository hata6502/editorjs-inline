import type {
  API,
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

  private static createSpan({ data = { blocks: [] } }: { data?: OutputData }) {
    const id = uuidv4();
    const span = document.createElement('span');

    span.contentEditable = 'false';
    span.dataset.editorjsInline = JSON.stringify(data);
    span.dataset.editorjsInlineId = id;

    const iframe = document.createElement('iframe');

    iframe.scrolling = 'no';
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

  private api: API;

  constructor({ api, config }: EditorJSInlineConstructorOptions) {
    this.api = api;

    window.addEventListener(
      'message',
      (event) => {
        const messageData: MessageData = event.data;

        if (
          typeof messageData !== 'object' ||
          !('editorJSInline' in messageData)
        ) {
          return;
        }

        const element = document.querySelector(
          `span[data-editorjs-inline-id="${messageData.id}"]`
        );
        const iframe = element?.querySelector('iframe');

        if (!element || !iframe) {
          throw new Error('editorjs-inline element is not found. ');
        }

        const span = element as HTMLSpanElement;

        ({
          heightChanged: () => {
            iframe.style.height = `${iframe.contentDocument?.body.scrollHeight}px`;
          },
          saved: () => {
            const { outputData } = messageData as SavedMessageData;

            span.dataset.editorjsInline = JSON.stringify(outputData);
          },
        }[messageData.type]());
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

    button.classList.add(this.api.styles.inlineToolButton);
    button.type = 'button';
    button.innerHTML = `
      <svg class="icon" viewBox="0 0 14 14">
        <g stroke="currentColor" stroke-width="2">
          <circle cx="7" cy="7" r="6" fill="none" />
          <line x1="4" y1="7" x2="10" y2="7" />
          <line x1="7" y1="4" x2="7" y2="10" />
        </g>
      </svg>
    `;

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
