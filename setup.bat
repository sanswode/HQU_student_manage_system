@echo off
echo ==========================================
echo  学生成绩管理系统 - 初始化脚本
echo ==========================================
echo.

REM 检查Git是否安装
git --version >nul 2>&1
if errorlevel 1 (
    echo [错误] Git未安装，请先安装Git
    pause
    exit /b 1
)

REM 检查Python是否安装
python --version >nul 2>&1
if errorlevel 1 (
    echo [错误] Python未安装，请先安装Python 3.8+
    pause
    exit /b 1
)

REM 检查Node.js是否安装
node --version >nul 2>&1
if errorlevel 1 (
    echo [错误] Node.js未安装，请先安装Node.js 18+
    pause
    exit /b 1
)

echo [1/4] 正在初始化Git仓库...
git init
git add .
git commit -m "Initial commit: Student Management System"

echo.
echo [2/4] 正在安装后端依赖...
cd backend
pip install -r requirements.txt
if errorlevel 1 (
    echo [错误] 后端依赖安装失败
    pause
    exit /b 1
)
cd ..

echo.
echo [3/4] 正在安装前端依赖...
cd frontend
npm install
if errorlevel 1 (
    echo [错误] 前端依赖安装失败
    pause
    exit /b 1
)
cd ..

echo.
echo [4/4] 创建数据库目录...
if not exist database mkdir database

echo.
echo ==========================================
echo  初始化完成！
echo ==========================================
echo.
echo 启动项目:
echo   1. 启动后端: cd backend ^&^& python run.py
echo   2. 启动前端: cd frontend ^&^& npm run dev
echo.
echo 访问地址:
echo   - 前端: http://localhost:5173
echo   - 后端: http://localhost:5000
echo.
pause