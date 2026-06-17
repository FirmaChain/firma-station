import react from '@vitejs/plugin-react-swc';
import { cjsInterop } from 'vite-plugin-cjs-interop';
import { defineConfig, loadEnv } from 'vite';
import vitePluginBundleObfuscator from 'vite-plugin-bundle-obfuscator';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import tsconfigPaths from 'vite-tsconfig-paths';
import packageJson from './package.json';

const minimizeObfuscatorConfig = {
  autoExcludeNodeModules: true,
  threadPool: { enable: true, size: 4 },

  stringArray: true,
  stringArrayEncoding: ['base64', 'rc4'],
  stringArrayThreshold: 1,
  splitStrings: true,
  splitStringsChunkLength: 3,
  transformObjectKeys: true,
  unicodeEscapeSequence: true,

  numbersToExpressions: true,

  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 1,
  deadCodeInjection: true,
  deadCodeInjectionThreshold: 1,
  debugProtection: true,
  debugProtectionInterval: true,
  disableConsoleOutput: true,
  identifierNamesGenerator: 'hexadecimal',
  log: false,
  renameGlobals: false,
  selfDefending: true,
  simplify: true
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      // Keep default imports from legacy CJS packages stable under Vite 7's
      // dependency optimizer. Unwrap the source import for the affected deps we
      // default-import in the app.
      cjsInterop({
        client: true,
        dependencies: [
          '@mui/icons-material/**',
          'react-spinners/**',
          'crypto-js',
          'qrcode'
        ]
      }),
      nodePolyfills({ exclude: ['crypto'] }),
      tsconfigPaths(),
      ...(env.NODE_ENV === 'production' ? [vitePluginBundleObfuscator(minimizeObfuscatorConfig)] : [])
    ],

    server: {
      port: Number(env.PORT) || 3000,
      host: true,
      strictPort: false
    },

    preview: {
      port: Number(env.PORT) || 3000,
      host: true,
      strictPort: false
    },

    build: {
      outDir: 'build',
      sourcemap: false
    },

    resolve: {
      preserveSymlinks: true
    },

    optimizeDeps: {
      include: ['@firmachain/firma-js']
    },

    define: {
      'import.meta.env.VITE_APP_VERSION': JSON.stringify(packageJson.version)
    }
  };
});
