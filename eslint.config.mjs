import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  {
    settings: {
      'jsx-a11y': {
        components: {
          FieldLabel: 'label',
          Input: 'input',
        },
      },
    },
  },

  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'generated/**',
    'lib/generated/**',
    'next-env.d.ts',
    'Scratches/**',
  ]),
])

export default eslintConfig
