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
        const lefts: number[] = [];
        const tops: number[] = [];

        document.body.querySelectorAll('*').forEach((element) => {
          const rect = element.getBoundingClientRect();

          lefts.push(rect.left);
          tops.push(rect.top);
        });

        const minLeft = Math.min(0, ...lefts);

        document.body.style.marginLeft = `${-minLeft}px`;
        document.body.style.marginTop = `${-Math.min(0, ...tops)}px`;

        if (minLeft >= 0) {
          document.body.style.marginLeft = `${
            document.body.offsetWidth - document.body.scrollWidth
          }px`;
        }

        const mutatedMessageData: MutatedMessageData = {
          editorJSInline: true,
          id,
          type: 'mutated',
          scrollHeight: document.body.scrollHeight,
        };

        window.parent.postMessage(mutatedMessageData, '*');
      })
    );

    mutationObserver.observe(holder, {
      attributes: true,
      characterData: true,
      childList: true,
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
