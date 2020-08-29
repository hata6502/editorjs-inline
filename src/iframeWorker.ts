import EditorJS from '@editorjs/editorjs';
// @ts-expect-error
import List from '@editorjs/list';
import type IframeWindow from './IframeWindow';
import type { SavedMessageData, SavingMessageData } from './MessageData';

declare const window: IframeWindow;

const editorJS = new EditorJS({
  holder: document.body,
  minHeight: 0,
  tools: {
    list: List,
  },
  onChange: async () => {
    const savingMessageData: SavingMessageData = {
      editorJSInline: true,
      id: window.id,
      type: 'saving',
    };

    window.parent.postMessage(savingMessageData, '*');

    const outputData = await editorJS.save();
    const savedMessageData: SavedMessageData = {
      editorJSInline: true,
      id: window.id,
      type: 'saved',
      outputData,
    };

    window.parent.postMessage(savedMessageData, '*');
  },
});
