import type { OutputData } from '@editorjs/editorjs';

interface EditorJSInlineMessageData {
  editorJSInline: true;
  id: string;
}

export interface MutatedMessageData extends EditorJSInlineMessageData {
  type: 'mutated';
  scrollHeight: number;
}

export interface PointerdownMessageData extends EditorJSInlineMessageData {
  type: 'pointerdown';
}

export interface SavedMessageData extends EditorJSInlineMessageData {
  type: 'saved';
  outputData: OutputData;
}

type MessageData =
  | MutatedMessageData
  | PointerdownMessageData
  | SavedMessageData
  | object
  | undefined;

export default MessageData;
