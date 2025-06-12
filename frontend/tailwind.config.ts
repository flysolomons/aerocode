import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			sans: 'var(--font-inter)',
  			mono: 'var(--font-rubik)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			refx: '#F2F2FF',
  			black: '#222222',
  			'gray-50': '#F9FAFB',
  			'gray-100': '#F3F4F6',
  			'gray-200': '#E5E7EB',
  			'gray-300': '#D2D5DA',
  			'gray-400': '#9CA3AF',
  			'gray-500': '#6D7280',
  			'gray-600': '#4B5563',
  			'gray-700': '#374151',
  			'gray-800': '#1F2937',
  			'gray-900': '#111827',
  			'blue-50': '#E4E4F6',
  			'blue-100': '#C6C5EC',
  			'blue-200': '#8D8CD9',
  			'blue-300': '#5452C6',
  			'blue-400': '#343399',
  			'blue-500': '#212061',
  			'blue-600': '#1A194D',
  			'blue-700': '#14133A',
  			'blue-800': '#0D0D26',
  			'blue-900': '#070613',
  			'yellow-50': '#FFF8E6',
  			'yellow-100': '#FEF2D2',
  			'yellow-200': '#FDE6A5',
  			'yellow-300': '#FDD873',
  			'yellow-400': '#FCCB46',
  			'yellow-500': '#FBBE18',
  			'yellow-600': '#D89F04',
  			'yellow-700': '#A07603',
  			'yellow-800': '#6E5102',
  			'yellow-900': '#372901',
  			'green-50': '#F7FDF7',
  			'green-100': '#F4FCF2',
  			'green-200': '#E4F9E2',
  			'green-300': '#D9F6D5',
  			'green-400': '#CAF2C4',
  			'green-500': '#BDEFB6',
  			'green-600': '#7EE071',
  			'green-700': '#41D12E',
  			'green-800': '#2B8A1E',
  			'green-900': '#164710',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
