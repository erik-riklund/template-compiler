//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import type { Chunk, Renderer } from 'types'
import { it, expect } from 'bun:test'
import { handler } from 'handlers/blocks/include'

// ---

const dummy: Renderer = () =>
{
  return '';
}

// ---

it('should render an `include` block',

  async () =>
  {
    // ...
  }
);