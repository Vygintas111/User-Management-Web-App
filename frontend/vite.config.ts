import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// http://localhost:8080
// http://test4app.codespark.lt

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "http://test4app.codespark.lt",
});
