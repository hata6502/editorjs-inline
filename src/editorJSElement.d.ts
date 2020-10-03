import type { EditorConfig, OutputData } from '@editorjs/editorjs';
interface EditorJSElementWindow extends Window {
  editorJSElement: {
    closeToolbars: () => void;
    load: (arg: {
      id: string;
      editorConfig: Omit<EditorConfig, 'holder'>;
    }) => void;
  };
}
interface EditorJSElementMessageData {
  editorJSElement: true;
  id: string;
}
interface MutatedMessageData extends EditorJSElementMessageData {
  type: 'mutated';
  scrollHeight: number;
}
interface PointerdownMessageData extends EditorJSElementMessageData {
  type: 'pointerdown';
}
interface SavedMessageData extends EditorJSElementMessageData {
  type: 'saved';
  outputData: OutputData;
}
declare type MessageData =
  | MutatedMessageData
  | PointerdownMessageData
  | SavedMessageData
  | object
  | undefined;
export type {
  EditorJSElementWindow,
  MessageData,
  MutatedMessageData,
  PointerdownMessageData,
  SavedMessageData,
};
