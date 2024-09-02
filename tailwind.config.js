/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        satoshi: ["Satoshi", "sans-serif"],
      },
    },
    screens: {
      xs: "375px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      custom: "1023px",
    },
    fontSize: {
      head1: [
        "56px",
        {
          lineHeight: "64px",
          fontWeight: "700",
        },
      ],
      head2: [
        "36px",
        {
          lineHeight: "44px",
          fontWeight: "700",
        },
      ],
      head3: [
        "24px",
        {
          lineHeight: "32px",
          fontWeight: "700",
        },
      ],
      head4: [
        "20px",
        {
          lineHeight: "28px",
          fontWeight: "700",
        },
      ],
      body1: [
        "18px",
        {
          lineHeight: "26px",
          fontWeight: "500",
        },
      ],
      body2: [
        "16px",
        {
          lineHeight: "28px",
          fontWeight: "500",
        },
      ],
      body3: [
        "14px",
        {
          lineHeight: "24px",
          fontWeight: "500",
        },
      ],
      display: [
        "88px",
        {
          lineHeight: "96px",
          fontWeight: "900",
        },
      ],
    },
    colors: {
      gray: {
        100: "#F6F6F9",
        200: "#DCDFED",
        300: "#AEB1C3",
        400: "#7B7E8F",
        500: "#5B5D6F",
        600: "#3A3B46",
      },
      orange: {
        100: "#FFF1EC",
        200: "#FFD5C2",
        300: "#FFB899",
        400: "#FF986F",
        500: "#FF7037",
        600: "#E44A0C",
      },
      green: {
        100: "#E7FDF4",
        500: "#1CCD83",
      },
      yellow: {
        100: "#FFF5EC",
        500: "#FFCA62",
      },
      blue: {
        100: "#ECFBFF",
        500: "#76D0FC",
      },
      pink: {
        100: "#FFF0F1",
        500: "#FA8AC0",
      },
      red: "#EA1010",
      white: "#FFFFFF",
      black: "#000000",
    },
  },
  plugins: [require("daisyui")],
};
