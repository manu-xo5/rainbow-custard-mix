import plugin from "tailwindcss/plugin";
import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      height: {
        "app-bar": "var(--app-bar)",
      },
      colors: (theme) => ({
        primary: theme.colors.zinc[700],
        secondary: theme.colors.zinc[800],
        border: theme.colors.zinc[500],
        accent: theme.colors.blue[600],
        "text-primary": "#E5E5E5",
      }),
      spacing: {
        sm: "1.5em 2.5em",
        md: "2.5em 3.5em",
        3.75: "0.9375rem",
        4.5: "1.125rem",
      },
      borderRadius: {
        sm: "5px",
      },
      borderColor: (theme) => ({
        DEFAULT: theme.colors.zinc[500],
      }),
      lineHeight: {
        19: "76px",
      },
      width: {
        6.5: "1.625rem",
        19: "76px",
      },
      fontFamily: {
        DEFAULT: "monospace"
      },
      fontSize: {
        title: ["1.125rem", { lineHeight: "1.3em" }],
        sm: ["0.875rem", { lineHeight: "1.2em" }],
        base: ["14px", { lineHeight: "1.285em" }],
        icon: ["44px", "44px"],
      },
    },
  },
  plugins: [
    plugin(({ addBase, theme }) => {
      addBase({
        html: {
          touchAction: "manipulation",
          color: theme("colors.text-primary"),
          backgroundColor: theme("colors.secondary"),
        },
      });
    }),
  ],
} satisfies Config;
