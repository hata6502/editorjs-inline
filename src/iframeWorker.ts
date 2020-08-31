import EditorJS from '@editorjs/editorjs';
import type IframeWindow from './IframeWindow';
import type { HeightChangedMessageData, SavedMessageData } from './MessageData';

declare const window: IframeWindow;

window.editorJSInline = {
  load: ({ id, editorConfig }) => {
    const heightChangedMessageData: HeightChangedMessageData = {
      editorJSInline: true,
      id,
      type: 'heightChanged',
    };

    const editorJS = new EditorJS({
      ...editorConfig,
      holder: document.body,
      onChange: async (api) => {
        editorConfig.onChange?.(api);
        window.parent.postMessage(heightChangedMessageData, '*');

        const outputData = await editorJS.save();
        const savedMessageData: SavedMessageData = {
          editorJSInline: true,
          id,
          type: 'saved',
          outputData,
        };

        window.parent.postMessage(savedMessageData, '*');
      },
      onReady: () => {
        editorConfig.onReady?.();
        window.parent.postMessage(heightChangedMessageData, '*');
      },
    });
  },
};
