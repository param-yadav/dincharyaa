
# Dincharya - Development Guide

## Project Overview
Dincharya is a task management application inspired by traditional Indian daily routines. The app helps users organize their daily tasks, set reminders, and track their productivity in a visually appealing interface that draws inspiration from Madhubani art and traditional Indian color palettes.

## Technology Stack
- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **State Management**: React Context API, React Query
- **Routing**: React Router
- **Backend**: Supabase (for future integration)

## Project Structure
```
src/
├── components/           # Reusable components
│   ├── home/             # Homepage-specific components
│   ├── layout/           # Layout components (Header, Footer, Sidebar)
│   ├── tasks/            # Task-related components
│   └── ui/               # UI components from shadcn
├── constants/            # Application constants
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and libraries
├── pages/                # Page components
├── integrations/         # External integrations (e.g., Supabase)
└── App.tsx               # Main application component
```

## Design Principles

### Visual Design
- Draw inspiration from Madhubani art style
- Use warm, earthy color palette with vibrant accents
- Incorporate traditional Indian patterns subtly
- Maintain clean, modern UI while honoring cultural roots

### Code Architecture
- **Component-Based Design**: Create small, focused, reusable components
- **Separation of Concerns**: Keep UI, logic, and data access separate
- **DRY Principle**: Don't repeat code, extract common functionality
- **Responsive Design**: Ensure good experience on all devices

## Development Roadmap

### Phase 1: Core Functionality (Current)
- Basic task management (create, view, update, delete tasks)
- Task list and calendar views
- Responsive layout with sidebar navigation
- Static pages (Home, About, Contact, Terms, etc.)

### Phase 2: User Authentication
- Implement Supabase authentication
- User profile creation and management
- Personalized task lists and settings

### Phase 3: Advanced Features
- Task categories and tags
- Priority management
- Time tracking
- Team collaboration
- Notifications and reminders

### Phase 4: Analytics and Insights
- Progress tracking
- Productivity analytics
- Reports and data visualization
- AI-powered suggestions for productivity

## Coding Standards

### General Guidelines
- Use TypeScript for type safety
- Follow consistent naming conventions
- Write clear, descriptive comments
- Create small, focused files rather than large ones

### Component Structure
- Each component should have a single responsibility
- Extract reusable logic into custom hooks
- Group related components in dedicated folders
- Use TypeScript interfaces for props

### State Management
- Use React Query for server state
- Use React Context for global application state
- Use component state for local UI state

### Styling Guidelines
- Use Tailwind CSS for styling
- Create reusable utility classes for common styles
- Follow color variables defined in theme.ts
- Ensure responsive design for all components

## Best Practices

### Performance Optimization
- Lazy load components when possible
- Optimize images and assets
- Minimize unnecessary re-renders
- Use memoization for expensive computations

### Accessibility
- Use semantic HTML elements
- Include proper ARIA attributes
- Ensure keyboard navigation
- Test with screen readers

### Testing
- Write unit tests for utility functions
- Write component tests for UI components
- Perform manual testing on different devices
- Test for accessibility compliance

## Git Workflow
- Feature branches for new functionality
- Pull requests for code review
- Semantic commit messages
- Regular merges to maintain codebase synchronization

## Deployment Strategy
- Continuous Integration with automated tests
- Staging environment for pre-release testing
- Production deployment with versioning
- Monitoring and error tracking

---

This guide serves as a living document and will be updated as the project evolves. Contributors should refer to this guide to maintain consistency and quality throughout the development process.
