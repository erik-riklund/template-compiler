//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import type { TransformationHandler } from 'types'

// ---

export const blockEndHandler: TransformationHandler =
{
  test: (chunk) =>
  {
    return chunk.type === 'block' && chunk.content === 'end';
  },


  transform: async (index) => [index, '}']
}