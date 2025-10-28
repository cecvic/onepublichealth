import type { Config } from "tailwindcss";

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
			padding: {
				DEFAULT: '1rem',
				sm: '1.5rem',
				lg: '2rem',
			},
			screens: {
				'2xl': '1200px'  // Match design system max-width
			}
		},
		extend: {
			// Font family
			fontFamily: {
				sans: ['Raleway', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
			},

			// Brand colors from logo
			colors: {
				brand: {
					green: 'hsl(var(--brand-green))',
					'green-hover': 'hsl(var(--brand-green-hover))',
					'green-light': 'hsl(var(--brand-green-light))',
					blue: 'hsl(var(--brand-blue))',
					'blue-hover': 'hsl(var(--brand-blue-hover))',
					'blue-light': 'hsl(var(--brand-blue-light))',
					'blue-sky': 'hsl(var(--brand-blue-sky))',
					charcoal: 'hsl(var(--brand-charcoal))',
					'charcoal-dark': 'hsl(var(--brand-charcoal-dark))',
				},
				neutral: {
					white: 'hsl(var(--neutral-white))',
					50: 'hsl(var(--neutral-gray-50))',
					100: 'hsl(var(--neutral-gray-100))',
					400: 'hsl(var(--neutral-gray-400))',
					700: 'hsl(var(--neutral-gray-700))',
					900: 'hsl(var(--neutral-gray-900))',
				},
				semantic: {
					success: 'hsl(var(--semantic-success))',
					info: 'hsl(var(--semantic-info))',
					warning: 'hsl(var(--semantic-warning))',
					error: 'hsl(var(--semantic-error))',
				},
				// Shadcn/UI compatibility
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
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
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				}
			},

			// Typography scale
			fontSize: {
				'display': 'var(--font-display)',
				'h1': 'var(--font-h1)',
				'h2': 'var(--font-h2)',
				'h3': 'var(--font-h3)',
				'h4': 'var(--font-h4)',
				'h5': 'var(--font-h5)',
				'body-lg': 'var(--font-body-lg)',
				'body': 'var(--font-body)',
				'body-sm': 'var(--font-body-sm)',
				'caption': 'var(--font-caption)',
			},

			// Font weights
			fontWeight: {
				light: 'var(--font-light)',
				regular: 'var(--font-regular)',
				medium: 'var(--font-medium)',
				semibold: 'var(--font-semibold)',
				bold: 'var(--font-bold)',
				extrabold: 'var(--font-extrabold)',
			},

			// Line heights
			lineHeight: {
				tight: 'var(--leading-tight)',
				normal: 'var(--leading-normal)',
				relaxed: 'var(--leading-relaxed)',
				loose: 'var(--leading-loose)',
			},

			// Spacing scale (8px base)
			spacing: {
				'xs': 'var(--space-xs)',
				'sm': 'var(--space-sm)',
				'md': 'var(--space-md)',
				'lg': 'var(--space-lg)',
				'xl': 'var(--space-xl)',
				'2xl': 'var(--space-2xl)',
				'3xl': 'var(--space-3xl)',
				'4xl': 'var(--space-4xl)',
			},

			// Border radius
			borderRadius: {
				'sm': 'var(--radius-sm)',
				'md': 'var(--radius-md)',
				'lg': 'var(--radius-lg)',
				'pill': 'var(--radius-pill)',
				DEFAULT: 'var(--radius)',
			},

			// Shadows
			boxShadow: {
				'subtle': 'var(--shadow-subtle)',
				'card': 'var(--shadow-card)',
				'elevated': 'var(--shadow-elevated)',
				'modal': 'var(--shadow-modal)',
			},

			// Transitions
			transitionDuration: {
				'fast': 'var(--transition-fast)',
				'base': 'var(--transition-base)',
				'slow': 'var(--transition-slow)',
			},

			// Animations
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					from: { opacity: '0' },
					to: { opacity: '1' }
				},
				'slide-up': {
					from: { transform: 'translateY(10px)', opacity: '0' },
					to: { transform: 'translateY(0)', opacity: '1' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'slide-up': 'slide-up 0.3s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
