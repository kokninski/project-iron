module.exports = {
  plugins: {
    // Tailwind CSS processing
    tailwindcss: {},

    // Autoprefixer for vendor prefixes
    autoprefixer: {},

    // Additional PostCSS plugins can be added here
    // Example: cssnano for production minification
    ...(process.env.NODE_ENV === 'production' ? { cssnano: {} } : {})
  },
}
