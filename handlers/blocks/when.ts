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
            "if (%1 === %2) {", [value, (modifier === 'not' ? 'false' : 'true')]
          );
        }
      )
    ];
  }
}