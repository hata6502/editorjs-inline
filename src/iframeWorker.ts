import EditorJS from '@editorjs/editorjs';
// @ts-expect-error
import List from '@editorjs/list';
import type IframeWindow from './IframeWindow';
import type { HeightChangedMessageData, SavedMessageData } from './MessageData';

declare const window: IframeWindow;

window.editorJSInline = {
  load: ({ id, data }) => {
    const heightChangedMessageData: HeightChangedMessageData = {
      editorJSInline: true,
      id,
      type: 'heightChanged',
    };

    const editorJS = new EditorJS({
      data,
      holder: document.body,
      minHeight: 0,
      tools: {
        list: List,
      },
      onChange: async () => {
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
        window.parent.postMessage(heightChangedMessageData, '*');
      },
    });
  },
};
