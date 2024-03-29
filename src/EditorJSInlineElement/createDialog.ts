import type { OutputData } from '@editorjs/editorjs';
import { v4 as uuidv4 } from 'uuid';
import type { EditorJSInlineWindow } from '../window';

declare const window: EditorJSInlineWindow;

const createDialog = ({
  editorJSData,
  onClose,
}: {
  editorJSData: OutputData;
  onClose?: (event: { editorJSData: OutputData }) => void;
}) => {
  const dialog = document.createElement('dialog');

  dialog.style.maxWidth = '960px';
  // Make be not able to click inner
  dialog.style.padding = '0';
  dialog.style.width = 'calc(100% - 64px)';

  const editorJSHolder = document.createElement('div');
  const editorJSHolderID = uuidv4();

  editorJSHolder.id = editorJSHolderID;

  dialog.append(editorJSHolder);

  const config = window.editorJSInline.tool.config;

  const editorJS = new config.EditorJS({
    ...config.editorJSConfig,
    holder: editorJSHolderID,
    data: editorJSData,
  });

  const handleDialogClick = (event: MouseEvent) => {
    if (!(event.target instanceof Node) || !event.target.isEqualNode(dialog)) {
      return;
    }

    // @ts-expect-error
    dialog.close();
  };

  dialog.addEventListener('click', handleDialogClick);

  const handleDialogClose = async () => {
    const editorJSData = await editorJS.save();

    editorJS.destroy();

    dialog.removeEventListener('click', handleDialogClick);
    dialog.removeEventListener('close', handleDialogClose);
    dialog.remove();

    onClose?.({ editorJSData });
  };

  dialog.addEventListener('close', handleDialogClose);

  return dialog;
};

export { createDialog };
