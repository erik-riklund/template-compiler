//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import type { Chunk } from 'types'
import { it, expect } from 'bun:test'
import { handler } from 'handlers/blocks/include'

// ---

it('should transform an `include` block',

  async () =>
  {
    const chunk: Chunk = { type: 'block', content: '#include foo;' };
    const [, result] = await handler.transform(0, chunk);

    expect(result).toBe("output.push(include('foo', { data, sanitize }));");
  }
);