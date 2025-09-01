//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

//
// ?
//
export type Chunk = {
  content: string, type: 'text' | 'variable' | 'block'
}

//
// ?
//
export type PipelineInput = {
  template: string, handlers: Array<Handler>, rules?: Partial<ParseRules>
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
export type TransformationStageInput = {
  chunks: Array<Chunk>, handlers: Array<Handler>
};

//
// ?
//
export type TransformedChunk = [number, string];

//
// ?
//
export type Renderer = (context?: RenderingContext) => string;

//
// ?
//
export interface Handler
{
  test: (chunk: Chunk) => boolean,
  transform: (index: number, chunk: Chunk) => Promise<TransformedChunk>
}

//
// ?
//
export interface ParseRules
{
  block: (line: string) => boolean,
  blockEnd: (line: string) => boolean,
  elseBlock: (line: string) => boolean,
  comment: (line: string) => boolean,

  variable: (buffer: string, current: string, next: Nullable<string>) => boolean,
  variableEnd: (buffer: string, current: string, next: Nullable<string>) => boolean
}