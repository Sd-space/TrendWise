# API Documentation - Walmart Sparkathon Backend

This document describes the REST API endpoints for the retail supply chain forecasting MVP.

## Base URL
```
http://localhost:5000
```

## Authentication
Currently, the API does not require authentication for the MVP. In production, consider implementing JWT tokens or API keys.

## Endpoints

### 1. Health Check

**GET** `/health`

Returns the health status of the API server.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.123456"
}
```

**Status Codes:**
- `200 OK` - Server is healthy

---

### 2. Get Available SKUs

**GET** `/skus`

Returns a list of all available SKUs (Stock Keeping Units) with their details.

**Response:**
```json
{
  "skus": [
    {
      "id": "SKU001",
      "name": "Organic Bananas",
      "category": "Produce",
      "base_price": 2.99
    },
    {
      "id": "SKU002",
      "name": "Premium Ground Beef",
      "category": "Meat",
      "base_price": 8.99
    }
  ]
}
```

**Status Codes:**
- `200 OK` - Successfully retrieved SKUs

**Available SKUs:**
- `SKU001` - Organic Bananas (Produce)
- `SKU002` - Premium Ground Beef (Meat)
- `SKU003` - Whole Milk 1L (Dairy)
- `SKU004` - Fresh Eggs 12ct (Dairy)
- `SKU005` - Organic Avocados (Produce)
- `SKU006` - Chicken Breast (Meat)
- `SKU007` - Greek Yogurt (Dairy)
- `SKU008` - Fresh Spinach (Produce)
- `SKU009` - Salmon Fillets (Seafood)
- `SKU010` - Cherry Tomatoes (Produce)

---

### 3. Get Market Trends

**GET** `/trends`

Returns sentiment and Google Trends data for the last 30 days.

**Response:**
```json
{
  "trends": [
    {
      "date": "2024-01-01",
      "sentiment": 0.65,
      "search_volume": 45.2
    },
    {
      "date": "2024-01-02",
      "sentiment": 0.72,
      "search_volume": 52.8
    }
  ]
}
```

**Status Codes:**
- `200 OK` - Successfully retrieved trends

**Data Fields:**
- `date` (string) - Date in YYYY-MM-DD format
- `sentiment` (float) - Sentiment score between 0 and 1
- `search_volume` (float) - Google Trends search volume (0-100 scale)

---

### 4. Generate Demand Forecast

**POST** `/predict`

Generates a 7-day demand forecast based on SKU, pricing, and promotional settings.

**Request Body:**
```json
{
  "sku_id": "SKU001",
  "price": 2.99,
  "promo_active": false
}
```

**Request Parameters:**
- `sku_id` (string, required) - The SKU identifier
- `price` (float, required) - Current price in USD
- `promo_active` (boolean, optional) - Whether promotional pricing is active (default: false)

**Response:**
```json
{
  "sku": {
    "id": "SKU001",
    "name": "Organic Bananas",
    "category": "Produce",
    "base_price": 2.99
  },
  "forecast": [
    {
      "date": "2024-01-15",
      "demand": 150,
      "confidence_lower": 128,
      "confidence_upper": 173,
      "day_of_week": "Monday"
    },
    {
      "date": "2024-01-16",
      "demand": 165,
      "confidence_lower": 140,
      "confidence_upper": 190,
      "day_of_week": "Tuesday"
    }
  ],
  "kpis": {
    "mape": 12.5,
    "fill_rate": 94.2,
    "uplift": 0.0,
    "avg_demand": 158.7,
    "total_forecast": 1111
  }
}
```

**Response Fields:**

**Forecast Array:**
- `date` (string) - Date in YYYY-MM-DD format
- `demand` (integer) - Predicted demand in units
- `confidence_lower` (integer) - Lower bound of confidence interval
- `confidence_upper` (integer) - Upper bound of confidence interval
- `day_of_week` (string) - Day of the week

**KPIs:**
- `mape` (float) - Mean Absolute Percentage Error
- `fill_rate` (float) - Fill rate percentage
- `uplift` (float) - Promotional uplift percentage
- `avg_demand` (float) - Average daily demand
- `total_forecast` (integer) - Total forecasted demand for 7 days

**Status Codes:**
- `200 OK` - Successfully generated forecast
- `404 Not Found` - SKU not found
- `400 Bad Request` - Invalid request parameters

---

## Error Responses

### Standard Error Format
```json
{
  "error": "Error message description"
}
```

### Common Error Codes
- `400 Bad Request` - Invalid request parameters
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Data Models

### SKU Model
```json
{
  "id": "string",
  "name": "string",
  "category": "string",
  "base_price": "float"
}
```

### Forecast Model
```json
{
  "date": "string",
  "demand": "integer",
  "confidence_lower": "integer",
  "confidence_upper": "integer",
  "day_of_week": "string"
}
```

### Trend Model
```json
{
  "date": "string",
  "sentiment": "float",
  "search_volume": "float"
}
```

---

## Forecasting Algorithm

The forecasting model uses the following factors:

1. **Base Demand**: Historical average demand for each SKU
2. **Price Elasticity**: 30% elasticity factor based on price changes
3. **Promotional Effect**: 50% demand increase when promotions are active
4. **Day-of-Week Effects**: Different multipliers for each day
5. **Random Variation**: ±10% random variation for realism

### Formula
```
Demand = Base_Demand × Price_Effect × Promo_Effect × Day_Effect × (1 + Random_Variation)
```

Where:
- `Price_Effect = 1 + (1 - price_ratio) × 0.3`
- `Promo_Effect = 1.5 if promo_active else 1.0`
- `Day_Effect = [1.2, 1.1, 1.0, 1.0, 1.3, 1.4, 1.1]` (Mon-Sun)

---

## Rate Limiting

Currently, no rate limiting is implemented for the MVP. In production, consider implementing:
- Rate limiting per IP address
- API key-based rate limiting
- Request throttling

---

## CORS Configuration

The API supports CORS for cross-origin requests:

```python
CORS(app, origins=['http://localhost:3000', 'https://your-frontend-domain.com'])
```

---

## Testing the API

### Using curl

**Health Check:**
```bash
curl http://localhost:5000/health
```

**Get SKUs:**
```bash
curl http://localhost:5000/skus
```

**Get Trends:**
```bash
curl http://localhost:5000/trends
```

**Generate Forecast:**
```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "sku_id": "SKU001",
    "price": 2.99,
    "promo_active": false
  }'
```

### Using Python requests

```python
import requests

# Health check
response = requests.get('http://localhost:5000/health')
print(response.json())

# Get SKUs
response = requests.get('http://localhost:5000/skus')
skus = response.json()['skus']

# Generate forecast
forecast_data = {
    'sku_id': 'SKU001',
    'price': 2.99,
    'promo_active': False
}
response = requests.post('http://localhost:5000/predict', json=forecast_data)
forecast = response.json()
```

---

## Future Enhancements

1. **Authentication & Authorization**
   - JWT token-based authentication
   - Role-based access control
   - API key management

2. **Advanced Forecasting**
   - Machine learning models (XGBoost, LightGBM)
   - Seasonal decomposition
   - External data integration

3. **Data Persistence**
   - Database integration (PostgreSQL, MongoDB)
   - Historical data storage
   - Audit logging

4. **Real-time Features**
   - WebSocket connections
   - Real-time forecast updates
   - Live market data integration

5. **Analytics & Monitoring**
   - Request/response logging
   - Performance metrics
   - Error tracking

---

## Support

For API support or questions:
- Check the server logs for detailed error messages
- Verify request format and parameters
- Ensure the backend server is running
- Test endpoints individually to isolate issues 