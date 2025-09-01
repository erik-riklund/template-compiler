//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import type { Handler } from 'types'
import { formatString } from 'format-string'

// ---

export const handler: Handler =
{
  test: ({ type, content }) =>
  {
    return type === 'block' && content.startsWith('#include ');
  },


  transform: async (index, { content }) =>
  {
    return [
      index,

      content.replace(
        /^#include\s+(\w+);$/,

        (_, identifier: string) =>
        {
          return formatString(
            "output.push(include_%1({ data, sanitize }));", [identifier]
          );
        }
      )
    ]
  }
}