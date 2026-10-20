import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const dataFile = fileURLToPath(new URL('./src/data/portfolio.json', import.meta.url));

// Dev-only endpoint: lets the in-page editor write changes straight into src/data/portfolio.json,
// so whatever you edit locally is what gets built and deployed.
function savePortfolio(): Plugin {
  return {
    name: 'save-portfolio',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__save-portfolio', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end();
          return;
        }
        let body = '';
        req.on('data', (chunk) => (body += chunk));
        req.on('end', async () => {
          try {
            const data = JSON.parse(body);
            if (!data?.profile || !Array.isArray(data.skills)) throw new Error('Not a portfolio payload');
            await writeFile(dataFile, JSON.stringify(data, null, 2) + '\n', 'utf8');
            res.statusCode = 204;
            res.end();
          } catch (err) {
            res.statusCode = 400;
            res.end(err instanceof Error ? err.message : String(err));
          }
        });
      });
    },
  };
}

export default defineConfig({
  // Relative base so the build works on GitHub Pages under any repo name.
  base: './',
  plugins: [react(), savePortfolio()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
});
