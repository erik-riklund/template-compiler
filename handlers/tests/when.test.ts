//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import type { Chunk } from 'types'
import { it, expect } from 'bun:test'
import { handler } from 'handlers/blocks/when'

// ---

it('should transform a `when` block with a variable',

  async () =>
  {
    const chunk: Chunk = { type: 'block', content: '#when $isActive:' };
    const [, result] = await handler.transform(0, chunk);

    expect(result).toInclude("if ((typeof isActive !== 'undefined' ? isActive : data.isActive) === true) {");
  }
);

// ---

it('should transform a `when not` block with a variable',

  async () =>
  {
    const chunk: Chunk = { type: 'block', content: '#when not $isActive:' };
    const [, result] = await handler.transform(0, chunk);

    expect(result).toInclude("if ((typeof isActive !== 'undefined' ? isActive : data.isActive) === false) {");
  }
);

// ---

it('should transform a `when` block with a nested variable',

  async () =>
  {
    const chunk: Chunk = { type: 'block', content: '#when $user.isActive:' };
    const [, result] = await handler.transform(0, chunk);

    expect(result).toInclude("if ((typeof user !== 'undefined' ? user?.isActive : data.user?.isActive) === true) {");
  }
);

// ---

it('should transform a `when not` block with a nested variable',

  async () =>
  {
    const chunk: Chunk = { type: 'block', content: '#when not $user.isActive:' };
    const [, result] = await handler.transform(0, chunk);

    expect(result).toInclude("if ((typeof user !== 'undefined' ? user?.isActive : data.user?.isActive) === false) {");
  }
);