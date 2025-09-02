//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import type { Chunk } from 'types'
import { it, expect } from 'bun:test'
import { eachBlockHandler } from 'handlers/blocks/each'

// ---

it('should transform a `each` block with a variable',

  async () =>
  {
    const chunk: Chunk = { type: 'block', content: '#each user in $users:' };
    const [, result] = await eachBlockHandler.transform(0, chunk);

    expect(result).toInclude("for (const user of (typeof users !== 'undefined' ? users : data.users)) {");
  }
);

// ---

it('should transform a `each` block with a nested variable',

  async () =>
  {
    const chunk: Chunk = { type: 'block', content: '#each job in $user.jobs:' };
    const [, result] = await eachBlockHandler.transform(0, chunk);

    expect(result).toInclude("for (const job of (typeof user !== 'undefined' ? user?.jobs : data.user?.jobs)) {");
  }
);

// ---

it('should transform a destructured `each` block with a variable',

  async () =>
  {
    const chunk: Chunk = { type: 'block', content: '#each name, age in $users:' };
    const [, result] = await eachBlockHandler.transform(0, chunk);

    expect(result).toInclude("for (const { name, age } of (typeof users !== 'undefined' ? users : data.users)) {");
  }
);

// ---

it('should transform a destructured `each` block with a nested variable',

  async () =>
  {
    const chunk: Chunk = { type: 'block', content: '#each company, started in $user.jobs:' };
    const [, result] = await eachBlockHandler.transform(0, chunk);

    expect(result).toInclude("for (const { company, started } of (typeof user !== 'undefined' ? user?.jobs : data.user?.jobs)) {");
  }
);