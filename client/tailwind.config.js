const preset = require('@zakodium/tailwind-config')();

module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{js,ts,jsx,tsx}', './index.html'],
  darkMode: 'media',
  presets: [preset],
};
