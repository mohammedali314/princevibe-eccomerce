module.exports = {
  plugins: {
    // Temporarily disabled purgecss to fix development server
    // '@fullhuman/postcss-purgecss': {
    //   content: [
    //     './src/**/*.{js,jsx,ts,tsx}',
    //     './public/index.html'
    //   ],
    //   defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
    //   safelist: [
    //     /^luxury-toast/,
    //     /^page-loader/,
    //     /^skeleton/,
    //     /^animate/,
    //     /^lazy/,
    //     /^loaded/,
    //     /^active/,
    //     /^visible/,
    //     /^hidden/,
    //     /^error/,
    //     /^success/,
    //     /^warning/,
    //     /^info/
    //   ]
    // }
  }
} 