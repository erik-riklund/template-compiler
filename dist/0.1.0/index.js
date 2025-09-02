//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//
// @version 0.1.0
// @license MIT
//

/**
 * @typedef {import('./types').CompilePipelineInput} CompilePipelineInput
 * @typedef {import('./types').RenderingFunction} RenderingFunction
 * @typedef {import('./types').StringifiedRenderingFunction} StringifiedRenderingFunction
 */

// dependencies/composable-pipeline/index.ts
var createPipeline = (stages) => {
  return async (input) => {
    let result = input;
    for (const stage of stages) {
      result = await stage(result);
    }
    return result;
  };
};

// core/parse.ts
var parse = async ({ template, handlers, rules }) => {
  const chunks = [];
  const lines = template.replace(/`/g, "\\`").split(/\r?\n/);
  const { block, blockEnd, elseBlock, comment, variable, variableEnd } = applyDefaultRules(rules ?? {});
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (comment(trimmedLine)) {
      continue;
    }
    if (block(trimmedLine) || blockEnd(trimmedLine) || elseBlock(trimmedLine)) {
      chunks.push({ type: "block", content: trimmedLine });
      continue;
    }
    parseLine(chunks, line, { variable, variableEnd });
  }
  return { chunks, handlers };
};
var applyDefaultRules = (rules) => {
  const defaultRules = {
    block: (line) => {
      return line.startsWith("#") && (line.endsWith(":") || line.endsWith(";"));
    },
    blockEnd: (line) => line === "end",
    elseBlock: (line) => line === "else:",
    comment: (line) => line.startsWith("//"),
    variable: (_buffer, current, next) => {
      return current === "{" && next === "$";
    },
    variableEnd: (buffer, current) => {
      return buffer.startsWith("{$") && current === "}";
    }
  };
  return { ...defaultRules, ...rules };
};
var parseLine = (chunks, line, { variable, variableEnd }) => {
  let buffer = "";
  for (let i = 0;i < line.length; i++) {
    const current = line[i];
    const next = i < line.length - 1 ? line[i + 1] : null;
    if (variable(buffer, current, next)) {
      chunks.push({ type: "text", content: buffer });
      buffer = "";
    }
    buffer += current;
    if (variableEnd(buffer, current, next)) {
      chunks.push({ type: "variable", content: buffer });
      buffer = "";
    }
    if (i === line.length - 1) {
      chunks.push({ type: "text", content: buffer + "\\n" });
    }
  }
};

// handlers/blocks/end.ts
var blockEndHandler = {
  test: (chunk) => {
    return chunk.type === "block" && chunk.content === "end";
  },
  transform: async (index) => [index, "}"]
};

// handlers/blocks/else.ts
var elseBlockHandler = {
  test: (chunk) => {
    return chunk.type === "block" && chunk.content === "else:";
  },
  transform: async (index) => [index, "} else {"]
};

// dependencies/format-string/index.ts
var formatString = (input, values) => {
  return input.replace(/%(\d+)/g, (_match, index) => values[index - 1] ?? "undefined");
};

// handlers/variables.ts
var getVariablePaths = (path) => {
  const safePath = path.replace(/\./g, "?.");
  const topLevelVariable = path.split(".")[0];
  return { safePath, topLevelVariable };
};
var variableHandler = {
  test: (chunk) => chunk.type === "variable",
  transform: async (index, { content }) => {
    return [
      index,
      content.replace(/^\{\$(\w+(?:\.\w+)*)(!?)}$/, (_, variable, encoded) => {
        const sanitize = encoded !== "!";
        const { safePath, topLevelVariable } = getVariablePaths(variable);
        const output = formatString("typeof %1 !== 'undefined' ? %2 : data.%2 ?? 'undefined'", [topLevelVariable, safePath]);
        return `output.push(${sanitize ? `sanitize(${output})` : output});`;
      })
    ];
  }
};

// handlers/blocks/each.ts
var eachBlockHandler = {
  test: ({ type, content }) => {
    return type === "block" && content.startsWith("#each ");
  },
  transform: async (index, { content }) => {
    return [
      index,
      content.replace(/^#each\s+(\w+(?:\s*,\s*\w+)*)\s+in\s+\$(\w+(?:\.\w+)*):$/, (_, variable, source) => {
        const { safePath, topLevelVariable } = getVariablePaths(source);
        const value = formatString("typeof %1 !== 'undefined' ? %2 : data.%2", [topLevelVariable, safePath]);
        return formatString(`if (!Array.isArray(%2)) {
throw new Error(\`'%3' is not an array (line %4)\`);
}
for (const %1 of (%2)) {`, [variable.includes(",") ? `{ ${variable} }` : variable, value, source, String(index + 1)]);
      })
    ];
  }
};

// handlers/blocks/with.ts
var withBlockHandler = {
  test: ({ type, content }) => {
    return type === "block" && (content.startsWith("#with ") || content.startsWith("#without "));
  },
  transform: async (index, { content }) => {
    return [
      index,
      content.replace(/^#(with(?:out)?)\s+\$(\w+(?:\.\w+)*):$/, (_, block, variable) => {
        const { safePath, topLevelVariable } = getVariablePaths(variable);
        const value = formatString("typeof %1 !== 'undefined' ? %2 : data.%2", [topLevelVariable, safePath]);
        return formatString(`if (!Array.isArray(%1)) {
throw new Error(\`'%4' is not an array (line %5)\`);
}
if ((%1).length %2 0) {`, [value, block === "with" ? ">" : "===", safePath, variable, String(index + 1)]);
      })
    ];
  }
};

// handlers/blocks/when.ts
var whenBlockHandler = {
  test: ({ type, content }) => {
    return type === "block" && content.startsWith("#when ");
  },
  transform: async (index, { content }) => {
    return [
      index,
      content.replace(/^#when(?:\s+(not))?\s+\$(\w+(?:\.\w+)*):$/, (_, modifier, variable) => {
        const { safePath, topLevelVariable } = getVariablePaths(variable);
        const value = formatString("(typeof %1 !== 'undefined' ? %2 : data.%2)", [topLevelVariable, safePath]);
        return formatString(`if (typeof %1 !== 'boolean') {
throw new Error(\`'%2' is not a boolean value (line %4)\`);
}
if (%1 === %3) {`, [value, variable, modifier === "not" ? "false" : "true", String(index + 1)]);
      })
    ];
  }
};

// handlers/index.ts
/**
 * Returns an array containing the default transformation handlers.  
 * These are applied automatically by the compiler if no custom handlers are provided.
 * 
 * @returns {Array<import('./types').TransformationHandler>}
 */
var getDefaultHandlers = () => {
  return [
    blockEndHandler,
    elseBlockHandler,
    eachBlockHandler,
    withBlockHandler,
    whenBlockHandler,
    variableHandler
  ];
};

// core/transform.ts
var transform = async ({ chunks, handlers }) => {
  const result = [];
  const processedChunks = [];
  handlers ??= getDefaultHandlers();
  for (let index = 0;index < chunks.length; index++) {
    const chunk = chunks[index];
    let handler = null;
    if (chunk.type !== "text") {
      handler = handlers.find((h) => h.test(chunk)) ?? null;
    }
    processedChunks.push(handler ? handler.transform(index, chunk) : Promise.resolve([index, "output.push(`" + chunk.content + "`);"]));
  }
  const transformedChunks = await Promise.all(processedChunks);
  for (const [index, content] of transformedChunks) {
    result[index] = content.trim();
  }
  return result;
};

// core/assemble.ts
var template = `const output = [];
const { data, sanitize } =
{
  data: {},
  
  sanitize: (input) => {
    return typeof input !== 'string' ? String(input)
      : input.replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  },
  
  ...context
}

%1

return output.join('').trim();`;
var assemble = async (input) => {
  return formatString(template, [input.join(`
`)]);
};

// core/output/string.ts
var outputToString = async (body) => {
  return `(context) => {
  ${body}
}`;
};

// core/output/function.ts
var outputToFunction = async (body) => {
  return new Function("context", body);
};

// index.ts
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
export {
  getDefaultHandlers,
  compileTemplate
};
