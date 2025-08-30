# 🚀 AWS Deployment Guide for ApnaCart

## 📋 **Prerequisites**

- AWS Account
- AWS CLI installed and configured
- Node.js and npm
- Git repository

---

## 🎯 **Option 1: AWS Amplify (Recommended)**

### **Step 1: Install AWS CLI**
```bash
# Download and install AWS CLI from:
# https://aws.amazon.com/cli/

# Configure AWS CLI
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Enter your default region (e.g., us-east-1)
# Enter your output format (json)
```

### **Step 2: Create Amplify App**
```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Configure Amplify
amplify configure

# Initialize Amplify in your project
amplify init

# Add hosting
amplify add hosting

# Deploy
amplify publish
```

### **Step 3: Manual Amplify Setup (Alternative)**
1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click "New App" → "Host web app"
3. Connect your Git repository
4. Configure build settings
5. Deploy automatically

---

## 🐳 **Option 2: Docker + ECS/Fargate**

### **Step 1: Create Dockerfile**
```dockerfile
# Use the official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
```

### **Step 2: Build and Push Docker Image**
```bash
# Build Docker image
docker build -t apnacart .

# Tag for ECR
docker tag apnacart:latest YOUR_ACCOUNT_ID.dkr.ecr.REGION.amazonaws.com/apnacart:latest

# Push to ECR
docker push YOUR_ACCOUNT_ID.dkr.ecr.REGION.amazonaws.com/apnacart:latest
```

### **Step 3: Deploy to ECS**
1. Create ECR repository
2. Create ECS cluster
3. Create task definition
4. Create service
5. Configure load balancer

---

## ☁️ **Option 3: Elastic Beanstalk**

### **Step 1: Prepare Application**
```bash
# Create deployment package
npm run build
zip -r apnacart.zip . -x "node_modules/*" ".next/*" ".git/*"
```

### **Step 2: Deploy via Console**
1. Go to [Elastic Beanstalk Console](https://console.aws.amazon.com/elasticbeanstalk/)
2. Create new application
3. Upload your zip file
4. Configure environment
5. Deploy

---

## 🔧 **Environment Configuration**

### **Create Environment Variables File**
```bash
# .env.local (for local development)
NEXT_PUBLIC_API_URL=your-api-url
DATABASE_URL=your-database-url
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000
```

### **AWS Systems Manager Parameter Store**
```bash
# Store sensitive data in AWS Parameter Store
aws ssm put-parameter \
    --name "/apnacart/database-url" \
    --value "your-database-url" \
    --type "SecureString"

aws ssm put-parameter \
    --name "/apnacart/nextauth-secret" \
    --value "your-secret" \
    --type "SecureString"
```

---

## 📊 **Database Setup (RDS)**

### **Step 1: Create RDS Instance**
1. Go to [RDS Console](https://console.aws.amazon.com/rds/)
2. Create database
3. Choose PostgreSQL/MySQL
4. Configure security groups
5. Set up connection

### **Step 2: Update Environment**
```bash
# Update your .env file with RDS endpoint
DATABASE_URL=postgresql://username:password@your-rds-endpoint:5432/apnacart
```

---

## 🔒 **Security Configuration**

### **IAM Roles and Policies**
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:PutObject",
                "s3:DeleteObject"
            ],
            "Resource": "arn:aws:s3:::your-bucket-name/*"
        }
    ]
}
```

### **Security Groups**
- **Web Server**: Port 80, 443 (HTTP/HTTPS)
- **Database**: Port 5432 (PostgreSQL) or 3306 (MySQL)
- **SSH**: Port 22 (for EC2 access)

---

## 🌐 **Domain and SSL Setup**

### **Route 53 Configuration**
1. Register domain or use existing
2. Create hosted zone
3. Point to your application

### **SSL Certificate (ACM)**
1. Request certificate in ACM
2. Validate domain ownership
3. Attach to load balancer

---

## 📈 **Monitoring and Scaling**

### **CloudWatch Setup**
```bash
# Enable CloudWatch monitoring
aws cloudwatch put-metric-alarm \
    --alarm-name "ApnaCart-CPU-High" \
    --alarm-description "CPU utilization is high" \
    --metric-name "CPUUtilization" \
    --namespace "AWS/EC2" \
    --statistic "Average" \
    --period 300 \
    --threshold 80 \
    --comparison-operator "GreaterThanThreshold"
```

### **Auto Scaling**
- Configure target tracking policies
- Set minimum and maximum instances
- Monitor performance metrics

---

## 💰 **Cost Optimization**

### **Estimated Monthly Costs (US East)**
- **Amplify**: $1-5/month (very affordable)
- **EC2 t3.micro**: $8-10/month
- **RDS t3.micro**: $15-20/month
- **Load Balancer**: $20/month
- **Data Transfer**: $0.09/GB

### **Cost-Saving Tips**
1. Use Spot Instances for development
2. Enable auto-scaling
3. Use S3 for static assets
4. Monitor and optimize usage

---

## 🚀 **Quick Start Commands**

### **Amplify Deployment**
```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Initialize and deploy
amplify init
amplify add hosting
amplify publish
```

### **Docker Deployment**
```bash
# Build and deploy
docker build -t apnacart .
docker run -p 3000:3000 apnacart
```

---

## 📞 **Support and Troubleshooting**

### **Common Issues**
1. **Build Failures**: Check Node.js version compatibility
2. **Database Connection**: Verify security groups and credentials
3. **Environment Variables**: Ensure proper configuration
4. **SSL Issues**: Check certificate validation

### **Useful Commands**
```bash
# Check application logs
aws logs describe-log-groups
aws logs tail /aws/amplify/your-app-id

# Monitor resources
aws cloudwatch get-metric-statistics
aws ec2 describe-instances
```

---

## 🎉 **Deployment Checklist**

- [ ] Application builds successfully locally
- [ ] Environment variables configured
- [ ] Database connection tested
- [ ] Security groups configured
- [ ] Domain and SSL set up
- [ ] Monitoring enabled
- [ ] Backup strategy implemented
- [ ] Performance testing completed

---

## 🔗 **Useful Links**

- [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
- [AWS RDS Console](https://console.aws.amazon.com/rds/)
- [AWS ECS Console](https://console.aws.amazon.com/ecs/)
- [AWS Elastic Beanstalk](https://console.aws.amazon.com/elasticbeanstalk/)
- [AWS Documentation](https://docs.aws.amazon.com/)

---

**Your ApnaCart application is ready for AWS deployment! Choose the option that best fits your needs and budget.** 🚀
