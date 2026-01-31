# 🎮 Anime Goal & Activity Tracker

A beautiful, highly animated, anime-style Goal & Activity Tracker Web App that makes tracking your goals addictive and fun! Built with Next.js, React, Framer Motion, and MongoDB.

![Anime Goal Tracker](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-6-green?style=for-the-badge&logo=mongodb)

## ✨ Features

### 🔐 Authentication
- Secure user authentication with JWT
- Sign up, login, and logout functionality
- Persistent user sessions
- Protected routes

### 🎯 Goal System
- Create multiple goals (daily, weekly, custom)
- Set target values with custom units (hours, tasks, steps, etc.)
- Track daily progress
- Visual progress indicators
- Overachiever detection with special animations

### 📅 Calendar Heatmap
- Beautiful animated calendar view
- Color-coded progress levels:
  - 🔴 Poor day
  - 🟡 Average day
  - 🟢 Good day
  - 🔥 Legendary day
- Hover tooltips with detailed information
- Last 30 days visualization

### 🏆 Reward System
- Hidden rewards that unlock based on achievements
- Random surprise rewards
- Unlock conditions:
  - Streak milestones (3, 7, 30 days)
  - Overachieving goals (150%+)
  - Perfect weeks
  - Time-based rewards (early bird, night owl)
- Cinematic unlock animations with confetti
- Locked rewards UI with mystery blur

### 🎨 Anime-Level Animations
- Smooth page transitions
- Button hover effects
- Card float animations
- Progress bars with easing
- Calendar day pop animations
- Reward unlock cinematic animations
- Glassmorphism UI
- Neon gradients
- Dark mode with glow effects

### 📱 Responsive Design
- Fully responsive for mobile, tablet, and desktop
- Mobile-first approach
- Touch-friendly interactions

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB instance (local or cloud)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   cd Task_tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   MONGODB_URI=mongodb://localhost:27017/goal_tracker
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   ```

   **For Production:**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/goal_tracker?retryWrites=true&w=majority
   JWT_SECRET=your-production-secret-key-min-32-characters
   NODE_ENV=production
   ```

4. **Start MongoDB** (if using local MongoDB)
   ```bash
   # macOS with Homebrew
   brew services start mongodb-community

   # Linux
   sudo systemctl start mongod

   # Windows
   # Start MongoDB service from Services panel
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
Task_tracker/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── goals/        # Goal CRUD operations
│   │   ├── logs/         # Daily log operations
│   │   └── stats/        # Statistics endpoint
│   ├── dashboard/        # Dashboard page
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Landing page
├── components/           # React components
│   ├── AuthForm.tsx
│   ├── CalendarHeatmap.tsx
│   ├── CreateGoalModal.tsx
│   ├── GoalCard.tsx
│   ├── LogProgressModal.tsx
│   └── RewardsSection.tsx
├── lib/                  # Utility functions
│   ├── auth.ts           # Authentication helpers
│   ├── mongodb.ts        # MongoDB connection
│   ├── models.ts         # TypeScript interfaces
│   └── rewards.ts        # Reward system logic
├── .env.local            # Environment variables (create this)
├── next.config.js
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## 🔧 Configuration

### MongoDB Setup

#### Local Development
1. Install MongoDB locally
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/goal_tracker`

#### MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user
4. Whitelist your IP address (or use `0.0.0.0/0` for development)
5. Get your connection string and add it to `.env.local`

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/goal_tracker` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-secret-key-min-32-chars` |
| `NODE_ENV` | Environment mode | `development` or `production` |

## 🚢 Deployment

### Deploy to Vercel

1. **Push your code to GitHub**

2. **Import project to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. **Add environment variables in Vercel**
   - Go to Project Settings → Environment Variables
   - Add:
     - `MONGODB_URI` (your MongoDB Atlas connection string)
     - `JWT_SECRET` (generate a secure random string)
     - `NODE_ENV=production`

4. **Deploy**
   - Vercel will automatically detect Next.js
   - Click "Deploy"
   - Your app will be live!

### Deploy to Other Platforms

The app is compatible with any platform that supports Next.js:
- **Netlify**: Use Next.js plugin
- **Railway**: Connect GitHub repo
- **Render**: Use Web Service with Node.js
- **DigitalOcean App Platform**: Use Next.js preset

## 🎮 Usage

1. **Sign Up**: Create a new account on the landing page
2. **Create Goals**: Click "New Goal" to create your first goal
3. **Log Progress**: Click "Log Progress" on any goal card to record your daily achievements
4. **Track Streaks**: Watch your streak counter grow as you complete goals daily
5. **Unlock Rewards**: Earn rewards by maintaining streaks, overachieving, and more!
6. **View Calendar**: Check your progress heatmap to see your consistency

## 🎨 Customization

### Colors & Themes

Edit `tailwind.config.ts` to customize colors:
```typescript
colors: {
  neon: {
    pink: '#ff10f0',
    blue: '#10b3ff',
    purple: '#a855f7',
    green: '#10ff88',
  },
}
```

### Rewards

Add custom rewards in `lib/models.ts`:
```typescript
{
  id: 'custom_reward',
  name: 'Custom Reward',
  description: 'Description here',
  icon: '🎁',
  unlockCondition: 'custom_condition',
  rarity: 'epic',
}
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running (local) or connection string is correct (cloud)
- Check firewall settings
- Verify network access for MongoDB Atlas

### Authentication Issues
- Clear browser cookies
- Check JWT_SECRET is set correctly
- Verify cookie settings in production (HTTPS required)

### Build Errors
- Delete `.next` folder and rebuild
- Clear `node_modules` and reinstall
- Check Node.js version (18+)

## 📝 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Goals
- `GET /api/goals` - Get all goals
- `POST /api/goals` - Create new goal
- `DELETE /api/goals/[id]` - Delete goal

### Logs
- `GET /api/logs` - Get logs (with query params)
- `POST /api/logs` - Log daily progress

### Stats
- `GET /api/stats` - Get statistics and calendar data

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Database**: MongoDB
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Date Handling**: date-fns
- **Icons**: Lucide React
- **Confetti**: react-confetti

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

**Made with ❤️ and lots of ☕**

Enjoy tracking your goals! 🎯✨
