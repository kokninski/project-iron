/** @type {import('tailwindcss').Config} */
module.exports = {
  // Content paths for purging unused CSS
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './public/**/*.html',
  ],

  theme: {
    extend: {
      // Custom color palette
      colors: {
        charcoal: '#121316',
        steel: '#2A2E35',
        accent: '#D35400',
        offwhite: '#F5F6F7',
        success: '#1B8F5A',
        warn: '#B58100',
        danger: '#B03A2E',
      },

      // Font families
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'oswald': ['Oswald', 'sans-serif'],
        'sans': ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        'display': ['Oswald', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },

      // Container settings
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
    },

    // Mobile-first responsive breakpoints
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
  },

  plugins: [
    // Add any additional Tailwind plugins here
  ],
}
