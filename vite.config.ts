import { defineConfig } from "vite";
import mdx from "vite-plugin-md";
import react from "@vitejs/plugin-react";
import Pages from "vite-plugin-pages";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [
    mdx(),
    Pages({
      dirs: "client/src/pages",
      extensions: ["tsx", "mdx"],
    }),
    react({
      include: [/\.tsx?$/, /\.mdx?$/],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
  },
});