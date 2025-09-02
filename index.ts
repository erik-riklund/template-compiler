//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//
// @version 0.1.0
//

import type {
  CompilePipelineInput,
  RenderingFunction,
  StringifiedRenderingFunction
} from 'types'

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
export const compileTemplate =
{
  toString: createPipeline<CompilePipelineInput, StringifiedRenderingFunction>(
    [parse, transform, assemble, outputToString]
  ),
  toFunction: createPipeline<CompilePipelineInput, RenderingFunction>(
    [parse, transform, assemble, outputToFunction]
  )
}

//
// Exports the default handlers. These are automatically included,
// but it's required for adding custom handlers to the pipeline.
//
export { getDefaultHandlers } from 'handlers'