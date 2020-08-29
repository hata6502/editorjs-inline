import type { OutputData } from '@editorjs/editorjs';
interface EditorJSInlineMessageData {
    editorJSInline: true;
    id: string;
}
export interface SavedMessageData extends EditorJSInlineMessageData {
    type: 'saved';
    outputData: OutputData;
}
export interface SavingMessageData extends EditorJSInlineMessageData {
    type: 'saving';
}
declare type MessageData = SavedMessageData | SavingMessageData | object | undefined;
export default MessageData;
