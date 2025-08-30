# An opinionated template transformer

_Probably the cleanest templates in the world._

---

You have data, and you need to transform it into structured content.

It's a task you've done countless times, and you're good at it. Yet, the tools you reach for often feel like they're getting in the way. They force you to learn new syntaxes, hide your content behind layers of abstraction, and demand complex configurations for simple tasks.

This tool was built on a single, guiding principle:  
_There should be no business logic or expressions in templates, only structure._

Instead of forcing your content to conform to a framework, it listens to what you've already written. It's a simple, elegant solution for people who believe that a template should look like a template, and that a tool should make your work easier, not more complicated.

> - #### A simple example
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
>   ?

---

## ?

This tool's primary value is that it never gets in the way of your content.

The syntax is minimal and intuitive, designed to feel like a natural extension of your hands. It doesn't generate unreadable code or create a "black box" you can't understand. The template you write is the one that stays. You can read it, edit it in any text editor, and share it with your team without a long explanation.

The original text is never lost, ensuring a clear and direct connection between your intent and the final output.

## ?

The tool's core process is built on flexibility. It first reads your template, breaking it down into three simple components:

- directives = *the structure*
- variables = *the dynamic content*
- plain text = *the static body*

This isn't a rigid, one-size-fits-all approach. It's an act of attention. This gentle parsing allows it to understand your content without judging or rewriting it.

## ?

Once parsed, the system transforms your template with a smart, asynchronous process. Each chunk is handled independently. The system waits with patience, ensuring that nothing blocks the process. This design means the tool is both efficient and reliable, able to handle complex tasks without freezing or slowing you down. It works the way you would expect it to.

## ?

After all the processing is complete, the tokens are stitched back together. Directives become logical code, and variables become secure lookups. The plain text returns untouched, just as you wrote it. The final result is a function that can be used to render your data.

This process ensures that the integrity of your original template is never compromised. The tool simply helps you turn what you wrote into what the final output needs, without losing the thread between them.

---

?