@echo off
REM 🚀 ApnaCart AWS Deployment Script for Windows
REM This script automates the deployment process to AWS

echo 🚀 Starting ApnaCart AWS Deployment...

REM Check prerequisites
echo [INFO] Checking prerequisites...

REM Check if AWS CLI is installed
where aws >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] AWS CLI is not installed. Please install it first.
    echo [INFO] Download from: https://aws.amazon.com/cli/
    pause
    exit /b 1
)

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install it first.
    pause
    exit /b 1
)

REM Check if npm is installed
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed. Please install it first.
    pause
    exit /b 1
)

echo [INFO] All prerequisites are met! ✅

REM Build the application
echo [INFO] Building ApnaCart application...

REM Clean previous build
if exist ".next" rmdir /s /q ".next"

REM Install dependencies
npm ci

REM Build the application
npm run build

echo [INFO] Application built successfully! ✅

REM Ask user for deployment method
echo.
echo Choose your deployment method:
echo 1) AWS Amplify (Recommended - Easy ^& Affordable)
echo 2) Docker + ECS/Fargate (Advanced - More Control)
echo 3) Elastic Beanstalk (Traditional - Server-based)
echo.
set /p choice="Enter your choice (1-3): "

if "%choice%"=="1" goto amplify
if "%choice%"=="2" goto docker_ecs
if "%choice%"=="3" goto elastic_beanstalk
echo [ERROR] Invalid choice. Please run the script again.
pause
exit /b 1

:amplify
echo [INFO] Deploying to AWS Amplify...

REM Check if Amplify CLI is installed
where amplify >nul 2>nul
if %errorlevel% neq 0 (
    echo [INFO] Installing AWS Amplify CLI...
    npm install -g @aws-amplify/cli
)

REM Initialize Amplify if not already initialized
if not exist "amplify" (
    echo [INFO] Initializing Amplify...
    amplify init --yes
)

REM Add hosting if not already added
if not exist "amplify\backend\hosting\amplifyhosting\amplifyhosting-cloudformation-template.json" (
    echo [INFO] Adding hosting...
    amplify add hosting --yes
)

REM Publish the application
echo [INFO] Publishing to Amplify...
amplify publish --yes

echo [INFO] Deployment to Amplify completed! ✅
goto end

:docker_ecs
echo [INFO] Deploying using Docker and ECS...

REM Check if Docker is installed
where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not installed. Please install it first.
    pause
    exit /b 1
)

REM Build Docker image
echo [INFO] Building Docker image...
docker build -t apnacart .

REM Get AWS account ID and region
for /f "tokens=*" %%i in ('aws sts get-caller-identity --query Account --output text') do set ACCOUNT_ID=%%i
for /f "tokens=*" %%i in ('aws configure get region') do set REGION=%%i

if "%ACCOUNT_ID%"=="" (
    echo [ERROR] AWS CLI not configured. Please run 'aws configure' first.
    pause
    exit /b 1
)

REM Create ECR repository if it doesn't exist
echo [INFO] Setting up ECR repository...
aws ecr create-repository --repository-name apnacart --region %REGION% 2>nul || echo [WARNING] ECR repository already exists

REM Tag and push Docker image
echo [INFO] Pushing Docker image to ECR...
docker tag apnacart:latest %ACCOUNT_ID%.dkr.ecr.%REGION%.amazonaws.com/apnacart:latest

REM Login to ECR
aws ecr get-login-password --region %REGION% | docker login --username AWS --password-stdin %ACCOUNT_ID%.dkr.ecr.%REGION%.amazonaws.com

REM Push image
docker push %ACCOUNT_ID%.dkr.ecr.%REGION%.amazonaws.com/apnacart:latest

echo [INFO] Docker image pushed to ECR successfully! ✅
echo [INFO] Next steps: Create ECS cluster, task definition, and service in AWS Console
goto end

:elastic_beanstalk
echo [INFO] Deploying to Elastic Beanstalk...

REM Check if EB CLI is installed
where eb >nul 2>nul
if %errorlevel% neq 0 (
    echo [INFO] Installing Elastic Beanstalk CLI...
    pip install awsebcli
)

REM Initialize EB if not already initialized
if not exist ".elasticbeanstalk" (
    echo [INFO] Initializing Elastic Beanstalk...
    for /f "tokens=*" %%i in ('aws configure get region') do set REGION=%%i
    eb init --platform node.js --region %REGION%
)

REM Create deployment package
echo [INFO] Creating deployment package...
powershell -Command "Compress-Archive -Path * -DestinationPath apnacart.zip -Exclude 'node_modules/*','.next/*','.git/*','*.zip'"

REM Deploy
echo [INFO] Deploying to Elastic Beanstalk...
eb deploy

echo [INFO] Deployment to Elastic Beanstalk completed! ✅
goto end

:end
echo [INFO] 🎉 Deployment completed successfully!
echo [INFO] Your ApnaCart application is now live on AWS!
pause
