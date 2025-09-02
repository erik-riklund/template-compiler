# @zenplate/compiler

⚠️ Currently in an alpha stage. It will be used by the upcoming **Zenplate** template engine.

---

_There should be no business logic or expressions in templates, only structure._

This is the core idea behind **Zenplate**'s compiler. The default syntax is easy to read and simple to understand. The goal is to separate the structure from the logic, making it easier to work with—for both developers and designers.

> The compiler is designed to be flexible and extensible. You can add custom handlers—or replace the default ones—to fit the needs of your project.

It was built primarily for a static site generator project, but it can also be used to render dynamic content in other contexts. The created render functions are strict, which means that they will throw errors when the type of a variable doesn't match the type expected by a block handler.

---

## A simple example

Using the default syntax in a HTML template:

```html
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
    <p>There are no jobs associated with this user.</p>
    end

    #when $user.isAdmin:
    <p>This user have an administrative role.</p>
    end
  </body>
</html>
```

> The `!` means that the value of a variable should not be sanitized.

---

## Using the compiler

The compiler exposes an API with two methods: `toFunction` and `toString`.

For both of these methods, the returned function has the signature `(context) => { ... }` and accepts a single, optional `context` object as its argument.

  The `context` object can contain one or both of the following properties:

  - `data`: An object containing key-value pairs that hold the necessary data to render the template.
  - `sanitize`: A function that can be used to sanitize variable values, preventing potential security vulnerabilities.

---

Transforming a template to an executable render function:

```js
import { transformTemplate } from '@zenplate/compiler'

// We assume that the template is stored in a variable called `template`.

const renderFunction = await transformTemplate.toFunction({ template });
```

---

Transforming a template to a stringified render function that can be cached and imported at runtime:

```js
import { transformTemplate } from '@zenplate/compiler'

// We assume that the template is stored in a variable called `template`.

const renderFunction = await transformTemplate.toString({ template });
```

---

## Quick syntax reference

*This section assumes that you are using the default syntax.*

### Variables

- **Interpolated variables:**

  Inline rendering of variable values is supported using the `{` and `}` delimiters.

  - `{$variableName}` or `{$variableName.property}`

  The `!` modifier can be used to prevent the value from being sanitized.

  - `{$variableName!}` or `{$variableName.property!}`

- **Variables used in block openers:**

  The variables used in block openers does not need the `{` and `}` delimiters.

  - `$variableName` or `$variableName.property`

> Missing variables are output as the string `undefined`.

---

### Blocks

Block declarations—both openers and closers—must be on a line by themselves.

`when` and `with` blocks can use `else:` to render fallback content if the condition is not met.

---

- `#when` and `#when not`:

  These blocks are used to conditionally render content based on whether a variable is `true` or `false`.

  ```
  #when $someBooleanVariable:
    The value of $someBooleanVariable is true.
  else:
    The value of $someBooleanVariable is false.
  end
  ```

  ```
  #when not $someBooleanVariable:
    The value of $someBooleanVariable is false.
  end
  ```

  > Throws an error during rendering if the variable is not a boolean value.

---

- `#with` and `#without`:

  These blocks are used in conjunction with `#each` to determine if an array has content.

  ```
  #with $someArrayVariable:
    The array $someArrayVariable has one or more items.
  else:
    The array $someArrayVariable is empty.
  end
  ```

  ```
  #without $someArrayVariable:
    The array $someArrayVariable is empty.
  end
  ```

  > Throws an error during rendering if the variable is not an array.

---

- `#each`:

  Used to iterate over an array and render content for each iteration.

  ```
  #each job in $jobs:
    Render content using the local variable `$job`.
  end
  ```

  Destructuring is supported, allowing you to break each item into multiple variables.

  ```
  #each company, started in $jobs:
    Render content using the local variables `$company` and `$started`.
  end
  ```

  > Throws an error during rendering if the variable is not an array.