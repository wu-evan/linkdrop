# LinkDrop

Send URLs seamlessly between devices with the extension installed - no login required.
Self hosted because servers aren't free.

## Installation

### Browser Extension
1. Open your Chromium-based browser (Chrome, Edge, Brave, etc.)
2. Navigate to the Extensions page (`chrome://extensions/`)
3. Enable **Developer mode** (toggle in top-right corner)
4. Click **Load unpacked**
5. Select the `linkdrop/extension/dist` folder

### Backend Setup

#### Prerequisites
- Node.js installed
- MongoDB cluster (MongoDB Atlas recommended)
- Google API key with Safe Browsing API enabled

#### Configuration
1. Navigate to the `linkdrop/backend` directory
2. Create a `.env` file with the following variables:
   ```
   MONGO_URI=your_mongodb_connection_string
   GOOGLE_KEY=your_google_api_key
   ```

#### Required Services
- **MongoDB**: Create a cluster at [MongoDB Atlas](https://www.mongodb.com/atlas) or use a local MongoDB instance
- **Google Safe Browsing API**: 
  1. Go to [Google Cloud Console](https://console.cloud.google.com/)
  2. Create a new project or select existing one
  3. Enable the Safe Browsing API
  4. Generate an API key with Safe Browsing permissions

#### Deployment Options

**Option 1: Express (Node.js)**
```
cd linkdrop/backend
npm install
npm start
```

**Option 2: Docker**
```
cd linkdrop/backend
docker build -t linkdrop-backend .
docker run -p 3000:3000 --env-file .env linkdrop-backend
```

## Usage

Once installed on multiple devices, simply send URLs between them instantly without any account setup or authentication required.