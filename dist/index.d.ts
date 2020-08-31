import type { EditorConfig, InlineTool, InlineToolConstructorOptions } from '@editorjs/editorjs';
export interface EditorJSInlineConfig {
    editorConfig: Omit<EditorConfig, 'data' | 'holder'>;
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
    private api;
    private config;
    constructor({ api, config }: EditorJSInlineConstructorOptions);
    get shortcut(): string;
    surround(range: Range): void;
    checkState(): boolean;
    render(): HTMLButtonElement;
    private createSpan;
}
export default EditorJSInline;
