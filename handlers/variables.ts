//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import { formatString } from 'format-string'
import type { TransformationHandler } from 'types'

// ---

export const getVariablePaths = (path: string) =>
{
  const safePath = path.replace(/\./g, '?.');
  const topLevelVariable = path.split('.')[0];

  return { safePath, topLevelVariable };
}

// ---

export const variableHandler: TransformationHandler =
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
          const { safePath, topLevelVariable } = getVariablePaths(variable);

          const output = formatString(
            "typeof %1 !== 'undefined' ? %2 : data.%2 ?? 'undefined'",
            [topLevelVariable, safePath]
          );

          return `output.push(${sanitize ? `sanitize(${output})` : output});`;
        }
      )
    ];
  }
}