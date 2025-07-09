module.exports = {
  content: [
    "../frontend/**/*.{js,jsx,ts,tsx,html,css}",
    "../frontend/styles/**/*.css",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        border: "var(--border)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        ring: "var(--ring)",
      },
    },
  },
  plugins: [],
};
