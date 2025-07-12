# Deployment Guide - Walmart Sparkathon MVP

This guide covers how to deploy the retail supply chain forecasting MVP both locally and to the cloud.

## 🏠 Local Development

### Prerequisites
- Python 3.11 or higher
- Node.js 16+ and npm
- Git

### Quick Start
```bash
# Clone the repository
git clone <repository-url>
cd sparkathon

# Run the setup script
python setup.py

# Or install manually:
# Backend
cd backend
pip install -r requirements.txt
python app.py

# Frontend (in new terminal)
cd frontend
npm install
npm start
```

### Manual Setup

#### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python app.py
```

The backend will start on `http://localhost:5000`

#### Frontend Setup
```bash
cd frontend
npm install
npm start
```

The frontend will start on `http://localhost:3000`

## ☁️ Cloud Deployment

### Option 1: Vercel (Frontend) + PythonAnywhere (Backend)

#### Frontend Deployment on Vercel

1. **Prepare for deployment:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Vercel:**
   - Install Vercel CLI: `npm i -g vercel`
   - Run: `vercel`
   - Follow the prompts to deploy

3. **Update API URL:**
   - In `frontend/src/App.js`, change `API_BASE_URL` to your backend URL
   - Remove the `proxy` field from `package.json`

#### Backend Deployment on PythonAnywhere

1. **Create PythonAnywhere account:**
   - Sign up at pythonanywhere.com
   - Create a new web app

2. **Upload code:**
   ```bash
   # Upload backend folder to PythonAnywhere
   # Or use git clone in PythonAnywhere console
   ```

3. **Install dependencies:**
   ```bash
   pip install --user flask flask-restful flask-cors pandas numpy xgboost scikit-learn
   ```

4. **Configure WSGI file:**
   ```python
   import sys
   path = '/home/yourusername/sparkathon/backend'
   if path not in sys.path:
       sys.path.append(path)
   
   from app import app as application
   ```

5. **Set environment variables:**
   - Add to WSGI file or use PythonAnywhere environment variables

### Option 2: Heroku (Full Stack)

#### Backend on Heroku

1. **Create Heroku app:**
   ```bash
   heroku create your-app-name
   ```

2. **Add buildpacks:**
   ```bash
   heroku buildpacks:add heroku/python
   ```

3. **Create Procfile:**
   ```
   web: gunicorn app:app
   ```

4. **Update requirements.txt:**
   ```
   Flask==2.3.3
   Flask-RESTful==0.3.10
   Flask-CORS==4.0.0
   pandas==2.1.1
   numpy==1.24.3
   xgboost==1.7.6
   scikit-learn==1.3.0
   python-dateutil==2.8.2
   gunicorn==20.1.0
   ```

5. **Deploy:**
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

#### Frontend on Heroku

1. **Create separate Heroku app for frontend**
2. **Add Node.js buildpack:**
   ```bash
   heroku buildpacks:add heroku/nodejs
   ```

3. **Update package.json:**
   ```json
   {
     "scripts": {
       "start": "serve -s build",
       "build": "react-scripts build"
     },
     "dependencies": {
       "serve": "^14.0.0"
     }
   }
   ```

4. **Deploy:**
   ```bash
   npm run build
   git add .
   git commit -m "Deploy frontend"
   git push heroku main
   ```

### Option 3: AWS (Production Ready)

#### Backend on AWS Lambda + API Gateway

1. **Create Lambda function:**
   ```python
   # lambda_function.py
   from app import app
   
   def lambda_handler(event, context):
       return app(event, context)
   ```

2. **Package dependencies:**
   ```bash
   pip install -r requirements.txt -t package/
   cp app.py package/
   cd package
   zip -r ../lambda-deployment.zip .
   ```

3. **Deploy to Lambda:**
   - Upload zip file to AWS Lambda
   - Configure API Gateway trigger

#### Frontend on AWS S3 + CloudFront

1. **Build frontend:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Upload to S3:**
   - Create S3 bucket
   - Upload build folder contents
   - Configure static website hosting

3. **Setup CloudFront:**
   - Create CloudFront distribution
   - Point to S3 bucket
   - Configure custom domain (optional)

## 🔧 Environment Configuration

### Backend Environment Variables
```bash
# .env file for backend
FLASK_ENV=production
FLASK_DEBUG=0
CORS_ORIGINS=https://your-frontend-domain.com
```

### Frontend Environment Variables
```bash
# .env file for frontend
REACT_APP_API_URL=https://your-backend-domain.com
REACT_APP_ENVIRONMENT=production
```

## 📊 Database Setup (Optional)

For production, consider adding a database:

### PostgreSQL Setup
```bash
# Install psycopg2
pip install psycopg2-binary

# Update requirements.txt
echo "psycopg2-binary==2.9.6" >> requirements.txt
```

### MongoDB Setup
```bash
# Install pymongo
pip install pymongo

# Update requirements.txt
echo "pymongo==4.4.0" >> requirements.txt
```

## 🔒 Security Considerations

1. **CORS Configuration:**
   ```python
   # In backend/app.py
   CORS(app, origins=['https://your-frontend-domain.com'])
   ```

2. **API Rate Limiting:**
   ```python
   # Add to requirements.txt
   Flask-Limiter==3.4.0
   ```

3. **Environment Variables:**
   - Never commit sensitive data
   - Use environment variables for secrets

## 🚀 Performance Optimization

### Backend
- Enable gunicorn workers
- Add Redis for caching
- Implement database connection pooling

### Frontend
- Enable code splitting
- Optimize bundle size
- Add service worker for caching

## 📈 Monitoring

### Backend Monitoring
- Add logging: `pip install python-json-logger`
- Set up error tracking (Sentry)
- Monitor API response times

### Frontend Monitoring
- Add error boundary components
- Track user interactions
- Monitor bundle size

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
          heroku_app_name: "your-backend-app"
          heroku_email: "your-email@example.com"

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 🆘 Troubleshooting

### Common Issues

1. **CORS Errors:**
   - Check CORS configuration in backend
   - Verify frontend API URL

2. **Build Failures:**
   - Check Node.js version compatibility
   - Clear npm cache: `npm cache clean --force`

3. **Import Errors:**
   - Verify all dependencies are installed
   - Check Python path configuration

4. **Port Conflicts:**
   - Change ports in configuration
   - Kill existing processes on ports

### Support
- Check logs in deployment platform
- Monitor application performance
- Test API endpoints independently

## 📚 Additional Resources

- [Flask Deployment Guide](https://flask.palletsprojects.com/en/2.3.x/deploying/)
- [React Deployment](https://create-react-app.dev/docs/deployment/)
- [Vercel Documentation](https://vercel.com/docs)
- [Heroku Documentation](https://devcenter.heroku.com/)
- [AWS Documentation](https://aws.amazon.com/documentation/) 