//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import type { Stage } from 'composable-pipeline/types'
import type { Handler, Chunk, TransformedChunk } from 'types'

//
// ?
//
const handlers: Array<Handler> = [];

//
// ?
//
export const transform: Stage<Array<Chunk>, Array<string>> = async (chunks) =>
{
  const result: Array<string> = [];
  const processedChunks: Array<Promise<TransformedChunk>> = [];

  for (let index = 0; index < chunks.length; index++)
  {
    const chunk = chunks[index];
    let handler: Nullable<Handler> = null;

    if (chunk.type !== 'text')
    {
      handler = handlers.find(h => h.test(chunk)) ?? null;
    }

    processedChunks.push(
      handler ? handler.transform(index, chunk)
        : Promise.resolve([index, 'output.push(`' + chunk.content + '`);'])
    );
  }

  const transformedChunks = await Promise.all(processedChunks);

  for (const [index, content] of transformedChunks) 
  {
    result[index] = content.trim();
  }

  return result;
}