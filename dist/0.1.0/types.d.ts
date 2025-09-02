//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//
// @version 0.1.0
//

//
// ?
//
export interface BlockParsingRules
{
  block: (line: string) => boolean,
  blockEnd: (line: string) => boolean,
  elseBlock: (line: string) => boolean,
  comment: (line: string) => boolean,

  variable: (buffer: string, current: string, next: Nullable<string>) => boolean,
  variableEnd: (buffer: string, current: string, next: Nullable<string>) => boolean
}

//
// ?
//
export type Chunk = {
  type: 'text' | 'variable' | 'block',
  content: string
}

//
// ?
//
export type CompilePipelineInput = {
  template: string,
  handlers?: Array<TransformationHandler>,
  rules?: Partial<BlockParsingRules>
}

//
// ?
//
type RenderingContext = Partial<
  {
    data: Record<string, unknown>,
    sanitize: (input: string) => string
  }
>;

//
// ?
//
export type RenderingFunction = (context?: RenderingContext) => string;

//
// ?
//
export type StringifiedRenderingFunction = string;

//
// ?
//
export type TransformedChunk = [number, string];

//
// ?
//
export interface TransformationHandler
{
  test: (chunk: Chunk) => boolean,
  transform: (index: number, chunk: Chunk) => Promise<TransformedChunk>
}

//
// ?
//
export type TransformationStageInput = {
  chunks: Array<Chunk>,
  handlers?: Array<TransformationHandler>
};