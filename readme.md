## Unnamed template pipeline

_Probably the cleanest templates in the world._

---

This tool was built on a single, guiding principle:  
_There should be no business logic or expressions in templates, only structure._

It's a minimal system designed for transforming structured text into executable rendering logic.

---

> - **A simple example using the default syntax in a HTML template:**
>
>   ```html
>   <html>
>     <head>
>       <title>{$title}</title>
>     </head>
>     <body>
>       <h1>{$title}</h1>
>       <p>{$body!}</p>
>     </body>
>   </html>
>   ```
>   The above example use the variables `$title` and `$body`.  
>   The `!` means that the output should not be sanitized.

---

...