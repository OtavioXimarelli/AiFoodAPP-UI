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
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					hover: 'hsl(var(--primary-hover))'
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
				'fadeIn': {
					from: {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					to: {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'slideUp': {
					from: {
						transform: 'translateY(20px)',
						opacity: '0'
					},
					to: {
						transform: 'translateY(0)',
						opacity: '1'
					}
				},
				'slideInLeft': {
					from: {
						transform: 'translateX(-20px)',
						opacity: '0'
					},
					to: {
						transform: 'translateX(0)',
						opacity: '1'
					}
				},
				'scaleIn': {
					from: {
						transform: 'scale(0.9)',
						opacity: '0'
					},
					to: {
						transform: 'scale(1)',
						opacity: '1'
					}
				},
				'float': {
					'0%, 100%': {
						transform: 'translateY(0px)'
					},
					'50%': {
						transform: 'translateY(-10px)'
					}
				},
				'shimmer': {
					'0%': {
						backgroundPosition: '-200% 0'
					},
					'100%': {
						backgroundPosition: '200% 0'
					}
				},
				'gentle-bounce': {
					'0%, 100%': {
						transform: 'translateY(0)'
					},
					'50%': {
						transform: 'translateY(-4px)'
					}
				},
				'pulse-glow': {
					'0%, 100%': {
						boxShadow: '0 0 20px hsl(var(--primary) / 0.1)'
					},
					'50%': {
						boxShadow: '0 0 30px hsl(var(--primary) / 0.25)'
					}
				},
				'slide-in-right': {
					'0%': {
						transform: 'translateX(100%)',
						opacity: '0'
					},
					'100%': {
						transform: 'translateX(0)',
						opacity: '1'
					}
				},
				'fade-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(16px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'zoom-in': {
					'0%': {
						opacity: '0',
						transform: 'scale(0.95)'
					},
					'100%': {
						opacity: '1',
						transform: 'scale(1)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fadeIn 0.5s ease-out',
				'slide-up': 'slideUp 0.3s ease-out',
				'slide-in-left': 'slideInLeft 0.4s ease-out',
				'scale-in': 'scaleIn 0.3s ease-out',
				'float': 'float 3s ease-in-out infinite',
				'shimmer': 'shimmer 2s ease-in-out infinite',
				'gentle-bounce': 'gentle-bounce 2s ease-in-out infinite',
				'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
				'slide-in-right': 'slide-in-right 0.4s ease-out',
				'fade-up': 'fade-up 0.6s ease-out',
				'zoom-in': 'zoom-in 0.3s ease-out'
			},
			backgroundImage: {
				'gradient-primary': 'var(--gradient-primary)',
				'gradient-secondary': 'var(--gradient-secondary)',
				'gradient-accent': 'var(--gradient-accent)',
				'gradient-hero': 'var(--gradient-hero)',
				'gradient-card': 'var(--gradient-card)'
			},
			boxShadow: {
				'soft': 'var(--shadow-soft)',
				'card': 'var(--shadow-card)',
				'glow': 'var(--shadow-glow)',
				'hover': 'var(--shadow-hover)',
				'orange': 'var(--shadow-orange)'
			},
			transitionTimingFunction: {
				'smooth': 'var(--transition-smooth)',
				'spring': 'var(--transition-spring)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
