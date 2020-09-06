import type {
  API,
  EditorConfig,
  InlineTool,
  InlineToolConstructorOptions,
  OutputData,
} from '@editorjs/editorjs';
import { v4 as uuidv4 } from 'uuid';
import type IframeWindow from './IframeWindow';
import type MessageData from './MessageData';
import type { MutatedMessageData, SavedMessageData } from './MessageData';
// @ts-ignore
import iframeWorker from '../dist/iframeWorker.js';

export interface EditorJSInlineConfig {
  editorConfig: Omit<EditorConfig, 'data' | 'holder'>;
}

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
      span: true,
    };
  }

  static get title() {
    return 'EditorJS';
  }

  private api: API;
  private config!: EditorJSInlineConfig;

  constructor({ api, config }: EditorJSInlineConstructorOptions) {
    this.api = api;

    if (!('editorConfig' in config)) {
      return;
    }

    this.config = config;
  }

  get shortcut() {
    return 'CMD+E';
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
        throw new Error(
          "Couldn't find the parent Editor.js of editorjs-inline. "
        );
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
            const newSpan = this.createSpan({ data });

            span.parentNode?.insertBefore(newSpan, span);
            span.remove();
          });

        mutationObserver.disconnect();
      });

      mutationObserver.observe(codexEditor, { childList: true });

      document.addEventListener('pointerdown', () => {
        codexEditor
          .querySelectorAll('span[data-editorjs-inline] iframe')
          .forEach((element) => {
            const iframe = element as HTMLIFrameElement;
            const iframeWorkerWindow = iframe.contentWindow as IframeWindow;

            iframeWorkerWindow.editorJSInline.closeToolbars();
          });
      });

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

          const span = codexEditor.querySelector(
            `span[data-editorjs-inline-id="${messageData.id}"]`
          ) as HTMLSpanElement | null;

          const iframe = span?.querySelector('iframe');

          ({
            mutated: () => {
              if (!iframe) {
                return;
              }

              const { scrollHeight } = messageData as MutatedMessageData;

              iframe.style.height = `${scrollHeight}px`;
            },
            pointerdown: () => {
              codexEditor
                .querySelectorAll(
                  `span[data-editorjs-inline]:not([data-editorjs-inline-id="${messageData.id}"]) iframe`
                )
                .forEach((element) => {
                  const iframe = element as HTMLIFrameElement;
                  const iframeWorkerWindow = iframe.contentWindow as IframeWindow;

                  iframeWorkerWindow.editorJSInline.closeToolbars();
                });
            },
            saved: () => {
              if (!span) {
                return;
              }

              const { outputData } = messageData as SavedMessageData;

              span.dataset.editorjsInline = JSON.stringify(outputData);
            },
          }[messageData.type]());
        },
        false
      );
    });

    return button;
  }

  surround(range: Range) {
    const text: string = range.extractContents().textContent ?? '';

    range.insertNode(
      this.createSpan({
        data: {
          blocks: [
            {
              type: 'paragraph',
              data: {
                text,
              },
            },
          ],
        },
      })
    );
  }

  private createSpan({ data }: { data: OutputData }) {
    const id = uuidv4();
    const span = document.createElement('span');

    span.contentEditable = 'false';
    span.dataset.editorjsInline = JSON.stringify(data);
    span.dataset.editorjsInlineId = id;
    span.style.display = 'inline-block';

    span.append(document.createTextNode('\u200b'));

    const iframe = document.createElement('iframe');

    iframe.scrolling = 'no';
    iframe.style.border = 'none';
    iframe.style.width = '100%';

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
          ...this.config.editorConfig,
          data,
        },
      });
    });

    span.append(iframe);

    return span;
  }
}

export default EditorJSInline;
