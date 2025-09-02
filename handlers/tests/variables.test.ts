//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import { it, expect } from 'bun:test'
import { variableHandler } from 'handlers/variables'
import type { Chunk } from 'types'

// ---

it('should transform a top-level variable',

  async () =>
  {
    const chunk: Chunk = { type: 'variable', content: '{$name}' };
    const result = await variableHandler.transform(0, chunk);

    expect(result).toEqual([
      0, `output.push(sanitize(typeof name !== 'undefined' ? name : data.name ?? 'undefined'));`
    ]);
  }
);

// ---

it('should transform a nested variable',

  async () =>
  {
    const chunk: Chunk = { type: 'variable', content: '{$user.name}' };
    const result = await variableHandler.transform(0, chunk);

    expect(result).toEqual([
      0, `output.push(sanitize(typeof user !== 'undefined' ? user?.name : data.user?.name ?? 'undefined'));`
    ]);
  }
);

// ---

it('should transform a variable with a modifier',

  async () =>
  {
    const chunk: Chunk = { type: 'variable', content: '{$user.name!}' };
    const result = await variableHandler.transform(0, chunk);

    expect(result).toEqual([
      0, `output.push(typeof user !== 'undefined' ? user?.name : data.user?.name ?? 'undefined');`
    ]);
  }
);