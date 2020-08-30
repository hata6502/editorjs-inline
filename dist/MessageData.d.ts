import type { OutputData } from '@editorjs/editorjs';
interface EditorJSInlineMessageData {
    editorJSInline: true;
    id: string;
}
export interface HeightChangedMessageData extends EditorJSInlineMessageData {
    type: 'heightChanged';
}
export interface SavedMessageData extends EditorJSInlineMessageData {
    type: 'saved';
    outputData: OutputData;
}
declare type MessageData = HeightChangedMessageData | SavedMessageData | object | undefined;
export default MessageData;
