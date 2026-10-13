@echo off
chcp 65001 > nul
echo ========================================================
echo   HƯỚNG DẪN ĐẨY THIỆP LÊN GITHUB WEB (GITHUB PAGES)
echo ========================================================
echo.
echo Bước 1: Bạn vào trang web https://github.com/new
echo         - Đặt tên repository (ví dụ: happy-birthday)
echo         - Chọn Public
echo         - Bấm "Create repository"
echo.
echo Bước 2: Nhập tên repository vừa tạo vào dưới đây (hoặc dán link):
echo (Ví dụ bạn nhập: happy-birthday)
echo.
set /p REPO_NAME="Nhập tên repository: "

if "%REPO_NAME%"=="" (
    echo Bạn chưa nhập tên repository. Vui lòng mở lại file để nhập!
    pause
    exit
)

echo.
echo Đang kết nối và đẩy code lên GitHub...
git remote remove origin >nul 2>&1
git remote add origin https://github.com/joyen4624/%REPO_NAME%.git
git branch -M main
git push -u origin main

echo.
if %ERRORLEVEL% EQU 0 (
    echo ========================================================
    echo  ĐẨY CODE THÀNH CÔNG! BÂY GIỜ HÃY BẬT GITHUB PAGES:
    echo ========================================================
    echo 1. Vào: https://github.com/joyen4624/%REPO_NAME%/settings/pages
    echo 2. Ở mục "Branch", chọn nhánh "main" và bấm "Save"
    echo 3. Chờ 1 phút, đường link thiệp của bạn sẽ là:
    echo    👉 https://joyen4624.github.io/%REPO_NAME%/
    echo ========================================================
) else (
    echo Có lỗi khi đẩy code. Vui lòng kiểm tra lại quyền đăng nhập GitHub của bạn.
)

pause
