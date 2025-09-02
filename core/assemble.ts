//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import { formatString } from 'format-string'
import type { Stage } from 'composable-pipeline/types'

//
// ?
//
const template = `const output = [];
const { data, sanitize } =
{
  data: {},
  
  sanitize: (input) => {
    return typeof input !== 'string' ? String(input)
      : input.replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  },
  
  ...context
}

%1

return output.join('').trim();`;

//
// Assembles the transformed chunks into a render function.
//
export const assemble: Stage<Array<string>, string> = async (input) =>
{
  return formatString(template, [input.join('\n')]);
}