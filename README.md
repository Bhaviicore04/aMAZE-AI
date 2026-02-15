# aMAZE AI

A modern, AI-powered web application for Content Creators and Content Consumers built with React, TypeScript, and Tailwind CSS.

## Features

- **For Content Creators**: AI-powered content idea generation, trending topics, vision boards, content planning, and productivity analytics
- **For Content Consumers**: Personalized content feeds, smart recommendations, AI reflection assistant, and productivity tracking
- **Dual Role Support**: Separate dashboards and features for creators and consumers
- **AI Integration**: Generative AI for content ideas, reflections, and chat assistance
- **Modern UI**: Responsive design with Tailwind CSS and Framer Motion animations

## Tech Stack
Backend can be deployed using AWS services such as AWS Lambda, DynamoDB, and Cognito. Current prototype uses Firebase for rapid development.
- **Frontend**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Backend**: AWS cognito
- **AI**: Amazon Web Services Lambda
- **Animations**: Framer Motion
- **Forms**: React Hook Form
- **Routing**: React Router v6
- **Testing**: Vitest, fast-check (property-based testing)
  # Project requirements  
aMAZE-AI/
├── src/
│ ├── components/ # React UI components
│ ├── pages/ # Page components
│ ├── services/ # Service layer (Cognito, API, AI)
│ ├── hooks/ # Custom React hooks
│ ├── contexts/ # React contexts
│ ├── types/ # TypeScript type definitions
│ ├── utils/ # Utility functions
│ └── config/ # AWS configuration files
├── backend/
│ ├── lambda/ # AWS Lambda functions
│ └── api/ # API Gateway integration logic
├── infrastructure/ # IAM policies and deployment configs

## Setup Instructions
Prerequisites

Node.js (v18+)

npm

AWS Account on Amazon Web Services

AWS CLI installed

Install AWS CLI:

npm install -g aws-cli


Configure AWS credentials:

aws configure


Enter:

AWS Access Key

AWS Secret Key

Region (e.g., ap-south-1)

Default output format: json

🔐 2️⃣ Authentication Setup (Amazon Cognito)

Use Amazon Web Services Cognito

Steps:

Go to AWS Console → Cognito

Create a User Pool

Enable:

Email/Password authentication

Google Sign-in (optional)

Create an App Client

Copy:

User Pool ID

App Client ID

Add to .env:

VITE_AWS_REGION=ap-south-1
VITE_COGNITO_USER_POOL_ID=your_user_pool_id
VITE_COGNITO_CLIENT_ID=your_client_id

🗄 3️⃣ Database Setup (Amazon DynamoDB)

Use Amazon Web Services DynamoDB

Steps:

Go to DynamoDB → Create Table

Table Name: Content

Partition Key: userId (String)

Billing mode: On-demand

📦 4️⃣ Storage Setup (Amazon S3)

Use Amazon Web Services S3

Steps:

Create a new bucket

Enable CORS if frontend uploads directly

Add bucket policy (restrict to your app)

Copy bucket name to .env

VITE_S3_BUCKET_NAME=your_bucket_name

⚡ 5️⃣ Backend Setup (AWS Lambda + API Gateway)
Create Lambda Function

Go to Lambda → Create Function

Runtime: Node.js 18+

Attach IAM Role with access to:

DynamoDB

S3

Bedrock (if using AI)

Connect API Gateway

Go to API Gateway

Create HTTP API

Attach Lambda function

Copy API endpoint URL

Add to .env:

VITE_API_BASE_URL=https://your-api-id.execute-api.region.amazonaws.com

🤖 6️⃣ AI Setup
Generative AI

Use Amazon Web Services Bedrock

Enable Bedrock in your region

Grant Lambda permission to invoke model

Call model inside Lambda function

Media Analysis (Optional)

Use Amazon Web Services Rekognition

Attach Rekognition access policy to Lambda

🔒 7️⃣ IAM Security Configuration

Instead of Firestore rules:

Go to IAM

Create Role for Lambda

Attach policies:

AmazonDynamoDBFullAccess (or scoped)

AmazonS3FullAccess (or scoped)

AmazonBedrockFullAccess

Assign role to Lambda

Use least-privilege principle for production.

🖥 Development

Install dependencies:

npm install


Run locally:

npm run dev


App runs at:

http://localhost:5173

🏗 Frontend Deployment (Production)
Option 1: S3 + CloudFront (Recommended)

Use:

Amazon Web Services S3

Amazon Web Services CloudFront

Build project:
npm run build

Upload build folder to S3:
aws s3 sync dist/ s3://your-bucket-name

Enable Static Website Hosting in S3:

Go to Bucket → Properties → Static Website Hosting

Set index.html

(Optional) Use CloudFront for CDN performance.

🚀 Backend Deployment (Lambda)

If deploying manually:

Zip your Lambda code

Upload via AWS Console

If using AWS CLI:

zip function.zip index.js
aws lambda update-function-code \
  --function-name your-function-name \
  --zip-file fileb://function.zip

🧪 Testing
npm run test
npm run test:property
   ```

## License

MIT
