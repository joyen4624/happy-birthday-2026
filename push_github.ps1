[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$Host.UI.RawUI.WindowTitle = "Day thiep len GitHub Pages"

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "   HUONG DAN DAY THIEP LEN GITHUB WEB (GITHUB PAGES)    " -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Buoc 1: Vao trang web: https://github.com/new" -ForegroundColor White
Write-Host "       - Dat ten Repository (vi du: happy-birthday hoac happy-bd)" -ForegroundColor Gray
Write-Host "       - Chon Public" -ForegroundColor Gray
Write-Host "       - Bam nut 'Create repository'" -ForegroundColor Gray
Write-Host ""

$repoName = Read-Host "Nhap ten repository ban vua tao tren GitHub (vi du: happy-birthday)"
$repoName = $repoName.Trim()

if ([string]::IsNullOrWhiteSpace($repoName)) {
    Write-Host "Ban chua nhap ten repository. Vui long chay lai!" -ForegroundColor Red
    exit
}

# Loc bo neu nguoi dung dan ca link https://github.com/...
if ($repoName -match "github\.com/[^/]+/([^/]+?)(\.git)?$") {
    $repoName = $matches[1]
}

$repoUrl = "https://github.com/joyen4624/$repoName.git"
Write-Host "`nDang ket noi toi: $repoUrl ..." -ForegroundColor Green

git remote remove origin 2>$null
git remote add origin $repoUrl
git branch -M main

Write-Host "Dang day code len GitHub... (Neu co hop thoai dang nhap, ban hay dang nhap nhe)" -ForegroundColor Yellow
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n========================================================" -ForegroundColor Green
    Write-Host "   DAY CODE LEN GITHUB THANH CONG!                      " -ForegroundColor Green
    Write-Host "========================================================" -ForegroundColor Green
    Write-Host "Cac buoc cuoi cung de lay link web:" -ForegroundColor Yellow
    Write-Host "1. Vao: https://github.com/joyen4624/$repoName/settings/pages" -ForegroundColor White
    Write-Host "2. O muc 'Branch', chon 'main' roi bam 'Save'" -ForegroundColor White
    Write-Host "3. Cho 1 phut, link thiep cua ban se la:" -ForegroundColor Cyan
    Write-Host "   👉 https://joyen4624.github.io/$repoName/" -ForegroundColor Magenta
    Write-Host "========================================================" -ForegroundColor Green
} else {
    Write-Host "`nCo loi khi day code len GitHub." -ForegroundColor Red
    Write-Host "Kiem tra lai: Ban da tao repository tren GitHub chua hoac da dang nhap dung tai khoan joyen4624 chua nhe." -ForegroundColor Yellow
}
