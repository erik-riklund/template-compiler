//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import { it, expect } from 'bun:test'
import { transformTemplate } from '..'

// ---

it('should render a template with plain text',

  async () =>
  {
    const template = 'Hello world';
    const render = await transformTemplate.toFunction({ template });

    expect(render()).toBe('Hello world');
  }
);