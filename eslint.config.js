export default [
  {
    ignores: ['dist/', 'node_modules/', '.astro/', '**/*.d.ts'],
  },
  {
    files: ['**/*.{js,ts,tsx,astro}'],
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'error',
    },
  },
];
