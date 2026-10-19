import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// public/otel и public/buh — готовые демо-сборки (отель, бухгалтерия). В dev Vite отдал бы на /otel
// главную страницу (SPA fallback), поэтому направляем запрос на её index.html.
const otelDemo = (): Plugin => ({
  name: "otel-demo",
  configureServer(server) {
    server.middlewares.use((req: { url?: string }, _res, next) => {
      const [path, query] = (req.url ?? "").split("?");
      if (path === "/otel" || path === "/otel/") req.url = "/otel/index.html" + (query ? `?${query}` : "");
      if (path === "/buh" || path === "/buh/") req.url = "/buh/index.html" + (query ? `?${query}` : "");
      if (path === "/crm" || path === "/school" || path === "/admin") req.url = `${path}/` + (query ? `?${query}` : "");
      next();
    });
  },
});

export default defineConfig({
  plugins: [otelDemo(), react(), tailwindcss()],
  // PORT задаёт превью Claude Code, когда 5173 занят
  server: { port: Number((globalThis as { process?: { env: Record<string, string | undefined> } }).process?.env.PORT) || 5173 },
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      // /crm и /school — отдельные страницы с демо CRM (вход по паролю)
      input: { main: "index.html", crm: "crm/index.html", school: "school/index.html", admin: "admin/index.html" },
      output: {
        manualChunks: {
          three: ["three", "@react-three/fiber", "@react-three/drei"],
          motion: ["gsap", "framer-motion", "lenis"],
        },
      },
    },
  },
});
