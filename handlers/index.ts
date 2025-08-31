//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import type { Handler } from 'types'

import { handler as eachBlock } from './blocks/each'
import { handler as withBlock } from './blocks/with'
import { handler as whenBlock } from './blocks/when'
import { handler as blockEnd } from './block-end'
import { handler as variable } from './variables'

// ---

export const getHandlers = (): Array<Handler> =>
{
  return [eachBlock, withBlock, whenBlock, blockEnd, variable];
}