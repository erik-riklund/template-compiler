//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import { it, expect } from 'bun:test'
import { transformTemplate } from '..'
import { getHandlers } from 'handlers'

import { formatString } from 'format-string'

// ---

const mainTemplate = `
<html>
  <head>
    <title>{$title}</title>
  </head>
  
  <body>
    #include foo;
  </body>
</html>`;

const includedTemplate = '<h1>{$title}</h1>';

// ---

it('should render an included template with the same data as the main template',

  async () =>
  {
    const renderInclude = formatString(
      "const include_foo = %1",
      [await transformTemplate.toString(
        { template: includedTemplate, handlers: getHandlers() }
      )]
    );

    const renderMain = formatString(
      "%1\nconst main = %2\nreturn main(context);",
      [renderInclude, await transformTemplate.toString(
        { template: mainTemplate, handlers: getHandlers() }
      )]
    );

    const render = new Function('context', renderMain);
    const result = render({ data: { title: 'Hello world' } });

    expect(result).toInclude('<title>Hello world</title>');
    expect(result).toInclude('<h1>Hello world</h1>');
  }
);