import type { InlineTool, InlineToolConstructorOptions } from 'editorjs-for-editorjs-inline';
declare class EditorJSInline implements InlineTool {
    static get isInline(): boolean;
    static get sanitize(): {};
    static get title(): string;
    constructor({ api, config }: InlineToolConstructorOptions);
    get shortcut(): string;
    surround(range: Range): void;
    checkState(): boolean;
    render(): HTMLButtonElement;
}
export default EditorJSInline;
