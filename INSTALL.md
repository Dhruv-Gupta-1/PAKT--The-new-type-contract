# 🛠️ Easy Installation Guide (Step-by-Step for Beginners)

> **Never coded before? Don't worry! This guide is written in plain, friendly English. Just follow these steps one by one, like a cooking recipe.**

---

## 🎯 What We Are Going to Do:
1. Make sure your computer has the free software needed to run web apps (**Node.js**).
2. Download the project's building blocks (**npm install**).
3. Start the project (**npm run dev**).
4. Open the website in your internet browser (Chrome, Safari, Edge, etc.)!

Total time needed: **About 5 minutes.**

---

## 📋 Step 0: What You Need on Your Computer

Before doing anything, you need one free program installed on your computer called **Node.js**:

### How to Check if You Have Node.js:
1. Open your computer's terminal:
   - **On Windows**: Press the `Windows Key`, type `cmd` or `Command Prompt`, and press `Enter`.
   - **On Mac**: Press `Command + Space`, type `Terminal`, and press `Enter`.
2. Type this command and press `Enter`:
   ```bash
   node -v
   ```
3. **What happens?**
   - If you see a number like `v18.20.0` or `v20.12.0`, you are all set! Go to **Step 1**.
   - If it says *"command not found"* or *"not recognized"*, go to **[nodejs.org](https://nodejs.org/)**, download the green **LTS** button, install it like any normal program, and restart your computer.

---

## 📂 Step 1: Open the Project Folder in Terminal

1. In your Terminal or Command Prompt, navigate to the folder where this project is saved:
   ```bash
   cd /path/to/your/project-folder
   ```
   *(Hint: You can simply type `cd ` with a space, then drag the folder from your desktop into the terminal window and press `Enter`!)*

---

## 📦 Step 2: Install Project Tools (`npm install`)

Think of this step like letting your computer go to the app store and download all the building blocks (like React, icons, and styling tools) that this website needs to work.

Type this command and press `Enter`:

```bash
npm install
```

⏳ **Wait 1 to 2 minutes.** You will see some progress bars. When it finishes and returns to your normal command prompt, everything is downloaded!

---

## ⚙️ Step 3: Setup Your Settings File (`.env`)

In the project folder, there is an example settings file named `.env.example`. We just need to make a copy of it called `.env`:

### On Mac or Linux:
```bash
cp .env.example .env
```

### On Windows:
```cmd
copy .env.example .env
```

*(Or on your desktop: simply make a copy of the file `.env.example` and rename the copy to `.env`)*

> **Good to Know**: You can run the app immediately even without filling in any secret keys! The app has smart built-in demo backups for everything so nothing crashes.

---

## 🚀 Step 4: Start the App!

Now comes the fun part! Type this command and press `Enter`:

```bash
npm run dev
```

You will see a message like this appear in your terminal:
```
PAKT Full-Stack Server running on http://0.0.0.0:3000
```

Now, open your favorite web browser (Google Chrome, Safari, Brave, or Firefox) and visit this address:

👉 **[http://localhost:3000](http://localhost:3000)**

🎉 **Congratulations! The PAKT website will appear on your screen!**

---

## 🗄️ Optional: Connect Real Cloud Database (Supabase)

Want your created user accounts and signed contracts to save to a real online database instead of just temporary browser memory?

Supabase is a free online database service. Setting it up takes just 3 minutes:

1. Go to **[supabase.com](https://supabase.com/)** and click **Start your project** (it is 100% free).
2. Create a new organization and project (name it anything, like `pakt-db`).
3. Once your project loads, click on the **SQL Editor** icon on the left menu (it looks like a small terminal `>_` or SQL icon).
4. Click **New query**, paste the following block of text, and click the green **Run** button:

```sql
-- Create table for user accounts & signatures
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_address TEXT UNIQUE,
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    entity_type TEXT DEFAULT 'Individual',
    id_type TEXT DEFAULT 'Government ID',
    id_number TEXT,
    role TEXT DEFAULT 'Signatory',
    digital_signature_data TEXT,
    is_verified BOOLEAN DEFAULT TRUE,
    sepolia_address TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create table for contracts
CREATE TABLE IF NOT EXISTS public.agreements (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    status TEXT DEFAULT 'pending_signature',
    parties JSONB NOT NULL DEFAULT '[]'::jsonb,
    jurisdiction TEXT DEFAULT 'Global Commercial Arbitration Jurisdiction',
    stamp_duty TEXT,
    summary TEXT,
    sha256 TEXT NOT NULL,
    eth_tx_hash TEXT,
    eth_block_number TEXT,
    sepolia_contract_address TEXT,
    full_draft_text TEXT,
    clauses JSONB DEFAULT '[]'::jsonb,
    signers JSONB DEFAULT '[]'::jsonb,
    created_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable public access for demo testing
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agreements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public user access" ON public.user_profiles FOR ALL USING (true);
CREATE POLICY "Public agreements access" ON public.agreements FOR ALL USING (true);
```

5. Go to your **Project Settings** (gear icon) ➡️ **API**, copy your **Project URL** and **anon public key**, and paste them into your `.env` file:
   ```env
   SUPABASE_URL="https://your-project.supabase.co"
   SUPABASE_PUBLISHABLE_KEY="your-anon-key-here"
   VITE_SUPABASE_URL="https://your-project.supabase.co"
   VITE_SUPABASE_ANON_KEY="your-anon-key-here"
   ```
6. Restart your app in the terminal by pressing `Ctrl + C`, then running `npm run dev` again. Now all signups are permanently saved online!

---

## 🤖 Optional: Add Real AI Copilot (Google Gemini Key)

The app already has built-in smart legal responses. But if you want it connected directly to Google's live **Gemini AI**:

1. Go to **[aistudio.google.com](https://aistudio.google.com/)** and log in with your Google Account.
2. Click **Get API key** and click **Create API key**.
3. Open your `.env` file in any text editor (Notepad, TextEdit, or VS Code), find this line, and paste your key between the quotation marks:
   ```env
   GEMINI_API_KEY="AIzaSyYourSecretKeyHere"
   ```
4. Restart your terminal by pressing `Ctrl + C`, then running `npm run dev`. Your AI Copilot is now connected to live Gemini models!

---

## 🛑 How to Stop the App

When you are finished using the app:
1. Go back to your Terminal or Command Prompt window.
2. Hold down `Ctrl` and press `C` on your keyboard (`Ctrl + C`).
3. The server will stop cleanly.

---

## ❓ Help! Something Went Wrong (Troubleshooting)

### 1. "Port 3000 is already in use"
- **What it means**: Another program or another window is already using port 3000.
- **Easy fix**: Run this command to use port 3005 instead:
  ```bash
  PORT=3005 npm run dev
  ```
  Then open **http://localhost:3005** in your browser!

### 2. "command not found: npm"
- **What it means**: Node.js is not installed yet on your computer.
- **Easy fix**: Visit **[nodejs.org](https://nodejs.org/)**, download the installer, click Next through the setup wizard, close your terminal, reopen it, and try again.

### 3. "My screen is blank or white"
- **Easy fix**: Open your browser at **http://localhost:3000**, hold `Shift` and click the browser's **Refresh** button (hard reload).

### 4. How do I switch screens to see different parts of the app?
- Look at the top right of the page: click the button named **"Screens (X/12)"**.
- A small menu will open letting you jump instantly to any page:
  - `Welcome Splash`
  - `Login Credentials`
  - `Create Account (SignUp)`
  - `Biometric (Building)`
  - `Contracts Vault`
  - `New Agreement Studio`
  - `Execution & eSign`
  - `AI Copilot`
  - `Verify Terminal`
  - `Settings`

---

**Need more help?** That's completely normal when learning! Check the [README.md](./README.md) file for an easy explanation of what every button and feature does.
