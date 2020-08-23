var EditorJSInline = /** @class */ (function () {
    function EditorJSInline() {
    }
    EditorJSInline.prototype.surround = function () { };
    EditorJSInline.prototype.checkState = function () {
        return false;
    };
    EditorJSInline.prototype.render = function () {
        var button = document.createElement('button');
        button.type = 'button';
        button.innerHTML = 'TEST';
        return button;
    };
    return EditorJSInline;
}());
export default EditorJSInline;
//# sourceMappingURL=index.js.map