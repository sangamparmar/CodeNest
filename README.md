<div align="center">

# 🪺 CodeNest

<img src="/placeholder.svg?height=200&width=200" alt="CodeNest Logo" style="margin-bottom: 20px"/>

### *Where Code Collaboration Takes Flight*

[![Live Demo](https://img.shields.io/badge/LIVE-DEMO-brightgreen?style=for-the-badge)](https://codenest.vercel.app)
[![GitHub Stars](https://img.shields.io/github/stars/yourusername/codenest?style=for-the-badge&color=yellow)](https://github.com/yourusername/codenest/stargazers)
[![License](https://img.shields.io/badge/LICENSE-MIT-blue?style=for-the-badge)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-WELCOME-brightgreen?style=for-the-badge)](CONTRIBUTING.md)

*A collaborative, real-time code editor where multiple developers can seamlessly work together on the same codebase.*

</div>

---

## 🌟 Overview

**CodeNest** creates a digital sanctuary for developers to collaborate in real-time. Multiple users can join a shared workspace using a unique room ID and work simultaneously on code with instant synchronization. Whether you're pair programming, teaching, or collaborating on a project, CodeNest provides the ideal environment with comprehensive language support and integrated communication tools.

<div align="center">
<img src="/placeholder.svg?height=400&width=800" alt="CodeNest Interface" style="border-radius: 10px; margin: 20px 0; box-shadow: 0 5px 15px rgba(0,0,0,0.2);"/>
</div>

## ✨ Key Features

### 🤝 Collaboration Tools
| Feature | Description |
|---------|-------------|
| 💻 **Real-time Code Editing** | Collaborate on code across multiple files with instant synchronization |
| 📁 **File Management** | Create, open, edit, save, delete, and organize files and folders |
| 💾 **Export Options** | Download the entire codebase as a zip file |
| 🚀 **Room System** | Generate unique room IDs for secure collaboration sessions |

### 🛠️ Development Experience
| Feature | Description |
|---------|-------------|
| 🌍 **Language Support** | Comprehensive language support for versatile programming |
| 🌈 **Syntax Highlighting** | Automatic language detection and highlighting for various file types |
| 🚀 **Code Execution** | Run code directly within the collaboration environment |
| 💡 **Auto Suggestions** | Intelligent code suggestions based on programming language |

### 👥 User Experience
| Feature | Description |
|---------|-------------|
| 👥 **User Presence** | See who's currently in the session with online/offline status indicators |
| 🎩 **Editing Tooltips** | Real-time tooltips showing which users are currently editing |
| 💬 **Group Chat** | Communicate in real-time while working on code |
| 🎨 **Collaborative Drawing** | Draw and sketch together to explain concepts visually |
| 🎭 **Customization** | Change font size, font family, and choose from multiple themes |

### 🔐 Security & Administration
| Feature | Description |
|---------|-------------|
| 🔒 **Secure Authentication** | Email-based OTP verification during signup |
| 👑 **Admin Controls** | Room creators have special privileges to manage access and permissions |
| 🤖 **AI Assistant** | Integrated AI helper for coding tasks and programming questions |

## 🚀 Live Preview

<div align="center">

[![Live Demo](https://img.shields.io/badge/EXPERIENCE-CODENEST-brightgreen?style=for-the-badge&color=4F46E5)](https://codenest.vercel.app)

</div>

## 💻 Tech Stack

<div align="center">

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

</div>

## ⚙️ Installation

<details>
<summary>Click to expand installation instructions</summary>

1. **Fork this repository**
   - Click the Fork button located in the top-right corner of this page to fork the repository.

2. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/<your-username>/CodeNest.git
   \`\`\`

3. **Set .env file**
   - Inside the client and server directories rename the `.env.example` file to `.env` and set the following environment variables:

   Frontend (client/.env):
   \`\`\`
   VITE_BACKEND_URL=<your_server_url>
   \`\`\`

   Backend (server/.env):
   \`\`\`
   PORT=3000
   MONGO_URI=<your_mongodb_connection_string>
   \`\`\`

4. **Install dependencies**
   \`\`\`bash
   # Install frontend dependencies
   cd client
   npm install

   # Install backend dependencies
   cd ../server
   npm install
   \`\`\`

5. **Start the frontend and backend servers**
   \`\`\`bash
   # Start frontend
   cd client
   npm run dev

   # Start backend
   cd ../server
   npm run dev
   \`\`\`

6. **Run Tests**
   \`\`\`bash
   # Run frontend tests
   cd client
   npm test

   # Run backend tests
   cd ../server
   npm test
   \`\`\`

7. **Access the application**
   - Open your browser and navigate to: `http://localhost:5173/`

</details>

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

1. Fork the repository and create your branch from `main`
2. Make your changes and ensure the code follows the project's style
3. Run tests to ensure your changes don't break existing functionality
4. Submit a pull request with a comprehensive description of changes

## 🔮 Future Roadmap

<div align="center">

| Feature | Description | Status |
|---------|-------------|--------|
| 👑 **Enhanced Admin System** | Robust admin permission system to manage user access levels | Planned |
| 🤖 **AI Improvements** | Expand AI assistant capabilities with more language-specific features | In Progress |
| 📊 **Version Control** | Integration with Git and other version control systems | Planned |
| 🚀 **Advanced Execution** | Support for more programming languages and execution environments | Planned |
| 📱 **Mobile Support** | Responsive design for coding on tablets and mobile devices | Planned |

</div>

## 📝 License

This project is licensed under the [MIT License](LICENSE).

<div align="center">
<img src="/placeholder.svg?height=100&width=100" alt="CodeNest Small Logo" style="margin: 20px 0"/>

<h3>🪺 CodeNest: Elevate Your Collaborative Coding Experience</h3>

<sub>Built with ❤️ by developers, for developers</sub>
</div>
