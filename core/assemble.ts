//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import type { Stage } from 'composable-pipeline/types'

//
// ?
//
export const assemble: Stage<Array<string>, string> = async (input) =>
{
  const body = input.join('\n');

  return (
    "const output = [];\n" +
    "const sanitize = (input) => input.replace(/</g, '&lt;').replace(/>/g, '&gt;');\n\n" +
    body + "\n\nreturn output.join('');"
  );
}