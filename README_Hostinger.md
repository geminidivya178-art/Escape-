# Deploying to Hostinger (Node.js)

This application has been fully converted and compiled into a production-ready **Node.js** application. Below are the step-by-step instructions to deploy this application to your Hostinger Node.js hosting.

---

## 📋 What files do you need?
When deploying to Hostinger, you **do not** need to upload your TypeScript source files (`server.ts`, `/src`, etc.). You only need the compiled production assets:

1. **`server.js`** — The compiled, optimized, bundle-ready Node.js backend.
2. **`dist/`** — The folder containing your compiled React frontend static files.
3. **`package.json`** — Contains dependencies needed for the server.
4. **`.env`** — Contains your environment variables (e.g., `GEMINI_API_KEY`).

---

## 🚀 Deployment Steps (Hostinger hPanel)

### Step 1: Build the Application
Before uploading, make sure you have the latest compiled files. If you run a build locally or in our terminal:
```bash
npm run build
```
This command compiles your frontend into the `dist/` directory and packages the server as an ES Module into `server.js` in your root directory.

### Step 2: Upload Files to Hostinger
1. Log in to your **Hostinger hPanel**.
2. Navigate to **Websites** -> **Manage** -> **File Manager** (or connect via FTP/SFTP).
3. Upload the following files/folders directly to your Node.js application folder (usually inside `public_html` or your custom app root):
   - `dist/` (the entire folder)
   - `server.js`
   - `package.json`

### Step 3: Configure the Node.js App in Hostinger
1. In hPanel, go to **Advanced** -> **Node.js**.
2. Create or configure a new Node.js App:
   - **Node.js Version**: Select **Node 18** or **Node 20** (recommended).
   - **App Directory**: Select the directory where you uploaded the files.
   - **Application Startup File**: Set this to **`server.js`** (this is the root-level compiled file we created).
3. Click **Save** / **Create**.

### Step 4: Install Dependencies
1. Scroll down to the **Npm packages** section or open Hostinger's terminal for your app.
2. Click **NPM Install** to automatically install the required production packages specified in `package.json`.

### Step 5: Configure Environment Variables
If you are using a Gemini API key for smart AI suggestions:
1. In the Node.js settings panel, look for **Environment Variables** (or create a `.env` file in the same directory as `server.js`).
2. Add the following variable:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: `[Your actual Gemini API Key]` (obtainable from Google AI Studio)
3. Ensure **`NODE_ENV`** is set to `production` so the server serves static React assets.

### Step 6: Start the Application
1. Click **Start** or **Restart** on the Hostinger Node.js dashboard.
2. Your beautiful "Escape.ai" travel application is now live on Hostinger!
