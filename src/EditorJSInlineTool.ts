import type {
  API,
  InlineTool,
  InlineToolConstructorOptions,
  OutputData,
} from '@editorjs/editorjs';
import { EditorJSInlineElement } from './EditorJSInlineElement';
import type { EditorJSInlineToolConfig, EditorJSInlineWindow } from './window';

declare const window: EditorJSInlineWindow;

class EditorJSInlineTool implements InlineTool {
  static get isInline() {
    return true;
  }

  static get sanitize() {
    return {
      'editorjs-inline': (element: EditorJSInlineElement) => {
        const editorJSDataJSONString = element.dataset.editorjs;

        const editorJSData: OutputData | undefined =
          editorJSDataJSONString && JSON.parse(editorJSDataJSONString);

        return editorJSData && editorJSData.blocks.length !== 0
          ? {
              'data-editorjs': true,
            }
          : false;
      },
    };
  }

  static get title() {
    return 'EditorJS';
  }

  static prepare({ config }: { config: EditorJSInlineToolConfig }) {
    window.editorJSInline = {
      tool: {
        config,
      },
    };

    if (customElements.get('editorjs-inline')) {
      return;
    }

    customElements.define('editorjs-inline', EditorJSInlineElement);
  }

  #api: API;

  constructor({ api }: InlineToolConstructorOptions) {
    this.#api = api;
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

    /*
                  saved: () => {
              if (!editorJSInline) {
                return;
              }

              const { outputData } = messageData as SavedMessageData;

              editorJSInline.dataset.output = JSON.stringify(outputData);
            },
      */

    return button;
  }

  surround(range: Range) {
    const editorJSInlineElement = new EditorJSInlineElement();
    const text = range.extractContents().textContent ?? '';

    const editorJSData: OutputData = {
      blocks: [
        {
          type: 'paragraph',
          data: {
            text,
          },
        },
      ],
    };

    editorJSInlineElement.dataset.editorjs = JSON.stringify(editorJSData);

    range.insertNode(editorJSInlineElement);
  }
}

export { EditorJSInlineTool };
