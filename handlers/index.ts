//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import type { TransformationHandler } from 'types'

import { blockEndHandler } from './blocks/end'
import { elseBlockHandler } from './blocks/else'
import { eachBlockHandler } from './blocks/each'
import { withBlockHandler } from './blocks/with'
import { whenBlockHandler } from './blocks/when'
import { variableHandler } from './variables'

// ---

export const getDefaultHandlers = (): Array<TransformationHandler> =>
{
  return [
    blockEndHandler, elseBlockHandler, eachBlockHandler,
    withBlockHandler, whenBlockHandler, variableHandler
  ];
}