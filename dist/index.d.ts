import type { InlineTool } from '@editorjs/editorjs';
declare class EditorJSInline implements InlineTool {
    surround(): void;
    checkState(): boolean;
    render(): HTMLButtonElement;
}
export default EditorJSInline;
