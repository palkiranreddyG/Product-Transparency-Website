# ClearChoice Insight API Documentation

## Overview
The ClearChoice Insight API provides endpoints for product transparency, AI-powered question generation, and report creation.

## Base URL
- Development: `http://localhost:3001`
- Production: `https://api.clearchoiceinsight.com`

## Authentication
Currently no authentication required. Future versions will implement JWT-based authentication.

## Endpoints

### Health Check
- **GET** `/health`
- Returns API status and basic information

### Products

#### Create Product
- **POST** `/api/products`
- **Body:**
  ```json
  {
    "productName": "string (required)",
    "brandName": "string (required)", 
    "category": "string (required)",
    "description": "string (optional)"
  }
  ```
- **Response:** Product object with generated ID

#### Get Product
- **GET** `/api/products/:id`
- **Response:** Product object

#### List Products
- **GET** `/api/products?page=1&limit=10&category=food-beverage&brand=Example`
- **Query Parameters:**
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)
  - `category` (optional): Filter by category
  - `brand` (optional): Filter by brand name

### Questions

#### Generate AI Questions
- **POST** `/api/questions/generate`
- **Body:**
  ```json
  {
    "productId": "uuid",
    "productInfo": {
      "productName": "string",
      "brandName": "string",
      "category": "string",
      "description": "string"
    }
  }
  ```
- **Response:** Array of generated questions

#### Get Product Questions
- **GET** `/api/questions/product/:productId`
- **Response:** Array of questions for the product

#### Submit Response
- **POST** `/api/questions/:questionId/response`
- **Body:**
  ```json
  {
    "responseText": "string (required)",
    "submissionId": "uuid (optional)"
  }
  ```

### Reports

#### Generate Report
- **POST** `/api/reports/generate`
- **Body:**
  ```json
  {
    "submissionId": "uuid (required)",
    "productId": "uuid (required)",
    "responses": "object (optional)"
  }
  ```
- **Response:** Report data and ID

#### Download PDF Report
- **GET** `/api/reports/:reportId/pdf`
- **Response:** PDF file download

#### Get Report Data
- **GET** `/api/reports/:reportId`
- **Response:** Report object with data

## Error Responses
All endpoints return consistent error responses:
```json
{
  "error": "Error type",
  "message": "Detailed error message"
}
```

## Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting
- 100 requests per 15 minutes per IP address
- Returns 429 status when limit exceeded

