---
"@t3-oss/env-core": patch
---

Server presets no longer crash with `ReferenceError: process is not defined` in browser environments such as Vite apps that do not polyfill `process`.
