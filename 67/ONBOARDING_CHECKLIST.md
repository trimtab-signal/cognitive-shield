# 🔺 Phenix Navigator — Onboarding Checklist

> **"The tetrahedron is the minimum stable system."** — R. Buckminster Fuller

Welcome to Phenix Navigator! This checklist will guide you through personalizing the system for your unique situation.

---

## 🔐 Step 1: Secure Your Credentials

### 1.1 Copy Example Files
```bash
cp config/credentials.json.example config/credentials.json
cp .env.example .env
```

### 1.2 Edit `config/credentials.json`

| Field | Description | Where to Get It |
|-------|-------------|-----------------|
| `TELEGRAM_API_ID` | Your Telegram application ID | [my.telegram.org/apps](https://my.telegram.org/apps) |
| `TELEGRAM_API_HASH` | Your Telegram API hash | [my.telegram.org/apps](https://my.telegram.org/apps) |
| `SIGNAL_USER` | Your Signal phone number | Your device |

- [ ] Replace `<YOUR_TELEGRAM_API_ID>` with your actual ID
- [ ] Replace `<YOUR_TELEGRAM_API_HASH>` with your actual hash
- [ ] Replace `<YOUR_PHONE_NUMBER>` with format `+1XXXXXXXXXX`

### 1.3 Edit `.env`

- [ ] Change `DB_PASSWORD` to a secure password (min 16 characters recommended)

---

## 👤 Step 2: Configure Your Support Network

Edit `dashboard/src/stores/supportStore.js` to personalize your tetrahedron:

### 2.1 Lawyer Portal Configuration

Find the `lawyerPortal` section and update:

| Field | Current | Change To |
|-------|---------|-----------|
| `caseNumber` | `'2025CV936'` | Your case number |
| `courtName` | `'Superior Court...'` | Your court name |
| `filings[]` | Sample filings | Your actual filings |
| `evidence[]` | Sample evidence | Your documentation |
| `deadlines[]` | Sample dates | Your critical dates |
| `citations[]` | Sample citations | Applicable statutes |

- [ ] Update case number
- [ ] Update court name
- [ ] Clear or update filings array
- [ ] Clear or update evidence array
- [ ] **CRITICAL:** Update deadlines with your dates

### 2.2 Psychiatrist Portal Configuration

Find the `psychiatristPortal` section:

| Field | Purpose | Action |
|-------|---------|--------|
| `medications[]` | Your medication list | Update with YOUR meds |

Each medication entry has:
```javascript
{
  name: 'Medication Name',
  dose: 'Dosage',
  purpose: 'Why you take it',
  hoursRemaining: 72,        // Refill reminder
  critical: true,            // Is this life-critical?
  notes: 'Additional notes'
}
```

- [ ] Update medication list
- [ ] Set appropriate refill reminders
- [ ] Mark critical medications

### 2.3 Wife/Partner Portal Configuration

Find the `wifePortal` section:

- [ ] Clear `communications[]` array (starts empty for new users)
- [ ] Clear `scheduledEvents[]` array
- [ ] Customize `cooldownActive` defaults if needed

### 2.4 Hunter/Support Contact Portal Configuration

Find the `hunterPortal` section and update:

```javascript
contact: {
  name: '<SUPPORT_CONTACT_NAME>',
  title: '<THEIR_TITLE>',
  organization: '<ORGANIZATION>',
  email: '<EMAIL>',
  firstContact: '<DATE_YYYY-MM-DD>'
}
```

- [ ] Update contact information
- [ ] Clear or update correspondence history
- [ ] Update validation status for your situation
- [ ] Update referral links relevant to your region

---

## 🔧 Step 3: System Configuration

### 3.1 Phenix Navigator Hardware (Optional)

If using the ESP32-S3 hardware navigator:

1. Edit `phenix_phantom/sdkconfig.defaults`:
   - [ ] Verify WiFi credentials if using network features
   - [ ] Adjust GPIO pins if using different hardware

2. Flash the firmware:
   ```bash
   cd phenix_phantom
   idf.py build
   idf.py -p <YOUR_COM_PORT> flash
   ```

### 3.2 Docker Configuration (Optional)

If using containerized deployment:

1. Edit `docker-compose.yml`:
   - [ ] Update volume paths if needed
   - [ ] Adjust port mappings

2. Start services:
   ```bash
   docker-compose up -d
   ```

---

## ✅ Step 4: Verification

### 4.1 Run System Check
```bash
python check_system.py
```

Expected output:
```
✅ Configuration files present
✅ Credentials configured
✅ Database connection ready
✅ All systems nominal
```

### 4.2 Launch Dashboard
```bash
cd dashboard
npm install
npm run dev
```

- [ ] Verify dashboard loads at `http://localhost:5173`
- [ ] Check Support Network Hub shows your data
- [ ] Verify medications display correctly
- [ ] Confirm deadlines appear in calendar view

---

## 🔒 Step 5: Security Verification

### 5.1 Confirm Files Are Gitignored

Run:
```bash
git status
```

These files should **NOT** appear in git:
- [ ] `.env` — Not tracked ✓
- [ ] `config/credentials.json` — Not tracked ✓
- [ ] `phenix_data/` — Not tracked ✓

### 5.2 Verify No Personal Data in Public Files

Check these files for personal info before committing:
- [ ] `README.md` — No personal details
- [ ] `dashboard/src/stores/supportStore.js` — Using placeholders or your data (your choice)

---

## 🚀 You're Ready!

Once all boxes are checked, your Phenix Navigator is personalized and secure.

**Launch Commands:**
```bash
# Windows
.\LAUNCH.bat

# Or manually
cd dashboard && npm run dev
```

---

## 📚 Resources

| Document | Purpose |
|----------|---------|
| `README.md` | Project overview |
| `CREDITS.md` | Attribution and licenses |
| `MANIFESTO.md` | Philosophy and design principles |
| `LIVE_FIRE_PROTOCOL.md` | Emergency procedures |

---

## 💜 The Mesh Holds

> This system was built during crisis. If you're in crisis too, remember: you're not alone.
> 
> The tetrahedron needs all four nodes. Build your support network.
> 
> **— trimtab / Wonky Sprout DUNA**
