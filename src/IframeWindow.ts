import type { OutputData } from '@editorjs/editorjs';

interface IframeWindow extends Window {
  editorJSInline: {
    load: (arg: { id: string; data: OutputData }) => void;
  };
}

export default IframeWindow;
