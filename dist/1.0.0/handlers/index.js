// handlers/blocks/end.ts
var handler = {
  test: (chunk) => {
    return chunk.type === "block" && chunk.content === "end";
  },
  transform: async (index) => [index, "}"]
};

// handlers/blocks/else.ts
var handler2 = {
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
var handler3 = {
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
var handler4 = {
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
var handler5 = {
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
var handler6 = {
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
var getHandlers = () => {
  return [
    handler,
    handler2,
    handler4,
    handler5,
    handler6,
    handler3
  ];
};
export {
  getHandlers
};
