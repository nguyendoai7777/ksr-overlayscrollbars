/// <reference types='vitest' />
import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import * as path from 'path';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

/**
 * Plugin Rollup tùy chỉnh để giữ lại các chỉ thị như 'use client'
 * mà Rollup/Terser có thể loại bỏ trong quá trình build thư viện.
 *
 * @returns {Plugin}
 */
const preserveDirectivesPlugin = (): Plugin => {
  // Biến tạm để lưu trữ các directives từ các module đã tải
  const directives = new Map<string, string>();

  return {
    name: 'preserve-directives',
    load(id) {
      if (id.endsWith('.ts') || id.endsWith('.tsx') || id.endsWith('.js') || id.endsWith('.jsx')) {
        const code = require('fs').readFileSync(id, 'utf-8');
        // Regex đơn giản để tìm kiếm 'use client' hoặc 'use server'
        const match = code.match(/^(\s*['"]use (client|server)['"];?\s*\n?)/);
        if (match) {
          directives.set(id, match[1].trim());
          return code.replace(match[1], '');
        }
      }
      return null;
    },

    renderChunk(code, chunk) {
      const moduleIds = Object.keys(chunk.modules);
      const entryId = moduleIds.find((id) => directives.has(id));

      if (entryId) {
        const directive = directives.get(entryId);
        return `${directive}\n${code}`;
      }
      return null;
    },
  };
};
export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/libs/rx-scrollable',
  plugins: [
    react(),
    nxViteTsPaths(),
    nxCopyAssetsPlugin(['*.md']),
    dts({ entryRoot: 'src', tsconfigPath: path.join(__dirname, 'tsconfig.lib.json'), pathsToAliases: false }),
    // preserveDirectivesPlugin(),
  ],
  build: {
    outDir: '../../dist/libs/rx-scrollable',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    lib: {
      entry: 'src/index.ts',
      name: 'rx-scrollable',
      fileName: 'index',
      formats: ['es' as const],
    },
    rollupOptions: {
      // External packages that should not be bundled into your library.
      external: ['react', 'react-dom', 'react/jsx-runtime'],
    },
  },
  test: {
    name: 'react-scrollable',
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/libs/react-scrollable',
      provider: 'v8' as const,
    },
  },
}));
