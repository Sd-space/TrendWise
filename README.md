# Walmart Sparkathon - Retail Supply Chain Forecasting MVP

A clean, modern web application for SKU-level demand forecasting with promotional impact simulation.

## 🎯 Features

- **AI-Powered Forecasting**: 7-day SKU-level demand predictions using XGBoost
- **Real-time Simulation**: Adjust pricing and promotions to see instant forecast updates
- **Interactive Dashboard**: Beautiful charts, KPIs, and trend visualizations
- **Supply Chain Focus**: Designed for non-technical supply chain managers

## 🏗️ Architecture

```
sparkathon/
├── backend/          # Flask API server
├── frontend/         # React dashboard
├── data/            # Sample data and models
└── README.md        # This file
```

## 🚀 Quick Start

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python app.py
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## 📊 API Endpoints

- `GET /skus` - List of available SKUs
- `GET /trends` - Sentiment and Google Trends data
- `POST /predict` - Demand forecast with promo simulation

## 🛠️ Tech Stack

**Backend**: Flask, XGBoost, Pandas, Flask-CORS
**Frontend**: React, Tailwind CSS, Recharts, Axios
**Data**: Mocked historical sales, sentiment, and trend data

## 📈 Key Features

1. **SKU Selector**: Choose from 10 sample products
2. **Promo Simulator**: Adjust price and toggle promotions
3. **Forecast Charts**: 7-day demand predictions with confidence intervals
4. **Trend Analysis**: Sentiment and search volume visualizations
5. **KPI Dashboard**: MAPE, fill rate, and uplift metrics
6. **Real-time Updates**: Instant forecast recalculation

## 🎨 Design Philosophy

- Clean, intuitive interface for supply chain professionals
- Mobile-responsive design
- Color-coded demand indicators
- Smooth animations and transitions
- Focus on actionable insights

## 📁 Project Structure

- `backend/app.py` - Main Flask application
- `backend/models/` - ML model and data processing
- `frontend/src/` - React components and dashboard
- `data/` - Sample SKU data and historical records 