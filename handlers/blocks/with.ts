//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import type { Handler } from 'types'
import { formatString } from 'format-string'
import { getVariablePaths } from 'handlers/variables'

// ---

export const handler: Handler =
{
  test: ({ type, content }) =>
  {
    return type === 'block' && (
      content.startsWith('#with ') || content.startsWith('#without ')
    );
  },

  transform: async (index, { content }) =>
  {
    return [
      index,

      content.replace(
        /^#(with(?:out)?)\s+\$(\w+(?:\.\w+)*):$/,

        (_, block: string, variable: string) =>
        {
          const { safePath, topLevelVariable } = getVariablePaths(variable);

          const value = formatString(
            "typeof %1 !== 'undefined' ? %2 : data.%2", [topLevelVariable, safePath]
          );

          return formatString(
            "if (!Array.isArray(%1)) {\nthrow new Error(`'%4' is not an array (line %5)`);\n}\nif ((%1).length %2 0) {",
            [value, (block === 'with' ? '>' : '==='), safePath, variable, String(index + 1)]
          );
        }
      )
    ];
  }
}