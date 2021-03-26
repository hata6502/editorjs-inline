class EditorJSInlineError extends Error {
  constructor(...args: any[]) {
    super(...args);

    this.name = 'EditorJSInlineError';
  }
}

export { EditorJSInlineError };
