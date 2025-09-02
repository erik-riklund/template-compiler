//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import type { TransformationHandler } from 'types'
import { formatString } from 'format-string'
import { getVariablePaths } from 'handlers/variables'

// ---

export const eachBlockHandler: TransformationHandler =
{
  test: ({ type, content }) =>
  {
    return type === 'block' && content.startsWith('#each ');
  },

  transform: async (index, { content }) =>
  {
    return [
      index,

      content.replace(
        /^#each\s+(\w+(?:\s*,\s*\w+)*)\s+in\s+\$(\w+(?:\.\w+)*):$/,

        (_, variable: string, source: string) =>
        {
          const { safePath, topLevelVariable } = getVariablePaths(source);

          const value = formatString(
            "typeof %1 !== 'undefined' ? %2 : data.%2", [topLevelVariable, safePath]
          );

          return formatString(
            "if (!Array.isArray(%2)) {\nthrow new Error(`'%3' is not an array (line %4)`);\n}\nfor (const %1 of (%2)) {",
            [(variable.includes(',') ? `{ ${variable} }` : variable), value, source, String(index + 1)]
          );
        }
      )
    ];
  }
}