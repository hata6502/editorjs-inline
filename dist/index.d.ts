import type EditorJS from '@editorjs/editorjs';
import type { InlineTool, InlineToolConstructorOptions } from '@editorjs/editorjs';
export interface EditorJSInlineConfig {
    EditorJS: typeof EditorJS;
}
interface EditorJSInlineConstructorOptions extends InlineToolConstructorOptions {
    config: EditorJSInlineConfig | object;
}
declare class EditorJSInline implements InlineTool {
    static get isInline(): boolean;
    static get title(): string;
    private EditorJS;
    constructor({ api, config }: EditorJSInlineConstructorOptions);
    surround(range: Range): void;
    checkState(): boolean;
    render(): HTMLButtonElement;
}
export default EditorJSInline;
