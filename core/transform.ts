//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import { getDefaultHandlers } from 'handlers'

import type { Stage } from 'composable-pipeline/types'
import type { TransformationHandler, TransformedChunk, TransformationStageInput } from 'types'

//
// ?
//
export const transform: Stage<
  TransformationStageInput, Array<string>
> = async ({ chunks, handlers }) =>
  {
    const result: Array<string> = [];
    const processedChunks: Array<Promise<TransformedChunk>> = [];

    handlers ??= getDefaultHandlers();

    for (let index = 0; index < chunks.length; index++)
    {
      const chunk = chunks[index];
      let handler: Nullable<TransformationHandler> = null;

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