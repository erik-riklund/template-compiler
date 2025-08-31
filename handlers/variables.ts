//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import type { Handler } from 'types'
import { formatString } from 'format-string'

// ---

export const handler: Handler =
{
  test: (chunk) => chunk.type === 'variable',

  transform: async (index, { content }) =>
  {
    return [
      index,

      content.replace(
        /^\{\$(\w+(?:\.\w+)*)(!?)}$/,

        (_, variable: string, encoded: string) =>
        {
          const sanitize = encoded !== '!';
          const safeVariable = variable.replace(/\./g, '?.');
          const topLevelVariable = variable.split('.')[0];

          const output = formatString(
            "typeof %1 !== 'undefined' ? %2 : data.%2 ?? 'undefined'",
            [topLevelVariable, safeVariable]
          );

          return `output.push(${sanitize ? `sanitize(${output})` : output});`;
        }
      )
    ];
  }
}