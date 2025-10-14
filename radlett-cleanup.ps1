# ============================================================
# Radlett 6652 Cleanup Script (Safe ASCII Version)
# Cleans legacy CMS/Type references and rebuilds a fresh state
# ============================================================

Write-Host "Starting Radlett Cleanup..." -ForegroundColor Cyan

# --- CONFIG ---
$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
$SrcPath = Join-Path $ProjectRoot "src"
$BackupPath = Join-Path $ProjectRoot ("src_backup_" + (Get-Date -Format "yyyyMMdd_HHmmss"))
$LogFile = Join-Path $ProjectRoot "radlett_cleanup_log.txt"

# --- BACKUP FIRST ---
Write-Host "Creating backup of 'src' at $BackupPath" -ForegroundColor Yellow
Copy-Item -Recurse -Force $SrcPath $BackupPath

# --- DEFINE REPLACEMENTS ---
$Replacements = @(
    @{ Search = "getNewsArticles("; Replace = "getBlogPosts('news')(" },
    @{ Search = "getPublishedNews("; Replace = "getBlogPosts('news')(" },
    @{ Search = "getSnippets("; Replace = "getBlogPosts('snippet')(" },
    @{ Search = "getBlogPost("; Replace = "getBlogPosts(" },
    @{ Search = "getLodgeDocumentsPaginated("; Replace = "getLodgeDocuments(" },
    @{ Search = "cmsApi.getNextUpcomingEvent("; Replace = "optimizedApi.getNextUpcomingEvent(" },
    @{ Search = "api.getNextUpcomingEvent("; Replace = "optimizedApi.getNextUpcomingEvent(" },
    @{ Search = "getAllMembers("; Replace = "optimizedApi.getAllMembers(" },
    @{ Search = "api.getMemberProfiles("; Replace = "optimizedApi.getAllMembers(" },
    @{ Search = "updatePageContent("; Replace = "updateSiteSetting(" },
    @{ Search = "CMSEvent"; Replace = "Event" },
    @{ Search = "CMSFAQItem"; Replace = "FAQItem" },
    @{ Search = "CMSNewsArticle"; Replace = "CMSBlogPost" },
    @{ Search = "CMSOfficer"; Replace = "Officer" },
    @{ Search = "CMSPageContent"; Replace = "PageContent" },
    @{ Search = "CMSSiteSetting"; Replace = "SiteSetting" }
)

# --- EXECUTE REPLACEMENTS ---
$TotalChanges = 0
foreach ($item in $Replacements) {
    $pattern = [regex]::Escape($item.Search)
    $replace = $item.Replace

    Write-Host ("Replacing {0} -> {1}" -f $item.Search, $item.Replace) -ForegroundColor Green

    $files = Get-ChildItem -Path $SrcPath -Recurse -Include *.ts, *.tsx
    foreach ($file in $files) {
        (Get-Content $file.PSPath) |
        ForEach-Object { $_ -replace $pattern, $replace } |
        Set-Content $file.PSPath
    }
    $TotalChanges++
}

# --- LOG & REPORT ---
Add-Content $LogFile ("Cleanup completed at " + (Get-Date))
Add-Content $LogFile ("Backup folder: $BackupPath")
Add-Content $LogFile ("Total replacement groups applied: $TotalChanges")

Write-Host ""
Write-Host "Cleanup complete." -ForegroundColor Cyan
Write-Host ("Backup saved at: {0}" -f $BackupPath)
Write-Host ("Log file: {0}" -f $LogFile)
Write-Host "Now run: npx tsc --noEmit to verify clean build." -ForegroundColor Yellow
