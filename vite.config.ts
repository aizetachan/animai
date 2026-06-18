import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Animai — React shell + previews vanilla (0 deps de runtime en las previews).
export default defineConfig({
  plugins: [react()],
  server: { host: true, port: 5173 },
});
