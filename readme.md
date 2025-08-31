# ?

_Probably the cleanest templates in the world._

---

### Table of contents

- [Introduction](#introduction)
- [Getting started](#getting-started)
  - [Installation](#installation)
  - [Using the transformation module](#using-the-transformation-module)
- [System architecture](#system-architecture)
  - [Parsing and transformation](#parsing-and-transformation)
  - [Rendering model](#rendering-model)

---

## Introduction

This tool was built on a single, guiding principle:  
_There should be no business logic or expressions in templates, only structure._

It's a minimal system designed for transforming structured text into executable rendering logic—designed for control, clarity, and customization. 

Instead of enforcing a single way to write templates, it allows you to define how blocks, variables, and comments are recognized, so the tool adapts to your project—not the other way around. 

> - **A simple example using HTML:**
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

## Getting started

### Installation

...

### Using the transformation module

...

---

## System architecture

### Parsing and transformation

...

### Rendering model

...