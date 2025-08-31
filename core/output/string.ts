//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import type { Stage } from 'composable-pipeline/types'

//
// Creates a stringified render function.
//
export const outputToString: Stage<string, string> = async (body) =>
{
  // todo: add indentation to produce human-readable output.

  return `(context) => {\n  ${body}\n}`;
}