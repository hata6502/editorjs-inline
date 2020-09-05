import debounce from 'debounce';
import EditorJS from '@editorjs/editorjs';
import type IframeWindow from './IframeWindow';
import type {
  MutatedMessageData,
  PointerdownMessageData,
  SavedMessageData,
} from './MessageData';

declare const window: IframeWindow;

let editorJS: EditorJS;

window.editorJSInline = {
  closeToolbars: () => {
    editorJS.inlineToolbar.close();
    editorJS.toolbar.close();
  },
  load: ({ id, editorConfig }) => {
    const holder = document.createElement('div');

    document.body.appendChild(holder);

    editorJS = new EditorJS({
      ...editorConfig,
      holder,
      onChange: async (api) => {
        editorConfig.onChange?.(api);

        const outputData = await editorJS.save();
        const savedMessageData: SavedMessageData = {
          editorJSInline: true,
          id,
          type: 'saved',
          outputData,
        };

        window.parent.postMessage(savedMessageData, '*');
      },
    });

    const mutationObserver = new MutationObserver(
      debounce(() => {
        const mutatedMessageData: MutatedMessageData = {
          editorJSInline: true,
          id,
          type: 'mutated',
          scrollHeight: document.body.scrollHeight,
        };

        window.parent.postMessage(mutatedMessageData, '*');

        const marginLeft =
          document.body.scrollWidth - document.body.offsetWidth;

        document.body.style.marginLeft = `${-marginLeft}px`;
      })
    );

    mutationObserver.observe(holder, {
      childList: true,
      attributes: true,
      characterData: true,
      subtree: true,
    });

    document.addEventListener('pointerdown', () => {
      const pointerdownMessageData: PointerdownMessageData = {
        editorJSInline: true,
        id,
        type: 'pointerdown',
      };

      window.parent.postMessage(pointerdownMessageData, '*');
    });
  },
};
