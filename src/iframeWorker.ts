import EditorJS from '@editorjs/editorjs';
// @ts-expect-error
import List from '@editorjs/list';
import type IframeWindow from './IframeWindow';
import type { SavedMessageData, SavingMessageData } from './MessageData';

declare const window: IframeWindow;

window.editorJSInline = {
  load: ({ id, data }) => {
    const editorJS = new EditorJS({
      data,
      holder: document.body,
      minHeight: 0,
      tools: {
        list: List,
      },
      onChange: async () => {
        const savingMessageData: SavingMessageData = {
          editorJSInline: true,
          id,
          type: 'saving',
        };

        window.parent.postMessage(savingMessageData, '*');

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
  },
};
