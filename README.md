<!-- markdownlint-disable first-line-h1 -->
<h1 align="center">Welcome to editorjs-inline 👋</h1>
<p>
  <a href="https://www.npmjs.com/package/editorjs-inline" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/editorjs-inline.svg">
  </a>
  <a href="https://github.com/hata6502/editorjs-inline/blob/master/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
  <a href="https://twitter.com/hata6502" target="_blank">
    <img alt="Twitter: hata6502" src="https://img.shields.io/twitter/follow/hata6502.svg?style=social" />
  </a>
</p>

> Inline-Editor.js Tool for Editor.js

## 💡 Motivation

Editor.js inline tools are need to control DOM directly,
so they may be able to provide only simple functions.
By launching another Editor.js instance as inline element,
existing block tools can be reused as inline tool.

I recommend to use it with [editorjs-style](https://github.com/hata6502/editorjs-style).

### ✨ [Demo](https://hata6502.github.io/editorjs-inline/)

![demo](https://user-images.githubusercontent.com/7702653/105579110-cc284b80-5dc7-11eb-939f-d8864b129ed8.gif)

## Install

### Install via yarn

```sh
yarn add editorjs-inline
```

### Load from CDN

```html
<script src="https://cdn.jsdelivr.net/npm/editorjs-inline@latest"></script>
```

## Usage

Please see [Demo HTML](https://github.com/hata6502/editorjs-inline/blob/master/docs/index.html).

## Config params

Please see [EditorJSInlineToolConfig](https://github.com/hata6502/editorjs-inline/blob/master/src/window.ts).

## Output data

Please see [Demo](https://hata6502.github.io/editorjs-inline/).

## &lt;dialog&gt; polyfill

editorjs-layout uses `<dialog>` element.
[GoogleChrome/dialog-polyfill](https://github.com/GoogleChrome/dialog-polyfill) can be used to improve the browser compatibility.

## Build

```sh
yarn webpack
```

## Format

```sh
yarn fix
```

## Run tests

```sh
yarn test
```

## Author

<img alt="hata6502" src="https://avatars.githubusercontent.com/hata6502" width="48" /> **Tomoyuki Hata <hato6502@gmail.com>**

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/hata6502/editorjs-inline/issues).

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2020 [Tomoyuki Hata](https://github.com/hata6502).<br />
This project is [MIT](https://github.com/hata6502/editorjs-inline/blob/master/LICENSE) licensed.

## Disclaimer

Please see [DISCLAIMER.md](https://github.com/hata6502/editorjs-inline/blob/master/DISCLAIMER.md).

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
