//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import type { Chunk } from 'types'
import { it, expect } from 'bun:test'
import { handler } from 'handlers/blocks/with'

// ---

it('should transform a `with` block with a variable',

  async () =>
  {
    const chunk: Chunk = { type: 'block', content: '#with $user:' };
    const result = await handler.transform(0, chunk);

    expect(result).toEqual([0,
      "if (Array.isArray(typeof user !== 'undefined' ? user : data.user)\n" +
      " && (typeof user !== 'undefined' ? user : data.user).length > 0) {"
    ]);
  }
);

// ---

it('should transform a `without` block with a variable',

  async () =>
  {
    const chunk: Chunk = { type: 'block', content: '#without $user:' };
    const result = await handler.transform(0, chunk);

    expect(result).toEqual([0,
      "if (Array.isArray(typeof user !== 'undefined' ? user : data.user)\n" +
      " && (typeof user !== 'undefined' ? user : data.user).length === 0) {"
    ]);
  }
);

// ---

it('should transform a `with` block with a nested variable',

  async () =>
  {
    const chunk: Chunk = { type: 'block', content: '#with $user.jobs:' };
    const result = await handler.transform(0, chunk);

    expect(result).toEqual([0,
      "if (Array.isArray(typeof user !== 'undefined' ? user?.jobs : data.user?.jobs)\n" +
      " && (typeof user !== 'undefined' ? user?.jobs : data.user?.jobs).length > 0) {"
    ]);
  }
);

// ---

it('should transform a `without` block with a nested variable',

  async () =>
  {
    const chunk: Chunk = { type: 'block', content: '#without $user.name:' };
    const result = await handler.transform(0, chunk);

    expect(result).toEqual([0,
      "if (Array.isArray(typeof user !== 'undefined' ? user?.name : data.user?.name)\n" +
      " && (typeof user !== 'undefined' ? user?.name : data.user?.name).length === 0) {"
    ]);
  }
);