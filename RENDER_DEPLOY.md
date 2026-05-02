# Deploying Mentrix to Render

This codebase has been specifically configured for a **Monolithic Deployment** on Render. This means you only need to create a **single Web Service** which will build and serve both the Node.js backend and the React frontend. This prevents CORS errors and saves you money!

Follow these exact steps to host your app live on Render:

## 1. Create a Web Service
1. Log in to [Render.com](https://render.com/).
2. Click **New** -> **Web Service**.
3. Select **"Build and deploy from a Git repository"**.
4. Connect your GitHub account and select your `Mentrix` repository.

## 2. Configure the Service
Fill out the configuration form exactly as follows:

- **Name**: `mentrix` (or whatever you prefer)
- **Region**: (Choose closest to you)
- **Branch**: `main`
- **Root Directory**: *(Leave this completely blank!)*
- **Environment**: `Node`
- **Build Command**: 
  ```bash
  npm install --prefix backend && npm install --prefix frontend && npm run build --prefix frontend
  ```
- **Start Command**:
  ```bash
  npm start --prefix backend
  ```

## 3. Set Environment Variables
Scroll down to the **Environment Variables** section and add the following keys:

1. **`NODE_ENV`**
   - Value: `production`
2. **`PORT`**
   - Value: `5000` (or leave blank, Render assigns one automatically, but 5000 is safe).
3. **`MONGO_URI`**
   - Value: *(Paste your MongoDB Atlas connection string here)*
4. **`JWT_SECRET`**
   - Value: *(Paste a strong, random string of text here. E.g. `superSecretKey123!`)*

## 4. Deploy!
Click **Create Web Service** at the bottom. 

Render will now download your code, install all dependencies for both the backend and frontend, build the Vite app, and start the Node server. Once it says "Live", click the URL at the top left of the dashboard to view your live app!
