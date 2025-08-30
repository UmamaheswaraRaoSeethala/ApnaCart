#!/bin/bash

# 🚀 ApnaCart AWS Deployment Script
# This script automates the deployment process to AWS

set -e  # Exit on any error

echo "🚀 Starting ApnaCart AWS Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check if AWS CLI is installed
    if ! command -v aws &> /dev/null; then
        print_error "AWS CLI is not installed. Please install it first."
        print_status "Download from: https://aws.amazon.com/cli/"
        exit 1
    fi
    
    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install it first."
        exit 1
    fi
    
    # Check if npm is installed
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install it first."
        exit 1
    fi
    
    print_status "All prerequisites are met! ✅"
}

# Build the application
build_app() {
    print_status "Building ApnaCart application..."
    
    # Clean previous build
    if [ -d ".next" ]; then
        rm -rf .next
    fi
    
    # Install dependencies
    npm ci
    
    # Build the application
    npm run build
    
    print_status "Application built successfully! ✅"
}

# Deploy using AWS Amplify
deploy_amplify() {
    print_status "Deploying to AWS Amplify..."
    
    # Check if Amplify CLI is installed
    if ! command -v amplify &> /dev/null; then
        print_status "Installing AWS Amplify CLI..."
        npm install -g @aws-amplify/cli
    fi
    
    # Initialize Amplify if not already initialized
    if [ ! -d "amplify" ]; then
        print_status "Initializing Amplify..."
        amplify init --yes
    fi
    
    # Add hosting if not already added
    if [ ! -f "amplify/backend/hosting/amplifyhosting/amplifyhosting-cloudformation-template.json" ]; then
        print_status "Adding hosting..."
        amplify add hosting --yes
    fi
    
    # Publish the application
    print_status "Publishing to Amplify..."
    amplify publish --yes
    
    print_status "Deployment to Amplify completed! ✅"
}

# Deploy using Docker and ECS
deploy_docker_ecs() {
    print_status "Deploying using Docker and ECS..."
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install it first."
        exit 1
    fi
    
    # Build Docker image
    print_status "Building Docker image..."
    docker build -t apnacart .
    
    # Get AWS account ID and region
    ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    REGION=$(aws configure get region)
    
    if [ -z "$ACCOUNT_ID" ] || [ -z "$REGION" ]; then
        print_error "AWS CLI not configured. Please run 'aws configure' first."
        exit 1
    fi
    
    # Create ECR repository if it doesn't exist
    print_status "Setting up ECR repository..."
    aws ecr create-repository --repository-name apnacart --region $REGION 2>/dev/null || print_warning "ECR repository already exists"
    
    # Tag and push Docker image
    print_status "Pushing Docker image to ECR..."
    docker tag apnacart:latest $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/apnacart:latest
    
    # Login to ECR
    aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com
    
    # Push image
    docker push $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/apnacart:latest
    
    print_status "Docker image pushed to ECR successfully! ✅"
    print_status "Next steps: Create ECS cluster, task definition, and service in AWS Console"
}

# Deploy using Elastic Beanstalk
deploy_elastic_beanstalk() {
    print_status "Deploying to Elastic Beanstalk..."
    
    # Check if EB CLI is installed
    if ! command -v eb &> /dev/null; then
        print_status "Installing Elastic Beanstalk CLI..."
        pip install awsebcli
    fi
    
    # Initialize EB if not already initialized
    if [ ! -d ".elasticbeanstalk" ]; then
        print_status "Initializing Elastic Beanstalk..."
        eb init --platform node.js --region $(aws configure get region)
    fi
    
    # Create deployment package
    print_status "Creating deployment package..."
    zip -r apnacart.zip . -x "node_modules/*" ".next/*" ".git/*" "*.zip"
    
    # Deploy
    print_status "Deploying to Elastic Beanstalk..."
    eb deploy
    
    print_status "Deployment to Elastic Beanstalk completed! ✅"
}

# Main deployment function
main() {
    print_status "Welcome to ApnaCart AWS Deployment!"
    
    # Check prerequisites
    check_prerequisites
    
    # Build the application
    build_app
    
    # Ask user for deployment method
    echo ""
    echo "Choose your deployment method:"
    echo "1) AWS Amplify (Recommended - Easy & Affordable)"
    echo "2) Docker + ECS/Fargate (Advanced - More Control)"
    echo "3) Elastic Beanstalk (Traditional - Server-based)"
    echo ""
    read -p "Enter your choice (1-3): " choice
    
    case $choice in
        1)
            deploy_amplify
            ;;
        2)
            deploy_docker_ecs
            ;;
        3)
            deploy_elastic_beanstalk
            ;;
        *)
            print_error "Invalid choice. Please run the script again."
            exit 1
            ;;
    esac
    
    print_status "🎉 Deployment completed successfully!"
    print_status "Your ApnaCart application is now live on AWS!"
}

# Run the main function
main "$@"
