import type EditorJS from '@editorjs/editorjs';
import type { OutputData } from '@editorjs/editorjs';
import { v4 as uuidv4 } from 'uuid';
import { EditorJSInlineError } from '../EditorJSInlineError';
import type { EditorJSInlineWindow } from '../window';
import { createDialog } from './createDialog';

declare const window: EditorJSInlineWindow;

class EditorJSInlineElement extends HTMLElement {
  #editorJS?: EditorJS;
  #editorJSHolder?: HTMLDivElement;

  constructor() {
    super();

    this.contentEditable = 'false';
    this.style.cursor = 'pointer';

    this.addEventListener('click', this.#handleClick);
  }

  connectedCallback() {
    // To paste editorjs-inline correctly.
    this.innerHTML = '';

    const editorJSHolderID = uuidv4();

    this.#editorJSHolder = document.createElement('div');
    this.#editorJSHolder.id = editorJSHolderID;

    this.append(this.#editorJSHolder);

    const config = window.editorJSInline.tool.config;
    const editorJSDataJSONString = this.dataset.editorjs;

    if (!editorJSDataJSONString) {
      throw new EditorJSInlineError();
    }

    this.#editorJS = new config.EditorJS({
      ...config.editorJSConfig,
      holder: editorJSHolderID,
      data: JSON.parse(editorJSDataJSONString),
      minHeight: 0,
      readOnly: true,
    });
  }

  disconnectedCallback() {
    this.#editorJS?.destroy();
    this.#editorJSHolder?.remove();
  }

  #handleClick = () => {
    const editorJSDataJSONString = this.dataset.editorjs;

    if (!editorJSDataJSONString) {
      throw new EditorJSInlineError();
    }

    const dialog = createDialog({
      editorJSData: JSON.parse(editorJSDataJSONString),
      onClose: async ({ editorJSData }) => {
        const filteredEditorJSData: OutputData = {
          blocks: editorJSData.blocks,
        };

        this.dataset.editorjs = JSON.stringify(filteredEditorJSData);

        await this.#editorJS?.render(filteredEditorJSData);
      },
    });

    document.body.append(dialog);
    // @ts-expect-error
    dialog.showModal();
  };
}

export { EditorJSInlineElement };
