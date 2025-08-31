//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

//
// ?
//
export type Chunk = {
  type: 'text' | 'variable' | 'block', content: string
}

//
// ?
//
type Context = Partial<{ data: Record<string, unknown> }>;

//
// ?
//
export type ParserInput = {
  template: string, rules?: Partial<ParseRules>
}

//
// ?
//
export type TransformedChunk = [number, string];

//
// ?
//
export type Renderer = (context?: Context) => string;

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
  comment: (line: string) => boolean,

  variable: (buffer: string, current: string, next: Nullable<string>) => boolean,
  variableEnd: (buffer: string, current: string, next: Nullable<string>) => boolean
}