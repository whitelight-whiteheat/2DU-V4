# 2DU - Task Management App

A modern, responsive task management application built with React, TypeScript, and Material-UI.

## Features

- 📱 Responsive design with collapsible sidebar
- 🌓 Dark/Light mode support
- 🔐 User authentication
- 📅 Multiple views (Today, Upcoming, Calendar, Tags, Completed)
- 🎨 Beautiful Material-UI components
- 📦 Drag and drop task reordering
- 🏷️ Tag-based task organization
- 📝 Rich task details (title, description, due date, tags)

## Tech Stack

- React
- TypeScript
- Material-UI
- React Router
- React Beautiful DnD
- Date-fns

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/2du.git
cd 2du
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
yarn start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── components/
│   ├── routes/         # Route components
│   ├── AuthForm.tsx    # Authentication form
│   ├── Sidebar.tsx     # Navigation sidebar
│   ├── TaskList.tsx    # Task list component
│   └── TaskModal.tsx   # Task creation/editing modal
├── contexts/
│   └── AuthContext.tsx # Authentication context
├── types.ts           # TypeScript interfaces
└── App.tsx           # Main application component
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
