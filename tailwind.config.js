/** @type {import('tailwindcss').Config} */
import forms from "@tailwindcss/forms";
import aspectRatio from "@tailwindcss/aspect-ratio";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // fontFamily: {
      //   sans: ["Poppins", "ui-sans-serif", "system-ui"],
      // },
      colors: {
        transparent: "transparent",
        primary: {
          DEFAULT: "#ecc52c",
          bg: "#eecc4a"
        },
        rating: {
          green: {
            DEFAULT: "#4EC043",
          },
          blue: {
            DEFAULT: "#0048E8",
          },
          yellow: {
            DEFAULT: "#ffcb00",
          },
          red: {
            DEFAULT: "#E81010",
          }
        },
        status: {
          danger: {
            DEFAULT: "#EE425A",
            bg: "#FCD9DE",
            hover: "#FCC7CE",
            text: "#5D0814",
            100: "#E4213C",
          },
          good: {
            DEFAULT: "#4EB547",
            bg: "#DBF0DA",
            text: "#245421",
          },
        },
        type: {
          DEFAULT: "#1E2329",
          100: "#4F5D6D",
          200: "#ABAFAF",
          300: "#A1ACAF",
        },
        neutral: {
          DEFAULT: "#899598",
          100: "#E1E7EC",
          200: "#EDEFF2",
          300: "#F6F7F9",
        },
      },
      spacing: {
        xxs: "0.25rem",
        xs: "0.5rem",
        s: "1rem",
        m: "1.5rem",
        l: "2rem",
        xl: "3rem",
        xxl: "4rem",
      },
      fontSize: {
        h1: ["2rem", { lineHeight: "3rem" }],
        h2: ["1.75rem", { lineHeight: "2.625rem" }],
        h3: ["1.5rem", { lineHeight: "2.25rem" }],
        h4: ["1.25rem", { lineHeight: "1.25rem" }],
        h5: ["1.125rem", { lineHeight: "1.75rem" }],
        p1: ["1rem", { lineHeight: "1.5rem" }],
        p2: ["0.875rem", { lineHeight: "1.375rem" }],
        p3: ["0.75rem", { lineHeight: "1.125rem" }],
        p4: ["0.625rem", { lineHeight: "0.9375rem" }],
        button: ["0.875rem", { lineHeight: "1.375rem" }],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [forms, aspectRatio],
}

