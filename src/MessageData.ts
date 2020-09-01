import type { OutputData } from '@editorjs/editorjs';

interface EditorJSInlineMessageData {
  editorJSInline: true;
  id: string;
}

export interface MutatedMessageData extends EditorJSInlineMessageData {
  type: 'mutated';
}

export interface SavedMessageData extends EditorJSInlineMessageData {
  type: 'saved';
  outputData: OutputData;
}

type MessageData = MutatedMessageData | SavedMessageData | object | undefined;

export default MessageData;
