//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import { it, expect } from 'bun:test'
import { transformTemplate } from '..'
import { getHandlers } from 'handlers'

// ---

it('should throw an error when using `with` on a non-array variable',

  async () =>
  {
    const template = `#with $user.jobs:\n...\nend`;

    const data = { user: { jobs: 'none' } };
    const render = await transformTemplate
      .toFunction({ template, handlers: getHandlers() });

    expect(() => render({ data })).toThrow("'user.jobs' is not an array");
  }
);

// ---

it('should throw an error when using `each` on a non-array variable',

  async () =>
  {
    const template = `#each job in $jobs:\n...\nend`;

    const data = { jobs: 'none' };
    const render = await transformTemplate
      .toFunction({ template, handlers: getHandlers() });

    expect(() => render({ data })).toThrow("'jobs' is not an array");
  }
);

// ---

it('should throw an error when using `when` on a non-boolean variable',

  async () =>
  {
    const template = `#when $isAdmin:\n...\nend`;

    const data = { isAdmin: 'nope' };
    const render = await transformTemplate
      .toFunction({ template, handlers: getHandlers() });

    expect(() => render({ data })).toThrow("'isAdmin' is not a boolean value");
  }
);