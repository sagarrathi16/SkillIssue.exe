/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          950: '#070a12',
          900: '#0B0F19',
          850: '#111827',
          800: '#1F2937',
        }
      },
      fontFamily: {
        mono: ['Fira Code', 'JetBrains Mono', 'Courier New', 'monospace'],
        sans: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        pixel: ['"Press Start 2P"', 'monospace'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      boxShadow: {
        'neo': '3px 3px 0px #000000',
        'neo-lg': '5px 5px 0px #000000',
        'neo-xl': '8px 8px 0px #000000',
        'neo-yellow': '4px 4px 0px #FACC15',
        'neo-rose': '4px 4px 0px #F43F5E',
        'neo-cyan': '4px 4px 0px #06B6D4',
      },
      animation: {
        'tremor-mild': 'tremorMild 0.4s ease-in-out infinite',
        'tremor-strong': 'tremorStrong 0.2s ease-in-out infinite',
        'subtle-pulse': 'subtlePulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        tremorMild: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-0.75deg) translate(-1px, 0.5px)' },
          '75%': { transform: 'rotate(0.75deg) translate(1px, -0.5px)' },
        },
        tremorStrong: {
          '0%, 100%': { transform: 'rotate(0deg) translate(0, 0)' },
          '20%': { transform: 'rotate(-2deg) translate(-2px, 1px)' },
          '40%': { transform: 'rotate(1.5deg) translate(2px, -1px)' },
          '60%': { transform: 'rotate(-1.5deg) translate(-1px, -1px)' },
          '80%': { transform: 'rotate(2deg) translate(1px, 2px)' },
        },
        subtlePulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        }
      }
    },
  },
  plugins: [],
}

