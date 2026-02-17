# 🚀 Elite Rivals: Production Deployment (Crypto Core)

Your pro-grade gaming arena is ready for revenue generation via NOWPayments.io.

### 1. Push to GitHub
Upload all project files to a new repository on your GitHub account.

### 2. Connect Vercel
1. Log in to [Vercel.com](https://vercel.com).
2. Click **"Add New"** > **"Project"**.
3. Import your GitHub repository.

### 3. Add Production Environment Variables (CRITICAL)
Before clicking deploy, add these two variables in the **"Environment Variables"** section:

1. **API_KEY**:
   - **Value**: `[Your Gemini API Key]` (Used for match arbitration and anti-cheat)
2. **NOWPAYMENTS_API_KEY**:
   - **Value**: `[Your NOWPayments.io API Key]` (Found in your NOWPayments dashboard settings)

### 4. Deploy!
Click **"Deploy"**. Your application will be live at a public URL.

---

### Technical Architecture:
- **70/30 Split**: The frontend logic enforces a strict 70% winner payout.
- **AI Arbiter**: Gemini-X Pro audits every match via GSI telemetry.
- **Crypto Settlements**: NOWPayments.io API integration handles global BTC/ETH/USDT transactions.
- **Kernel-Level Aesthetics**: A high-performance, GPU-accelerated tactical UI.

**Note**: For production security, ensure you set up an IPN (Instant Payment Notification) listener on a backend to automatically credit user accounts upon blockchain confirmation. This UI currently tracks the invoice initialization.