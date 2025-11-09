# Deploy Contact Email Function to Supabase
# PowerShell Script

Write-Host "🚀 Deploying Contact Email Function to Supabase" -ForegroundColor Cyan
Write-Host ""

# Step 1: Get Access Token
Write-Host "Step 1: Get your Supabase Access Token" -ForegroundColor Yellow
Write-Host "1. Go to: https://supabase.com/dashboard/account/tokens" -ForegroundColor Gray
Write-Host "2. Click 'Generate New Token'" -ForegroundColor Gray
Write-Host "3. Copy the token" -ForegroundColor Gray
Write-Host ""

$token = Read-Host "Paste your Supabase Access Token here"

if ([string]::IsNullOrWhiteSpace($token)) {
    Write-Host "❌ No token provided. Exiting." -ForegroundColor Red
    exit 1
}

# Set the token as environment variable
$env:SUPABASE_ACCESS_TOKEN = $token

Write-Host "✅ Token set" -ForegroundColor Green
Write-Host ""

# Step 2: Link to project
Write-Host "Step 2: Linking to project..." -ForegroundColor Yellow
supabase link --project-ref neoquuejwgcqueqlcbwj

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to link project" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Project linked" -ForegroundColor Green
Write-Host ""

# Step 3: Deploy function
Write-Host "Step 3: Deploying send-contact-email function..." -ForegroundColor Yellow
supabase functions deploy send-contact-email --project-ref neoquuejwgcqueqlcbwj

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to deploy function" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Function deployed" -ForegroundColor Green
Write-Host ""

# Step 4: Set secrets
Write-Host "Step 4: Setting environment secrets..." -ForegroundColor Yellow

Write-Host "  Setting RESEND_API_KEY..." -ForegroundColor Gray
supabase secrets set RESEND_API_KEY=re_JpsQErMt_9dMnJyj8WmCRfVhpLVdodC7E --project-ref neoquuejwgcqueqlcbwj

Write-Host "  Setting EMAIL_SENDER_ADDRESS..." -ForegroundColor Gray
supabase secrets set EMAIL_SENDER_ADDRESS=contact@radlettfreemasons.org.uk --project-ref neoquuejwgcqueqlcbwj

Write-Host "  Setting EMAIL_RECIPIENT_ADDRESS..." -ForegroundColor Gray
supabase secrets set EMAIL_RECIPIENT_ADDRESS=radlettlodge6652@gmail.com --project-ref neoquuejwgcqueqlcbwj

Write-Host "✅ Secrets configured" -ForegroundColor Green
Write-Host ""

# Step 5: Test
Write-Host "Step 5: Testing function..." -ForegroundColor Yellow
Write-Host "Running test script..." -ForegroundColor Gray
node test-contact-email.js

Write-Host ""
Write-Host "🎉 Deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Your contact form should now work at:" -ForegroundColor Cyan
Write-Host "https://radlettfreemasons.org.uk/contact" -ForegroundColor White
Write-Host ""
Write-Host "Function URL:" -ForegroundColor Cyan
Write-Host "https://neoquuejwgcqueqlcbwj.supabase.co/functions/v1/send-contact-email" -ForegroundColor White
