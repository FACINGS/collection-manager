/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx}",
        "./src/components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#111',
                secondary: '#0070f3',
                black: '#000',
                white: '#fff',
            },
            spacing: {
                sm: '0.5rem',
                md: '1rem',
                lg: '1.5rem',
                xl: '2rem',
            },
            fontFamily: {
                'sans': ['Poppins', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
