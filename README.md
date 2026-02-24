# @webhandle/tripartite-renderer

Adds tripartite rendering support to webhandle. It addes a rendering engine
if express is set up and modifies the response to render with tripartite templates
(if they exist) directly to the response instead of having to buffer the output.


## Install

```bash
npm install @webhandle/tripartite-renderer
```

## Usage

Run after express has been configured.

```js
import setupTripartiteRenderer from '@webhandle/tripartite-renderer/setup-tripartite-renderer.mjs'
setupTripartiteRenderer(webhandleInstance)
```


Also provides the tripartite library.

```js
import {tripartite} from "tripartite"
```