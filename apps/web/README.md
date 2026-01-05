
  # EventSense-US Web App UI

  This is a code bundle for EventSense-US Web App UI. The original project is available at https://www.figma.com/design/EUtZ3H1mZqXnEbTFdJtIwj/EventSense-US-Web-App-UI.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

## Demo chart mode (temporary)

This UI currently shows a static demo chart image.

- Image: `apps/web/public/demo_pic.png` (served as `/demo_pic.png`)
- Flag: `VITE_USE_DEMO_CHART`
  - Default: demo mode is ON unless you set `VITE_USE_DEMO_CHART=false`

Example:

```bash
VITE_USE_DEMO_CHART=false npm run dev
```
  