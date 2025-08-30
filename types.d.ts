//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

//
// ?
//
export type Chunk = {
  type: 'text' | 'variable' | 'directive', content: string
}

//
// ?
//
export type TransformedChunk = [number, string];

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
type Context = {};

//
// ?
//
export type Renderer = (context: Context) => string;