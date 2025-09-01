//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import type { Renderer } from 'types'
import type { Stage } from 'composable-pipeline/types'

//
// Creates a render function from a string.
//
export const outputToFunction: Stage<string, Renderer> = async (body) =>
{
  console.debug(body);

  return new Function('context', body) as Renderer;
}