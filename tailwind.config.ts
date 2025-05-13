
import type { Config } from "tailwindcss";
import { DINCHARYA_COLORS } from "./src/constants/theme";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				poppins: ['Poppins', 'sans-serif'],
				opensans: ['Open Sans', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				dincharya: {
					primary: DINCHARYA_COLORS.primary,
					secondary: DINCHARYA_COLORS.secondary,
					accent: DINCHARYA_COLORS.accent,
					background: DINCHARYA_COLORS.background,
					text: DINCHARYA_COLORS.text,
					muted: DINCHARYA_COLORS.muted,
					border: DINCHARYA_COLORS.border,
					darkAccent: DINCHARYA_COLORS.darkAccent,
					error: DINCHARYA_COLORS.error,
					success: DINCHARYA_COLORS.success,
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				madhubani: {
					red: '#E83A3A',
					blue: '#2F4F88',
					yellow: '#FFCA28',
					green: '#4CAF50',
					orange: '#FF9800',
					brown: '#8D6E63',
					black: '#212121',
					white: '#FFFFFF',
				},
				priority: {
					low: '#4CAF50',
					medium: '#FF9800',
					high: '#E83A3A',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'border-dance': {
					'0%, 100%': {
						backgroundPosition: '0% 50%'
					},
					'50%': {
						backgroundPosition: '100% 50%'
					}
				},
				'float': {
					'0%, 100%': {
						transform: 'translateY(0)'
					},
					'50%': {
						transform: 'translateY(-10px)'
					}
				},
				'fade-in': {
					from: { opacity: '0' },
					to: { opacity: '1' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'border-dance': 'border-dance 3s ease infinite',
				'float': 'float 6s ease-in-out infinite',
				'fade-in': 'fade-in 0.5s ease-out forwards'
			},
			backgroundImage: {
				'madhubani-pattern': "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNDB2NDBoLTQweiIvPjxwYXRoIGQ9Ik0xMCAxMGMwLTIuNzYgMi4yNC01IDUtNXM1IDIuMjQgNSA1LTIuMjQgNS01IDUtNS0yLjI0LTUtNXptMTUgMTBjMC0yLjc2IDIuMjQtNSA1LTVzNSAyLjI0IDUgNS0yLjI0IDUtNSA1LTUtMi4yNC01LTV6bS0xNSAxMGMwLTIuNzYgMi4yNC01IDUtNXM1IDIuMjQgNSA1LTIuMjQgNS01IDUtNS0yLjI0LTUtNXoiIHN0cm9rZT0icmdiYSgwLDAsMCwwLjEpIiBzdHJva2Utd2lkdGg9IjEuNSIvPjwvZz48L3N2Zz4=')",
				'dincharya-pattern': "url('/patterns/dincharya-pattern.svg')",
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
