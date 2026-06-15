import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  base: process.env.NODE_ENV === "production" ? "/instant-wellness-send/" : "/",
});
