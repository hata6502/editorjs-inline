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
        span: boolean;
    };
    static get title(): string;
    private api;
    private codexEditor;
    private config;
    constructor({ api, config }: EditorJSInlineConstructorOptions);
    get shortcut(): string;
    checkState(): boolean;
    render(): HTMLButtonElement;
    surround(range: Range): void;
    private createSpan;
}
export default EditorJSInline;
