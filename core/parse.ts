//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import type { Stage } from 'composable-pipeline/types'
import type { Chunk, PipelineInput, ParseRules, TransformationStageInput } from 'types'

//
// ?
//
export const parse: Stage<
  PipelineInput, TransformationStageInput
> = async ({ template, handlers, rules }) =>
  {
    const chunks: Array<Chunk> = [];

    const lines = template.replace(/`/g, '\\`').split(/\r?\n/);
    const { block, blockEnd, comment, variable, variableEnd } = applyDefaultRules(rules ?? {});

    for (const line of lines)
    {
      const trimmedLine = line.trim();

      if (comment(trimmedLine))
      {
        continue; // move to the next line.
      }

      if (block(trimmedLine) || blockEnd(trimmedLine))
      {
        chunks.push({ type: 'block', content: trimmedLine });

        continue; // move to the next line.
      }

      parseLine(chunks, line, { variable, variableEnd });
    }

    return { chunks, handlers };
  }

//
// ?
//
const applyDefaultRules = (rules: Partial<ParseRules>) =>
{
  const defaultRules: ParseRules =
  {
    block: (line: string) => 
    {
      return line.startsWith('#') && line.endsWith(':');
    },

    blockEnd: (line: string) => line === 'end',
    comment: (line: string) => line.startsWith('//'),

    variable: (_buffer: string, current: string, next: Nullable<string>) =>
    {
      return current === '{' && next === '$';
    },

    variableEnd: (buffer: string, current: string) =>
    {
      return buffer.startsWith('{$') && current === '}';
    }
  }

  return { ...defaultRules, ...rules };
}

//
// ?
//
const parseLine = (chunks: Array<Chunk>, line: string,
  { variable, variableEnd }: Pick<ParseRules, 'variable' | 'variableEnd'>) =>
{
  let buffer = '';

  for (let i = 0; i < line.length; i++)
  {
    const current = line[i];
    const next = i < line.length - 1 ? line[i + 1] : null;

    if (variable(buffer, current, next))
    {
      chunks.push({ type: 'text', content: buffer });

      buffer = ''; // reset buffer to start collecting the variable name.
    }

    buffer += current;

    if (variableEnd(buffer, current, next))
    {
      chunks.push({ type: 'variable', content: buffer });

      buffer = ''; // reset buffer to collect text after the variable.
    }

    if (i === line.length - 1)
    {
      // we've reached the end of the line.

      chunks.push({ type: 'text', content: buffer + '\\n' });
    }
  }
}