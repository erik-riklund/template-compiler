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

          return formatString(
            "for (const %1 of (typeof %2 !== 'undefined' ? %3 : data.%3)) {",
            [variable.includes(',') ? `{ ${variable} }` : variable, topLevelVariable, safePath]
          );
        }
      )
    ];
  }
}