//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import type { TransformationHandler } from 'types'

// ---

export const elseBlockHandler: TransformationHandler =
{
  test: (chunk) =>
  {
    return chunk.type === 'block' && chunk.content === 'else:';
  },


  transform: async (index) => [index, '} else {']
}