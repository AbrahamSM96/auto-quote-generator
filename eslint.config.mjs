import nextPlugin from '@next/eslint-plugin-next'
import tuLint from 'eslint-config-auto-quote-generator'

export default [
  ...tuLint,
  {
    files: ['*.ts', '*.tsx', '**/*.ts', '**/*.tsx'],
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      '@next/next/no-html-link-for-pages': 'off',
      '@next/next/no-duplicate-head': 'off',
    },
  },
  {
    ignores: [
      '.next',
      'coverage',
      '.open-next',
      '**/.well-known/traffic-advice/route.ts',
      '**/.sst',
      'relay.config.js',
      'eslint.config.mjs',
      'tailwind.config.ts',
      'postcss.config.js',
      'next-env.d.ts',
      'next.config.js',
      'tailwind.config.js',
      'global.d.ts',
      '**/__generated__/**',
      'jest.config.js',
      'index.d.ts',
      'public/gtm/gtm.js',
      'public/jwplayer/jwplayer.js',
      'public/service-worker.js',
      'public/sw-int.js',
      'public/adswizzsdk/adswizzsdk.js',
      'utils/jsxRenderApi/**',
      'sst.config.ts',
      'node_modules/**',
    ],
  },
]
