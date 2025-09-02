//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import type { TransformationHandler } from 'types'
import { formatString } from 'format-string'
import { getVariablePaths } from 'handlers/variables'

// ---

export const whenBlockHandler: TransformationHandler =
{
  test: ({ type, content }) =>
  {
    return type === 'block' && content.startsWith('#when ');
  },

  transform: async (index, { content }) =>
  {
    return [
      index,

      content.replace(
        /^#when(?:\s+(not))?\s+\$(\w+(?:\.\w+)*):$/,

        (_, modifier: string, variable: string) =>
        {
          const { safePath, topLevelVariable } = getVariablePaths(variable);

          const value = formatString(
            "(typeof %1 !== 'undefined' ? %2 : data.%2)", [topLevelVariable, safePath]
          );

          return formatString(
            "if (typeof %1 !== 'boolean') {\nthrow new Error(`'%2' is not a boolean value (line %4)`);\n}\nif (%1 === %3) {",
            [value, variable, (modifier === 'not' ? 'false' : 'true'), String(index + 1)]
          );
        }
      )
    ];
  }
}