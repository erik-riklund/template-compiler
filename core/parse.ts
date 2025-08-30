//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import type { Chunk } from 'template-compiler/types'
import type { Stage } from 'composable-pipeline/types'

//
// ?
//
export const parse: Stage<string, Array<Chunk>> = async (input) =>
{
  const chunks: Array<Chunk> = [];
  const lines = input.replace(/`/g, '\\`').split(/\r?\n/);

  for (const line of lines)
  {
    const trimmedLine = line.trim();

    const isComment = trimmedLine.startsWith('//');
    const isOpeningTag = trimmedLine.startsWith('#') && trimmedLine.endsWith(':');
    const isClosingTag = trimmedLine === 'end';

    if (isOpeningTag || isClosingTag)
    {
      const directive = isOpeningTag ? trimmedLine.slice(1, -1) : trimmedLine;

      chunks.push({ type: 'directive', content: directive });
    }
    else if (!isComment)
    {
      let buffer = '';

      for (let i = 0; i < line.length; i++)
      {
        const current = line[i];
        const next = i < line.length - 1 ? line[i + 1] : null;

        if (current === '{' && next === '$')
        {
          chunks.push({ type: 'text', content: buffer });

          buffer = ''; // reset buffer to start collecting the variable name.
        }

        buffer += current;

        if (buffer.startsWith('{$') && current === '}')
        {
          chunks.push({ type: 'variable', content: buffer });

          buffer = ''; // reset buffer to collect text after the variable.
        }

        if (i === line.length - 1)
        {
          // we've reached the end of the line.
          chunks.push({ type: 'text', content: buffer });
        }
      }
    }
  }

  return chunks;
}

//
// ?
//
const parseLine = async () =>
{
  // ...
}