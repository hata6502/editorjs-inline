import type {
  API,
  EditorConfig,
  InlineTool,
  InlineToolConstructorOptions,
  OutputData,
} from '@editorjs/editorjs';
import EditorJSInlineElement from './EditorJSInlineElement';
import EditorJSInlineError from './EditorJSInlineError';
import type EditorJSInlineWindow from './EditorJSInlineWindow';
import type {
  MessageData,
  MutatedMessageData,
  SavedMessageData,
} from 'editorjs-element';

declare const window: EditorJSInlineWindow;

interface EditorJSInlineConfig {
  editorConfig: Omit<EditorConfig, 'data' | 'holder'>;

  /**
   * The URL of editorjs-element output
   * https://github.com/hata6502/editorjs-element/blob/main/dist/index.html
   */
  src?: string;

  /**
   * The inline HTML of editorjs-element output
   * https://github.com/hata6502/editorjs-element/blob/main/dist/index.html
   */
  srcdoc?: string;
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
      'editorjs-inline': (editorjsInline: EditorJSInlineElement) => {
        const outputData: OutputData | undefined =
          editorjsInline.dataset.output &&
          JSON.parse(editorjsInline.dataset.output);

        return !outputData || outputData.blocks.length === 0
          ? false
          : {
              'data-output': true,
            };
      },
    };
  }

  static get title() {
    return 'EditorJS';
  }

  #api: API;

  constructor({ api, config }: EditorJSInlineConstructorOptions) {
    this.#api = api;

    if (!('editorConfig' in config)) {
      return;
    }

    window.editorJSInlineConfig = config;

    if (customElements.get('editorjs-inline')) {
      return;
    }

    customElements.define('editorjs-inline', EditorJSInlineElement);
  }

  get shortcut() {
    return 'CMD+E';
  }

  checkState() {
    return false;
  }

  render() {
    const button = document.createElement('button');

    button.classList.add(this.#api.styles.inlineToolButton);
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
        throw new EditorJSInlineError();
      }

      document.addEventListener('pointerdown', () => {
        codexEditor
          .querySelectorAll('editorjs-inline')
          .forEach((element) =>
            (element as EditorJSInlineElement).closeToolbars()
          );
      });

      window.addEventListener(
        'message',
        (event) => {
          const messageData: MessageData = event.data;

          if (
            typeof messageData !== 'object' ||
            !('editorJSElement' in messageData)
          ) {
            return;
          }

          const editorJSInline = codexEditor.querySelector(
            `editorjs-inline[data-id="${messageData.id}"]`
          ) as EditorJSInlineElement | null;

          const action = {
            mutated: () => {
              if (!editorJSInline) {
                return;
              }

              const { scrollHeight } = messageData as MutatedMessageData;

              editorJSInline.setHeight({ height: `${scrollHeight}px` });
            },
            pointerdown: () => {
              codexEditor
                .querySelectorAll(
                  `editorjs-inline:not([data-id="${messageData.id}"])`
                )
                .forEach((element) =>
                  (element as EditorJSInlineElement).closeToolbars()
                );
            },
            saved: () => {
              if (!editorJSInline) {
                return;
              }

              const { outputData } = messageData as SavedMessageData;

              editorJSInline.dataset.output = JSON.stringify(outputData);
            },
          };

          action.hasOwnProperty(messageData.type) && action[messageData.type]();
        },
        false
      );
    });

    return button;
  }

  surround(range: Range) {
    const editorJSInline = new EditorJSInlineElement();
    const text: string = range.extractContents().textContent ?? '';

    editorJSInline.dataset.output = JSON.stringify({
      blocks: [
        {
          type: 'paragraph',
          data: {
            text,
          },
        },
      ],
    });

    range.insertNode(editorJSInline);
  }
}

export default EditorJSInline;
export type { EditorJSInlineConfig };
