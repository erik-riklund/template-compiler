//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import type { Handler } from 'types'

// ---

export const handler: Handler =
{
  test: (chunk) =>
  {
    return chunk.type === 'block' && chunk.content === 'else:';
  },


  transform: async (index) => [index, '} else {']
}