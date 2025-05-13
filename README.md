
# Dincharya - Daily Task Management

![Dincharya Logo](/lovable-uploads/7b9e64ad-467b-4f8e-b543-70e78e2ceb8a.png)

Dincharya is a beautiful task management application inspired by traditional Indian daily routines, helping users organize their time effectively and boost productivity.

## Features

- **Task Management**: Create, organize, and prioritize your daily tasks
- **Calendar View**: Visualize your tasks in an intuitive calendar interface
- **Time Tracking**: Monitor how you spend your time (coming soon)
- **Task Reminders**: Never miss important deadlines (coming soon)
- **Team Collaboration**: Share tasks with your team (coming soon)
- **Beautiful UI**: Inspired by Madhubani art and traditional Indian design

## Getting Started

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd dincharya

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Usage

1. Open your browser and navigate to `http://localhost:5173`
2. Explore the different features of the application:
   - View and manage tasks in the Tasks page
   - Switch between list and calendar views
   - Create new tasks using the task form

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
└── integrations/         # External integrations (e.g., Supabase)
```

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **State Management**: React Context API, React Query
- **Routing**: React Router
- **Backend**: Supabase (for future integration)

## Development

See [DEVELOPMENT.md](./DEVELOPMENT.md) for detailed development guidelines, coding standards, and project roadmap.

## Contributing

We welcome contributions to Dincharya! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Design inspiration from traditional Madhubani art
- Icons from Lucide React
- UI components from Shadcn/ui

## Contact

For any questions or feedback, please reach out to support@dincharya.com or open an issue on GitHub.

---

**URL**: https://lovable.dev/projects/397bb586-9351-4bf3-acbf-8b423c54f03d
