class EditorJSInlineError extends Error {
  constructor(...args: any[]) {
    super(...args);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, EditorJSInlineError);
    }

    this.name = 'EditorJSInlineError';
  }
}

export default EditorJSInlineError;
