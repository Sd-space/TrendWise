from flask import Flask, request, jsonify
from flask_restful import Api, Resource
from flask_cors import CORS
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import json
import os

app = Flask(__name__)
CORS(app)
api = Api(app)

# Sample SKU data
SKUS = [
    {"id": "SKU001", "name": "Organic Bananas", "category": "Produce", "base_price": 2.99},
    {"id": "SKU002", "name": "Premium Ground Beef", "category": "Meat", "base_price": 8.99},
    {"id": "SKU003", "name": "Whole Milk 1L", "category": "Dairy", "base_price": 3.49},
    {"id": "SKU004", "name": "Fresh Eggs 12ct", "category": "Dairy", "base_price": 4.99},
    {"id": "SKU005", "name": "Organic Avocados", "category": "Produce", "base_price": 1.99},
    {"id": "SKU006", "name": "Chicken Breast", "category": "Meat", "base_price": 6.99},
    {"id": "SKU007", "name": "Greek Yogurt", "category": "Dairy", "base_price": 5.49},
    {"id": "SKU008", "name": "Fresh Spinach", "category": "Produce", "base_price": 2.49},
    {"id": "SKU009", "name": "Salmon Fillets", "category": "Seafood", "base_price": 12.99},
    {"id": "SKU010", "name": "Cherry Tomatoes", "category": "Produce", "base_price": 3.99}
]

class SKUResource(Resource):
    def get(self):
        """Return list of available SKUs"""
        return {"skus": SKUS}

class AddProductResource(Resource):
    def post(self):
        """Add a new product to the system"""
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'category', 'base_price']
        for field in required_fields:
            if field not in data or not data[field]:
                return {"error": f"Missing required field: {field}"}, 400
        
        # Generate SKU ID if not provided
        if not data.get('sku_id'):
            timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
            data['sku_id'] = f"SKU{timestamp}"
        
        # Create new product
        new_product = {
            "id": data['sku_id'],
            "name": data['name'],
            "category": data['category'],
            "base_price": float(data['base_price']),
            "description": data.get('description', ''),
            "supplier": data.get('supplier', ''),
            "lead_time_days": int(data.get('lead_time_days', 3)),
            "min_order_quantity": int(data.get('min_order_quantity', 50))
        }
        
        # Add to SKUS list (in a real app, this would be saved to database)
        SKUS.append(new_product)
        
        return {
            "message": "Product added successfully",
            "product": new_product
        }, 201

class TrendsResource(Resource):
    def get(self):
        """Return sentiment and Google Trends data for the last 30 days"""
        end_date = datetime.now()
        start_date = end_date - timedelta(days=30)
        
        dates = pd.date_range(start=start_date, end=end_date, freq='D')
        
        # Generate mock sentiment data (0-1 scale)
        sentiment_data = []
        for date in dates:
            # Simulate some seasonality and trends
            base_sentiment = 0.6
            seasonal_factor = 0.1 * np.sin(2 * np.pi * date.dayofyear / 365)
            trend_factor = 0.05 * np.sin(2 * np.pi * date.day / 30)
            noise = np.random.normal(0, 0.05)
            
            sentiment = max(0, min(1, base_sentiment + seasonal_factor + trend_factor + noise))
            sentiment_data.append({
                "date": date.strftime("%Y-%m-%d"),
                "sentiment": round(sentiment, 3),
                "search_volume": round(np.random.uniform(20, 80), 1)
            })
        
        return {"trends": sentiment_data}

class PredictResource(Resource):
    def post(self):
        """Generate demand forecast based on SKU, price, and promo settings"""
        data = request.get_json()
        sku_id = data.get('sku_id')
        price = data.get('price', 0)
        promo_active = data.get('promo_active', False)
        
        # Find the SKU
        sku = next((s for s in SKUS if s['id'] == sku_id), None)
        if not sku:
            return {"error": "SKU not found"}, 404
        
        # Generate 7-day forecast
        forecast = self._generate_forecast(sku, price, promo_active)
        
        return {
            "sku": sku,
            "forecast": forecast,
            "kpis": self._calculate_kpis(forecast, sku)
        }
    
    def _generate_forecast(self, sku, price, promo_active):
        """Generate 7-day demand forecast using mock ML model"""
        base_demand = {
            "SKU001": 150,  # Bananas - high volume
            "SKU002": 45,   # Ground beef - medium volume
            "SKU003": 80,   # Milk - high volume
            "SKU004": 60,   # Eggs - medium volume
            "SKU005": 30,   # Avocados - low volume
            "SKU006": 55,   # Chicken - medium volume
            "SKU007": 40,   # Yogurt - medium volume
            "SKU008": 25,   # Spinach - low volume
            "SKU009": 20,   # Salmon - low volume
            "SKU010": 35    # Tomatoes - medium volume
        }
        
        # Get base demand for this SKU
        base = base_demand.get(sku['id'], 50)
        
        # Price elasticity effect
        price_ratio = price / sku['base_price']
        price_effect = 1 + (1 - price_ratio) * 0.3  # 30% elasticity
        
        # Promotional effect
        promo_effect = 1.5 if promo_active else 1.0
        
        # Day-of-week effects
        day_effects = [1.2, 1.1, 1.0, 1.0, 1.3, 1.4, 1.1]  # Mon-Sun
        
        forecast_data = []
        for i in range(7):
            date = datetime.now() + timedelta(days=i)
            day_of_week = date.weekday()
            
            # Calculate demand with all effects
            demand = base * price_effect * promo_effect * day_effects[day_of_week]
            
            # Add some randomness
            demand += np.random.normal(0, demand * 0.1)
            demand = max(0, int(demand))
            
            # Calculate confidence interval
            confidence_lower = max(0, int(demand * 0.85))
            confidence_upper = int(demand * 1.15)
            
            forecast_data.append({
                "date": date.strftime("%Y-%m-%d"),
                "demand": demand,
                "confidence_lower": confidence_lower,
                "confidence_upper": confidence_upper,
                "day_of_week": date.strftime("%A")
            })
        
        return forecast_data
    
    def _calculate_kpis(self, forecast, sku):
        """Calculate key performance indicators"""
        demands = [f['demand'] for f in forecast]
        avg_demand = np.mean(demands)
        
        # Mock historical data for comparison
        historical_avg = avg_demand * 0.9  # Assume current forecast is 10% higher
        
        # Calculate MAPE (Mean Absolute Percentage Error) - mock value
        mape = round(np.random.uniform(8, 15), 1)
        
        # Calculate fill rate (percentage of demand that can be met)
        fill_rate = round(np.random.uniform(85, 98), 1)
        
        # Calculate uplift from promotions
        uplift = round(np.random.uniform(15, 35), 1) if any(f.get('promo_active') for f in forecast) else 0
        
        return {
            "mape": mape,
            "fill_rate": fill_rate,
            "uplift": uplift,
            "avg_demand": round(avg_demand, 1),
            "total_forecast": sum(demands)
        }

# Register API resources
api.add_resource(SKUResource, '/skus')
api.add_resource(AddProductResource, '/add-product')
api.add_resource(TrendsResource, '/trends')
api.add_resource(PredictResource, '/predict')

@app.route('/health')
def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

if __name__ == '__main__':
    print("🚀 Starting Walmart Sparkathon Backend Server...")
    print("📊 Available endpoints:")
    print("   GET  /skus         - List available SKUs")
    print("   POST /add-product  - Add new product")
    print("   GET  /trends       - Get sentiment and trend data")
    print("   POST /predict      - Generate demand forecast")
    print("   GET  /health       - Health check")
    print("\n🌐 Server running on http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000) 