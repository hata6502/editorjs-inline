import type { InlineTool, InlineToolConstructorOptions } from '@editorjs/editorjs';
export interface EditorJSInlineConfig {
}
interface EditorJSInlineConstructorOptions extends InlineToolConstructorOptions {
    config: EditorJSInlineConfig | object;
}
declare class EditorJSInline implements InlineTool {
    static get isInline(): boolean;
    static get sanitize(): {
        span: {
            'data-editorjs-inline': boolean;
        };
    };
    static get title(): string;
    private static createSpan;
    private api;
    constructor({ api, config }: EditorJSInlineConstructorOptions);
    get shortcut(): string;
    surround(range: Range): void;
    checkState(): boolean;
    render(): HTMLButtonElement;
}
export default EditorJSInline;
