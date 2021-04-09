# Log Scope
The app that provides you a better tool to monitor your rn application and debug it via log messages

## Installation
Pick a tool according to your OS:
1. `npm i log-scope-app-linux`
2. `npm i log-scope-app-mac` (Under construction 🔨)
3. `npm i log-scope-app-windows` (Under construction 🔨)

And run `npx log-scope`

⚠️ **Some of a RN CLI files will be automatically patched. In other words, it slightliy changes the watch's tool behaviour in case of console use** ⚠️

## Development

According to a environmental dependency of an application (RN CLI), you have to explicitly set the `DEV_APPLICATION` variable to your app's folder: `/home/<USER>/repos/<app folder>`.

So you can run the log scope in development mode:
`npm run dev` for dev server and `npm run start` for app launch.

Building: `npm run prod && npm run build:linux && ./scripts/bundle-linux.sh`

