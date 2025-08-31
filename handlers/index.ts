//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import type { Handler } from 'types'
import { handler as variables } from './variables'

// ---

export const getHandlers = (): Array<Handler> =>
{
  return [variables];
}