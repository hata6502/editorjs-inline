import type EditorJS from '@editorjs/editorjs';
import type {
  InlineTool,
  InlineToolConstructorOptions,
} from '@editorjs/editorjs';

export interface EditorJSInlineConfig {
  EditorJS: typeof EditorJS;
}

interface EditorJSInlineConstructorOptions
  extends InlineToolConstructorOptions {
  config: EditorJSInlineConfig | object;
}

class EditorJSInline implements InlineTool {
  static get isInline() {
    return true;
  }

  /*static get sanitize() {
    return {
    };
  }*/

  static get title() {
    return 'EditorJS';
  }

  private EditorJS!: typeof EditorJS;

  constructor({ api, config }: EditorJSInlineConstructorOptions) {
    if (!('EditorJS' in config)) {
      return;
    }

    this.EditorJS = config.EditorJS;
  }

  /*get shortcut() {
    return 'CMD+M';
  }*/

  surround(range: Range) {
    const holder = document.createElement('span');

    range.insertNode(holder);

    new this.EditorJS({
      holder,
    });
  }

  checkState() {
    return false;
  }

  render() {
    const button = document.createElement('button');

    button.type = 'button';
    button.innerHTML = 'TEST';

    return button;
  }
}

export default EditorJSInline;
