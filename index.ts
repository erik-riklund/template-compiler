//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//
// @version 1.0.0
//

import type { PipelineInput, Renderer } from 'types'
import { createPipeline } from 'composable-pipeline'

//
// The stages of the pipeline, each isolated and composable.
//
import { parse } from 'core/parse'
import { transform } from 'core/transform'
import { assemble } from 'core/assemble'
import { outputToString } from 'core/output/string'
import { outputToFunction } from 'core/output/function'

//
// The template transformation module, providing two entry points:
// 
// - `toString` creates a stringified render function
// - `toFunction` creates an executable render function
//
export const transformTemplate =
{
  toString: createPipeline<PipelineInput, string>(
    [parse, transform, assemble, outputToString]
  ),
  toFunction: createPipeline<PipelineInput, Renderer>(
    [parse, transform, assemble, outputToFunction]
  )
}