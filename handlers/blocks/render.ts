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
    return type === 'block' && content.startsWith('#render ');
  },


  transform: async (index, { content }) =>
  {
    return [
      index,

      content.replace(
        /^#render:$/,

        (_) =>
        {
          // ...

          return '';
        }
      )
    ]
  }
}