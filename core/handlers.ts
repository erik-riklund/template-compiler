//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import { glob } from 'glob'
import type { Handler } from 'types'

// ---

export const loadHandlers = async () =>
{
  const handlers: Array<Handler> = [];

  const files = await glob('handlers/*.{ts,js}');

  for (const file of files)
  {
    const { handler } = await import(file);

    handlers.push(handler);
  }

  return handlers;
}