import debounce from 'debounce';
import EditorJS from '@editorjs/editorjs';
import type IframeWindow from './IframeWindow';
import type { MutatedMessageData, SavedMessageData } from './MessageData';

declare const window: IframeWindow;

window.editorJSInline = {
  load: ({ id, editorConfig }) => {
    const editorJS = new EditorJS({
      ...editorConfig,
      holder: document.body,
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
        };

        window.parent.postMessage(mutatedMessageData, '*');
      })
    );

    mutationObserver.observe(document, {
      childList: true,
      attributes: true,
      characterData: true,
      subtree: true,
    });
  },
};
