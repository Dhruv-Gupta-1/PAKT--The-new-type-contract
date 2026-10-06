# 📄 PAKT Web 2.5 — Beginner's Guide

> **A friendly, simple guide to understanding and using PAKT — even if you have never written a single line of code!**

---

## 🙋‍♂️ What is PAKT in Plain English?

Imagine you and a business partner want to make an agreement (like a freelance project, non-disclosure contract, or job agreement):
- **Old Way**: You print papers, physically sign with ink, scan them, email PDF files back and forth, or pay expensive notary fees. Later, someone could claim: *"I never signed that!"* or *"You secretly changed page 3!"*
- **The PAKT Way**: You open PAKT in your web browser, pick a contract template (or let AI write one for you), sign with your finger/mouse on the screen or with an SMS code, and the agreement gets permanently locked with an unbreakable digital fingerprint. Nobody can ever tamper with it, edit words in secret, or deny signing it.

Think of PAKT as **DocuSign + Google Docs + An Uncheatable Digital Vault**, all combined into one simple web app.

---

## 💡 Jargon Buster (Tech Words Explained Simply)

If you are new to technology or coding, here is what the fancy words actually mean:

| Tech Word | What It Actually Means |
|---|---|
| **Web 2.5** | A bridge between regular websites you use every day (like Instagram or Gmail) and blockchain tools (like digital wallets), making it super easy to use without complicated crypto stuff. |
| **Smart Contract** | A digital agreement that lives on a network of computers. Once signed, no single person can change or delete it. |
| **Blockchain** | A digital public notebook that cannot be erased or rewritten. |
| **Digital Signature** | Drawing your signature on your screen or verifying your phone/email to legally agree to a document. |
| **SHA-256 / Hash** | A unique "digital fingerprint" for your document. If even a single comma or letter is changed in the contract, the fingerprint changes completely, immediately alerting everyone that someone tampered with it. |
| **AI Copilot (Gemini)** | A smart assistant built into the app that reads your contract, explains complicated legal words in simple language, warns you about risky clauses, and can rewrite terms to make them fair. |
| **Database (Supabase)** | A secure digital filing cabinet in the cloud where your user profile and contracts are safely stored. |

---

## 📱 What Can You Do in This App? (Screen by Screen)

You can explore all the screens easily using the **"Screens"** button in the top-right corner. Here is a tour of what each screen does:

### 1. 🚀 Welcome Screen (Screen 1)
- The front door of the app.
- Shows you that the server is online and ready.
- Simply click the big **"Get Started"** button to jump into the app.

### 2. 🔐 Sign-In Screen (Screen 2)
- Where you log in.
- **Choose how you want to log in**:
  - Click **Email** to type your email address.
  - Or click **Mobile Phone** to pick your country code (like `+1` for USA, `+44` for UK) and type your 10-digit phone number.
- **Forgot password?** Click **"Instant OTP Login"** on the top right. A sidebar will slide out and give you a 6-digit code so you can log in without typing a password!
- **Password Checklist**: When typing a password, green checkmarks will pop up showing whether your password is strong and safe.
- **Web3 / Crypto Wallet Button**: If you have MetaMask, you can click one button to connect your wallet.
- **Need an account?** Click **"Create Account"** at the bottom.

### 3. ✍️ Create Account / Sign-Up (Screen 3)
- Register as a new user in 30 seconds:
  - Choose who you are: Individual, Company, Freelancer, etc.
  - Type your Name, Email, Phone Number, and Company.
  - Draw your real signature inside the box using your mouse, trackpad, or finger!
  - Click **"Create Sovereign Account"** — your info is automatically saved to the database.

### 4. 🚧 Biometrics Roadmap (Screen 4)
- A friendly screen showing upcoming features that are currently being built (like Apple Face ID and fingerprint sensors).
- Lets you know new updates are on the way!

### 5. 🛡️ 2FA Verification (Screen 5)
- Extra security verification screen with a 6-digit one-time code to make sure your account is safe from hackers.

### 6. 📁 Contracts Vault (Screen 6)
- Your main dashboard where all your contracts live.
- Filter contracts by tabs:
  - **Draft In Review**: Contracts still being written.
  - **Waiting for Signature**: Waiting for you or the other person to sign.
  - **Executed**: Finished, legally signed, and sealed agreements.
  - **Vault Archive**: Safely stored backup copies.
- Click any contract to see who signed it, when they signed it, and read every single clause.

### 7. 📝 New Agreement Studio (Screen 7)
- Create a brand new contract in seconds!
- **Choose a ready-to-use template**:
  - **Cloud SaaS Agreement**: For software companies and web services.
  - **Employment & Advisory Agreement**: For hiring employees or consultants.
  - **Non-Disclosure Agreement (NDA)**: For keeping business secrets safe.
  - **Shareholders Agreement**: For company founders and investors.
  - **Custom Agreement**: Write your own custom contract.
- Choose your language: Switch freely between **English** and **Hindi (हिन्दी)**.

### 8. 🖋️ E-Sign Room (Screen 8)
- Where you and the other party actually sign the contract.
- Pick your signing method (SMS OTP, Digital Certificate, or Passkey).
- Sign your name and click **"Sign & Seal"**.
- The app locks the document and computes an unchangeable digital fingerprint.

### 9. 🤖 AI Legal Copilot (Screen 9)
- Your personal 24/7 legal assistant!
- Read risk scores for any contract (Low, Medium, or High Risk).
- If a clause is unfair, the AI highlights it in red and gives you a fair alternative.
- Click **"Apply Suggestion"** to instantly replace the tricky clause with clean, safe wording.
- You can also chat with the AI assistant to ask questions like: *"What does clause 4 mean in plain English?"*

### 10. 🔍 Verification Terminal (Screen 10)
- Anyone in the world can paste a contract code or document hash here.
- The system checks if the document is genuine or if someone tried to tamper with it.
- Generates a official **Certificate of Authenticity** that you can download or show to anyone.

### 11. 👤 Real Identity & Profile (Screen 11)
- Manage your personal details, company address, and saved digital signature.
- Connect your MetaMask crypto wallet to test on the Ethereum Sepolia test network.
- Sync your profile with your online Supabase cloud database with one click.

### 12. ⚙️ Settings & Configuration (Screen 12)
- Turn notifications on/off.
- Toggle gas-free transaction relayers.
- Export your data and privacy logs anytime.

---

## 🗂️ How the Files are Organized (For Curious Learners)

If you are opening the folder in VS Code or your computer, here is what each main folder does:

- `src/` — **The Frontend (What you see)**: Contains all the React screens, buttons, colors, and layout.
  - `src/components/screens/` — Each individual page (Landing, Login, SignUp, Vault, etc.).
  - `src/data/` — Sample contract templates and translations.
  - `src/utils/` — Helper tools like connecting to the database or digital wallet.
- `server.ts` — **The Backend (The Engine)**: The server that talks to the Gemini AI and saves information.
- `contracts/` — **The Smart Contract**: The code written for the blockchain registry (`PaktSepoliaRegistry.sol`).
- `package.json` — **The Recipe Book**: Lists all tools and libraries the project needs to run.
- `.env` — **The Secret Box**: Where private keys and database passwords live (never share this publicly!).

---

## 🚀 How to Run It on Your Computer

If you want to run this app on your own computer, read the **[INSTALL.md](./INSTALL.md)** file. It is written in super simple, step-by-step instructions made especially for beginners!
