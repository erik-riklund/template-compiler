### Type annotations - version 0.1.0

```js
/**
 * @typedef {import('./types').CompilePipelineInput} CompilePipelineInput
 * @typedef {import('./types').RenderingFunction} RenderingFunction
 * @typedef {import('./types').StringifiedRenderingFunction} StringifiedRenderingFunction
 */
```

---

`getDefaultHandlers`

```js
/**
 * Returns an array containing the default transformation handlers.  
 * These are applied automatically by the compiler if no custom handlers are provided.
 * 
 * @returns {Array<import('./types').TransformationHandler>}
 */
```

---

`compileTemplate`

```js
/**
 * The entrypoint to the template compilation pipeline.
 */
var compileTemplate = {
  /**
   * Compiles a template to a stringified render function.
   * 
   * @type {(input: CompilePipelineInput)=>Promise<StringifiedRenderingFunction>}
   */
  toString: createPipeline([parse, transform, assemble, outputToString]),

  /**
   * Compiles a template to an executable render function.
   * 
   * @type {(input: CompilePipelineInput)=>Promise<RenderingFunction>}
   */
  toFunction: createPipeline([parse, transform, assemble, outputToFunction])
};
```