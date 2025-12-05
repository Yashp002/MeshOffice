# Quick Start - View the UI

## To Run the Application

Since npm/bun is not currently in your PATH, follow these steps:

### Option 1: Using Node.js (if installed)

1. **Open a new terminal/command prompt**
2. **Navigate to the project:**
   ```powershell
   cd "c:\Users\shashwat utkarsh\Downloads\mesh"
   ```

3. **Install dependencies:**
   ```powershell
   npm install
   ```

4. **Set up Convex (first time only):**
   ```powershell
   npx convex dev
   ```
   This will:
   - Create a Convex account/project if needed
   - Generate `.env.local` with your Convex URL
   - Start the Convex backend

5. **In a NEW terminal, start the dev server:**
   ```powershell
   npm run dev
   ```

6. **Open your browser:**
   - Go to: `http://localhost:8080`
   - The app will automatically open

### Option 2: Using Bun (if installed)

1. **Open terminal and navigate:**
   ```powershell
   cd "c:\Users\shashwat utkarsh\Downloads\mesh"
   ```

2. **Install dependencies:**
   ```powershell
   bun install
   ```

3. **Set up Convex:**
   ```powershell
   npx convex dev
   ```

4. **Start dev server:**
   ```powershell
   bun run dev
   ```

5. **Open:** `http://localhost:8080`

## What You'll See

### 1. Landing Page (`/`)
- Animated landing page with "Enter Website" button
- Click to enter the dashboard

### 2. Dashboard (`/dashboard`)
- **Stats Cards:**
  - Total Jobs count
  - Total Candidates count
  - System Status
  - Match Potential
- **AI Insights Panel:** Shows recommendations based on your data
- **Quick Actions:** Buttons to quickly navigate to key features
- **Recent Activity:** Shows latest jobs created

### 3. Candidate Intake (`/candidates`)
- **Form to add candidates:**
  - Name, Email, Title, Experience
  - Location field
  - Skills tagging (click suggested skills or add custom)
  - Resume/Summary text area
- Real-time validation
- Saves to Convex database

### 4. Job Intake (`/jobs`)
- **Form to create job postings:**
  - Job Title, Location, Experience Level
  - Job Description (textarea)
  - Required Skills (add multiple)
  - Responsibilities (optional)
- Saves to Convex database

### 5. Matching Engine (`/matching`)
- **Left Panel:** List of all jobs
  - Select a job to match against
  - "Match" button to run AI matching
- **Right Panel:** Ranked candidates
  - Match score (0-100%)
  - Visual score bars
  - Candidate details
  - Skills tags
  - AI reasoning for each match
- Search/filter candidates

### 6. Other Pages
- **Pods** (`/pods`): Team pod management (mock data)
- **Work Graph** (`/work-graph`): Task visualization (mock data)
- **Settings** (`/settings`): Team, API keys, billing (mock data)

## UI Features

- **Retro-minimal design:** Dark theme with monospace fonts
- **Glass morphism cards:** Translucent cards with borders
- **Smooth animations:** Framer Motion animations throughout
- **Responsive layout:** Works on desktop and mobile
- **Real-time updates:** Convex provides live data updates

## Troubleshooting

### Port 8080 Already in Use
If port 8080 is busy, edit `vite.config.ts` and change the port:
```typescript
server: {
  port: 3000,  // or any other port
}
```

### Convex Connection Issues
- Make sure `npx convex dev` is running in a separate terminal
- Check that `.env.local` has `VITE_CONVEX_URL`
- Visit Convex dashboard to verify deployment

### Dependencies Not Installing
- Make sure Node.js 18+ is installed: `node --version`
- Clear cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`, then reinstall

## Next Steps

1. **Install dependencies** (npm/bun)
2. **Set up Convex backend**
3. **Start the dev server**
4. **Add some test data:**
   - Create a job posting
   - Add a candidate
   - Run matching

Enjoy exploring MeshOffice! 🚀

