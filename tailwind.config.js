/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Nötr ve modern renk paleti
        page: '#FFFFFF',
        surface: '#F9FAFB',
        subtle: '#F3F4F6',
        divider: '#E5E7EB',
        
        // Metin renkleri
        'text-primary': '#111827',
        'text-secondary': '#4B5563',
        'text-muted': '#6B7280',
        
        // Aksan renkleri (daha yumuşak tonlar)
        'primary-accent': '#6366F1', // Mor-mavi tonu
        'success': '#10B981',
        'warning': '#F59E0B',
        'danger': '#EF4444',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif']
      },
      fontSize: {
        'h1': ['24px', { lineHeight: '1.4', fontWeight: '600' }],
        'h2': ['20px', { lineHeight: '1.4', fontWeight: '600' }],
        'body': ['16px', { lineHeight: '1.6' }],
        'meta': ['12px', { lineHeight: '1.4', fontWeight: '500' }]
      },
      boxShadow: {
        'sm': '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      },
      borderRadius: {
        'card': '12px'
      },
      spacing: {
        '4xs': '4px',
        '3xs': '8px',
        '2xs': '12px',
        'xs': '16px',
        'sm': '24px',
        'md': '32px',
        'lg': '48px'
      },
      transitionProperty: {
        'colors-all': 'color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform'
      }
    },
  },
  plugins: [],
}

