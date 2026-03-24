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


Also provides the tripartite library to the page.

```js
import {tripartite} from "tripartite"
```

Tripartite templates need to be made available to the page (the client) before they can be used.
These can be included by webpack or loaded manually, but they can also be made available by including
them on the page like:

```html
__'@webhandle/component/whatever-my-name-is'::renderTemplateSource__
```

This will find and include on the page the template `@webhandle/component/whatever-my-name-is`, found
in exactly the same way as if it were to rendered on the server at this point. It can then be used
by the on-page tripartite instance without any further steps.

By default, this is going to URI encrypt the template. That provides protection against the template
containing unclosed tags or characters which would otherwise cause the html parse to have problems.

This template is safe to call multiple time with the same template name; the template will only be 
written to the page once. (So feel free to include the templates of dependencies if you want.)