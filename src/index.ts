import type {
  InlineTool,
  InlineToolConstructorOptions,
} from 'editorjs-for-editorjs-inline';
// @ts-ignore
import iframeWorker from '../dist/iframeWorker.js';

class EditorJSInline implements InlineTool {
  static get isInline() {
    return true;
  }

  static get sanitize() {
    return {
      //span: (element: HTMLSpanElement) => !element.classList.contains('editorjs-inline')
    };
  }

  static get title() {
    return 'EditorJS';
  }

  constructor({ api, config }: InlineToolConstructorOptions) {}

  get shortcut() {
    return 'CMD+E';
  }

  surround(range: Range) {
    const span = document.createElement('span');

    //span.classList.add('editorjs-inline');
    span.style.border = '1px solid #eeeeee';
    span.style.display = 'inline-block';

    const iframe = document.createElement('iframe');

    iframe.srcdoc = `
      <!doctype html>
      <html>
        <head></head>
        <body>
          <script>${iframeWorker}</script>
        </body>
      </html>
    `;

    /*iframe.addEventListener('load', () => {
      if (!iframe.contentDocument){
        throw new Error("Couldn't create iframe for editorjs-inline. ");
      }  
    });*/

    span.appendChild(iframe);
    range.insertNode(span);
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
