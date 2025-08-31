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
const { data, dependencies, sanitize } = {
  data: {},
  dependencies: {},
  sanitize: (input) => input.replace(/</g, '&lt;').replace(/>/g, '&gt;'),
  
  ...context
}

%1

return output.join('');`;

//
// Assembles the transformed chunks into a render function.
//
export const assemble: Stage<Array<string>, string> = async (input) =>
{
  return formatString(template, [input.join('\n')]);
}