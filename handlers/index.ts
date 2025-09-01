//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import type { Handler } from 'types'

import { handler as blockEnd } from './blocks/end'
import { handler as elseBlock } from './blocks/else'
import { handler as eachBlock } from './blocks/each'
import { handler as includeBlock } from './blocks/include'
import { handler as renderBlock } from './blocks/render'
import { handler as withBlock } from './blocks/with'
import { handler as whenBlock } from './blocks/when'
import { handler as variable } from './variables'

// ---

export const getHandlers = (): Array<Handler> =>
{
  return [
    blockEnd,
    elseBlock,
    eachBlock,
    includeBlock,
    renderBlock,
    withBlock,
    whenBlock,
    variable
  ];
}