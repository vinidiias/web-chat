# Web Chat Application

A modern, real-time chat application built with Next.js and Socket.io, featuring public chat rooms and private messaging capabilities.

## Features

### Core Features
- **Real-time Messaging** - Instant message delivery using Socket.io
- **Public Chat** - Join a shared chat room with all active users
- **Private Messaging** - Send direct messages to specific users
- **User Authentication** - Simple cookie-based authentication system
- **Profile Photos** - Upload and display user profile pictures
- **Active Users List** - See all currently connected users
- **Typing Indicators** - Know when other users are typing
- **Dark/Light Theme** - Toggle between dark and light modes with system preference support

### UI/UX Features
- Responsive design with mobile support
- Modern UI using shadcn/ui components
- Smooth animations and transitions
- Persistent theme preferences
- Message timestamps
- User avatars in chat

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Re-usable component library
- **next-themes** - Theme management

### Backend
- **Node.js** - JavaScript runtime
- **Socket.io** - Real-time bidirectional communication
- **Next.js API** - Serverless functions

### Additional Libraries
- **Radix UI** - Headless UI components
- **Lucide React** - Icon library
- **js-cookie** - Cookie management
- **class-variance-authority** - CSS variant management

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd web-chat
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. In a separate terminal, start the Socket.io server:
```bash
npm run server
```

5. Open your browser and navigate to:
```
http://localhost:3000
```

The Socket.io server will run on `http://localhost:3001`

## Project Structure

```
web-chat/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── @types/              # TypeScript type definitions
│   │   │   ├── AuthDTO.ts
│   │   │   ├── MessageDTO.ts
│   │   │   ├── TypingDTO.ts
│   │   │   └── UserDTO.ts
│   │   ├── auth/                # Authentication page
│   │   ├── components/          # React components
│   │   │   ├── layout/         # Layout components (Header, Sidebar)
│   │   │   ├── pages/          # Page-specific components
│   │   │   └── ui/             # UI components (ModeToggle)
│   │   ├── context/            # React Context providers
│   │   ├── hooks/              # Custom React hooks
│   │   ├── providers/          # App-level providers
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page (main chat)
│   │   └── globals.css         # Global styles
│   ├── components/ui/           # shadcn/ui components
│   ├── hooks/                   # Shared hooks
│   ├── lib/                     # Utility functions
│   ├── middleware.ts            # Next.js middleware for auth
│   └── socket.ts                # Socket.io client configuration
├── server.ts                    # Socket.io server
├── next.config.ts              # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
└── package.json                # Project dependencies
```

## Usage

### First Time Setup

1. Navigate to the authentication page (automatic redirect if not logged in)
2. Enter your username (max 20 characters)
3. Upload a profile picture (.jpg, .jpeg, or .png)
4. Click "Join" to enter the chat

### Using the Chat

**Public Chat:**
- Messages sent in the main chat are visible to all users
- Active users appear in the sidebar
- Click the sidebar toggle to show/hide the user list

**Private Messages:**
- Click on a user in the sidebar to start a private conversation
- Private messages are only visible to you and the selected user
- Click "Back to Public Chat" to return to the main room

**Other Features:**
- Toggle theme using the sun/moon icon in the header
- See typing indicators when other users are typing
- Messages show timestamps
- Click the logout button to sign out

## Configuration

### Environment Variables
The application uses the following configuration:

**Server Port:** `3001` (defined in `server.ts:36`)
**Client Port:** `3000` (Next.js default)

To change the server port, modify `server.ts`:
```typescript
const port = 3001; // Change this value
```

And update the socket connection in `src/socket.ts`:
```typescript
export const socket = io("http://localhost:3001", {
  autoConnect: true,
});
```

### Authentication
The app uses cookie-based authentication with:
- `authToken` - Authentication status
- `username` - User's display name
- Profile photos stored in `localStorage`

Cookies expire after 7 days.

## Scripts

```bash
# Development
npm run dev          # Start Next.js development server
npm run server       # Start Socket.io server

# Production
npm run build        # Build for production
npm start           # Start production server

# Linting
npm run lint        # Run ESLint
```

## Socket.io Events

### Client → Server
- `join` - User joins the chat
- `sendMessage` - Send a public message
- `sendPrivateMessage` - Send a private message to specific user
- `typing` - Emit typing status
- `disconnect` - User disconnects

### Server → Client
- `message` - Receive public message
- `privateMessage` - Receive private message
- `activeUsers` - Updated list of active users
- `userJoined` - Notification when user joins
- `userLeft` - Notification when user leaves
- `typing` - Typing indicator from other users

## Data Types

### UserDTO
```typescript
{
  id?: string;        // Socket ID
  username: string;   // Display name
  photo: string;      // Base64 encoded image
}
```

### MessageDTO
```typescript
{
  type: "message" | "notification" | "private";
  username: string;
  photo: string;
  content: string;
  timestamp: number;
  senderId?: string;      // For private messages
  recipientId?: string;   // For private messages
}
```

### TypingDTO
```typescript
{
  username: string;
  photo: string;
  isTyping: boolean;
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Real-time communication powered by [Socket.io](https://socket.io/)
