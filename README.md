![Project Banner]()

# Pixelfly

Create simple avatars on the fly!

Implementing user profile pictures and uploading them can be surprisingly difficult. Rather than going through the hassle of creating some kind of storage bucket or saving a base64 string, you can just save a number - a random seed that controls the generation of a snazzy space invader!

## Installation

```bash
pnpm install @vanilla-libraries/pixelfly
```

## Usage

Because Pixelfly creates an SVG string, you have a lot of options as to how you want to serve profile pictures. You can create them completely on the client (thus negating all server side costs), or serve send the appropriate content type headers through the server.

Here's an example of using Pixelfly on the client.

```ts
import { Pixelfly } from "@vanilla-libraries/pixelfly";

document.body.innerHTML += new Pixelfly().createSVG(10);
```

Here's an example of using Pixelfly on the server.

```ts
// todo example
// todo more docs on the options you can pass in
```

The seed only produces the exact same image assuming all of the other configurations are constant (a different margin but same seed will produce entirely different images, for example). For convenience and additional control, I also export the same random generator and random generator instance that Pixelfly uses.
