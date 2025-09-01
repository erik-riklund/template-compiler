## @zenplate/compiler

_Probably the cleanest templates in the world._

---

This tool was built on a single, guiding principle:  
_There should be no business logic or expressions in templates, only structure._

---

- **A simple example using the default syntax in a HTML template:**

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
    </body>
  </html>
  ```
> The `!` means that the value of a variable should not be sanitized.

---

...