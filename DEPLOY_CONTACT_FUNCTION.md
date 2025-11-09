# 📧 Deploy Contact Form Email Function

## Prerequisites

- Supabase CLI installed (`npm install -g supabase`)
- Logged into Supabase CLI (`supabase login`)

## Step 1: Deploy the Edge Function

```bash
# Deploy the send-contact-email function
supabase functions deploy send-contact-email --project-ref neoquuejwgcqueqlcbwj
```

## Step 2: Set Environment Variables (Secrets)

The function needs these secrets in Supabase:

```bash
# Set Resend API Key
supabase secrets set RESEND_API_KEY=re_JpsQErMt_9dMnJyj8WmCRfVhpLVdodC7E --project-ref neoquuejwgcqueqlcbwj

# Set email sender (verified domain in Resend)
supabase secrets set EMAIL_SENDER_ADDRESS=contact@radlettfreemasons.org.uk --project-ref neoquuejwgcqueqlcbwj

# Set email recipient
supabase secrets set EMAIL_RECIPIENT_ADDRESS=radlettlodge6652@gmail.com --project-ref neoquuejwgcqueqlcbwj
```

## Step 3: Verify Deployment

Test the function URL in your browser or Postman:

```
https://neoquuejwgcqueqlcbwj.supabase.co/functions/v1/send-contact-email
```

Or test with curl:

```bash
curl -X POST \
  https://neoquuejwgcqueqlcbwj.supabase.co/functions/v1/send-contact-email \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "1234567890",
    "subject": "Test Subject",
    "message": "This is a test message",
    "interested": false
  }'
```

## Alternative: Deploy via Supabase Dashboard

1. Go to https://supabase.com/dashboard/project/neoquuejwgcqueqlcbwj/functions
2. Click "Deploy new function"
3. Upload the `send-contact-email` folder
4. Set secrets in: Settings → Edge Functions → Secrets

## ✅ Expected Result

After deployment, the contact form at `/contact` will:

1. Submit to: `https://neoquuejwgcqueqlcbwj.supabase.co/functions/v1/send-contact-email`
2. Send emails via Resend API
3. Deliver to: `radlettlodge6652@gmail.com`

## 🔍 Troubleshooting

If emails don't arrive:

### Check Resend API Key

- Login to https://resend.com
- Verify API key is active: `re_JpsQErMt_9dMnJyj8WmCRfVhpLVdodC7E`
- Check domain verification status for `radlettfreemasons.org.uk`

### Check Function Logs

```bash
supabase functions logs send-contact-email --project-ref neoquuejwgcqueqlcbwj
```

Or view in dashboard:
https://supabase.com/dashboard/project/neoquuejwgcqueqlcbwj/logs/edge-functions

### Common Issues

1. **CORS Error**: Function already handles CORS, but check browser console
2. **401 Unauthorized**: Check RESEND_API_KEY secret is set correctly
3. **Domain not verified**: Sender domain must be verified in Resend
4. **Rate limits**: Free Resend tier: 100 emails/day, 3000/month

## 📝 Notes

- The function uses Resend API (https://resend.com)
- Sender email must be from a verified domain
- Contact form is at: `/contact` page
- Function code: `supabase/functions/send-contact-email/index.ts`
