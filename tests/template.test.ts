//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import { it, expect } from 'bun:test'
import { compileTemplate } from '..'
import { getDefaultHandlers } from 'handlers'

// ---

const template = `
<html>
  <head>
    <title>{$title}</title>
  </head>
  
  <body>
    <h1>{$user.name}</h1>
    <p>{$user.profile!}</p>

    #with $user.jobs:
    <ul>
      #each company, started in $user.jobs:
      <li>{$company} ({$started})</li>
      end
    </ul>
    else:
    <p>No jobs</p>
    end

    #when $user.isAdmin:
    <p><a href="/admin">Administration panel</a></p>
    end
  </body>
</html>`;

// ---

it('should render a template with every possible block type',

  async () =>
  {
    const render = await compileTemplate
      .toFunction({ template, handlers: getDefaultHandlers() });

    const data =
    {
      title: 'Hello world',

      user:
      {
        name: 'Foo',
        profile: 'My nickname is <b>Bar</b>!',

        jobs: [
          { company: 'Alpha', started: '2020' },
          { company: 'Beta', started: '2021' }
        ],

        isAdmin: false
      }
    };

    const result = render({ data });

    expect(result).toInclude('<title>Hello world</title>');
    expect(result).toInclude('<h1>Foo</h1>');
    expect(result).toInclude('<p>My nickname is <b>Bar</b>!</p>');
    expect(result).toInclude('<li>Alpha (2020)</li>');
    expect(result).toInclude('<li>Beta (2021)</li>');
    expect(result).not.toInclude('Administration panel');
  }
);