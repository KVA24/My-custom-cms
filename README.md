# Admin Dashboard Template

A modern, responsive admin dashboard template built with React 19+, TypeScript, Vite 6+, and MobX for state management.

## Features

- ⚡ **Modern Stack**: React 19+, TypeScript, Vite 6+
- 🎨 **Responsive Design**: Mobile-first approach with Tailwind CSS
- 🌐 **Internationalization**: Multi-language support (English, Vietnamese)
- 🔐 **Authentication**: Login/Register with form validation
- 📊 **State Management**: MobX for reactive state management
- 🧭 **Routing**: React Router DOM with protected routes
- 🌙 **Dark Mode**: Light/Dark/System theme support
- 📱 **Mobile Friendly**: Collapsible sidebar and responsive layout
- 🎯 **Form Validation**: Yup schema validation
- 🔔 **Notifications**: React Toastify for user feedback
- 💡 **Tooltips**: React Tooltip for enhanced UX
- 📋 **Rich Components**: Tables, forms, galleries, cards, and more

## Tech Stack

- **Frontend**: React 19+, TypeScript
- **Build Tool**: Vite 6+
- **Styling**: Tailwind CSS
- **State Management**: MobX
- **Routing**: React Router DOM
- **Form Validation**: Yup
- **Internationalization**: react-i18next
- **Notifications**: react-toastify
- **Tooltips**: react-tooltip
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd admin-dashboard-template
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
# or
yarn install
\`\`\`

3. Start the development server:
\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

4. Open your browser and navigate to `http://localhost:3000`

### Default Login Credentials

- **Email**: admin@example.com
- **Password**: password

## Project Structure

\`\`\`
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components (Button, Input, etc.)
│   ├── layout/         # Layout components (Header, Sidebar)
│   └── common/         # Common components (ErrorBoundary, etc.)
├── pages/              # Page components
│   ├── auth/           # Authentication pages
│   ├── dashboard/      # Dashboard pages
│   ├── users/          # User management pages
│   ├── products/       # Product management pages
│   └── examples/       # Example/demo pages
├── stores/             # MobX stores
├── i18n/               # Internationalization config
├── schemas/            # Validation schemas
├── lib/                # Utility functions
└── main.tsx           # Application entry point
\`\`\`

## Key Features

### Authentication System
- Login and registration forms with validation
- Protected routes
- Persistent authentication state
- Mock API integration ready

### Responsive Layout
- Collapsible sidebar navigation
- Multi-level menu support (up to 3 levels)
- Mobile-optimized header and navigation
- Dark/Light theme toggle

### State Management
- MobX stores for reactive state management
- Authentication store
- Navigation store
- Theme store
- Language store

### Internationalization
- English and Vietnamese translations
- Easy to add more languages
- Language switcher in header
- Persistent language preference

### UI Components
- Data tables with sorting and filtering
- Form components with validation
- Image gallery with modal view
- Cards and statistics displays
- Loading states and error handling

## Customization

### Adding New Languages

1. Add translations to `src/i18n/config.ts`:
\`\`\`typescript
const resources = {
  en: { translation: { ... } },
  vi: { translation: { ... } },
  // Add your language here
  fr: { translation: { ... } }
}
\`\`\`

2. Update the language store in `src/stores/languageStore.ts`:
\`\`\`typescript
availableLanguages: Language[] = [
  // ... existing languages
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" }
]
\`\`\`

### Adding New Pages

1. Create your page component in the appropriate directory under `src/pages/`
2. Add the route to `src/components/layout/AppLayout.tsx`
3. Add menu item to `src/stores/navigationStore.ts`
4. Add translations for the new page

### Customizing Theme

The theme is configured in `src/index.css` using CSS custom properties. You can customize colors, spacing, and other design tokens there.

### API Integration

The template includes mock authentication. To integrate with a real API:

1. Update the authentication methods in `src/stores/authStore.ts`
2. Replace mock API calls with real HTTP requests
3. Update error handling as needed

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Lucide](https://lucide.dev/) for the beautiful icons
- [MobX](https://mobx.js.org/) for reactive state management
- [React Router](https://reactrouter.com/) for routing
- [Vite](https://vitejs.dev/) for the fast build tool
