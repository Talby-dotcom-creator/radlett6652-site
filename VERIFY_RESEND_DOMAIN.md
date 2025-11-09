# 📧 Verify radlettfreemasons.org.uk in Resend

## Step 1: Add Domain to Resend

1. **Login to Resend**: https://resend.com/login
2. **Go to Domains**: https://resend.com/domains
3. **Click "Add Domain"**
4. **Enter**: `radlettfreemasons.org.uk`
5. **Click "Add"**

## Step 2: Get DNS Records

After adding the domain, Resend will show you **3 DNS records** to add:

### Example Records (yours will be different):

```
Type: TXT
Name: @ (or radlettfreemasons.org.uk)
Value: resend-domain-verify=abc123xyz456

Type: MX
Name: @ (or radlettfreemasons.org.uk)
Priority: 10
Value: feedback-smtp.us-east-1.amazonses.com

Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none;
```

## Step 3: Add DNS Records to Your Domain Provider

You need to add these records where you manage DNS for `radlettfreemasons.org.uk`.

### Common DNS Providers:

**If using Cloudflare:**

1. Go to: https://dash.cloudflare.com
2. Select your domain: `radlettfreemasons.org.uk`
3. Go to: **DNS** → **Records**
4. Click **Add record** for each record Resend gave you

**If using GoDaddy:**

1. Go to: https://dcc.godaddy.com/domains
2. Find `radlettfreemasons.org.uk` → Click **DNS**
3. Add each record

**If using Namecheap:**

1. Go to: Domain List → Manage
2. **Advanced DNS** tab
3. Add each record

**If using 123-reg, 1&1, or other:**

- Find the DNS management section
- Add the 3 records Resend provided

## Step 4: Wait for Verification

- DNS propagation can take **5 minutes to 48 hours**
- Usually takes **10-30 minutes**
- Resend will automatically check and verify

## Step 5: Check Verification Status

Go back to https://resend.com/domains and check if `radlettfreemasons.org.uk` shows as **"Verified"**

## Step 6: Update Supabase Secrets

Once verified, run these commands:

```powershell
# Update sender to use your verified domain
supabase secrets set EMAIL_SENDER_ADDRESS=contact@radlettfreemasons.org.uk

# Update recipient back to the lodge Gmail
supabase secrets set EMAIL_RECIPIENT_ADDRESS=radlettlodge6652@gmail.com

# Test it
node test-contact-email.js
```

---

## 🔍 Need Help Finding Your DNS Provider?

If you don't know where your DNS is managed, you can check:

**Option 1: Check with a DNS lookup tool**

```powershell
nslookup -type=NS radlettfreemasons.org.uk
```

**Option 2: Check WHOIS**

- Go to: https://who.is/whois/radlettfreemasons.org.uk
- Look for "Name Server" section

**Option 3: Check your domain registrar**

- Login to where you bought the domain
- Look for "DNS", "Nameservers", or "DNS Management"

---

## ⚠️ Important Notes

1. **Don't delete existing DNS records** - only ADD the new ones from Resend
2. **MX record priority**: Make sure it's set to 10
3. **@ symbol**: Some providers use `@`, others use your full domain name
4. **Subdomain records**: If Resend shows `_dmarc.radlettfreemasons.org.uk`, enter just `_dmarc` in the Name field

---

## 🆘 Troubleshooting

**Domain not verifying?**

- Wait longer (DNS can take time)
- Check you added ALL 3 records correctly
- Make sure there are no typos in the values
- Contact Resend support: https://resend.com/support

**Already have MX records?**

- You can have multiple MX records
- Make sure Resend's MX has priority 10
- Don't delete your existing email MX records

---

## 📝 Current Temporary Setup

Until domain is verified:

- ✅ Emails work from: `onboarding@resend.dev`
- ✅ Emails go to: `ptalbot37@gmail.com`
- ⏳ After verification: `contact@radlettfreemasons.org.uk` → `radlettlodge6652@gmail.com`
