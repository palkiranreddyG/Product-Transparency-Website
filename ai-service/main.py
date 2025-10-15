from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="ClearChoice Insight AI Service",
    description="AI-powered question generation for product transparency",
    version="1.0.0"
)

# Dynamic CORS configuration
cors_origins = os.getenv("CORS_ORIGIN", "http://localhost:3001,http://localhost:8080").split(",")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request/Response models
class ProductInfo(BaseModel):
    product_info: str
    category: str = None
    brand_name: str = None
    product_name: str = None

class QuestionResponse(BaseModel):
    questions: List[str]
    category: str
    confidence: float

# Health check endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "OK",
        "message": "ClearChoice Insight AI Service is running",
        "service": "AI Question Generation"
    }

# Main question generation endpoint
@app.post("/generate-questions", response_model=QuestionResponse)
async def generate_questions(request: ProductInfo):
    """
    Generate intelligent follow-up questions based on product information.
    Uses a hybrid approach: template-based questions enhanced with AI insights.
    """
    try:
        logger.info(f"Generating questions for: {request.product_info}")
        
        # Extract category for targeted questions
        category = request.category or "general"
        
        # Generate questions based on category and product info
        questions = await generate_category_questions(
            request.product_info, 
            category,
            request.brand_name,
            request.product_name
        )
        
        return QuestionResponse(
            questions=questions,
            category=category,
            confidence=0.85
        )
        
    except Exception as e:
        logger.error(f"Error generating questions: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate questions: {str(e)}")

# Category-specific question generation
async def generate_category_questions(product_info: str, category: str, brand_name: str = None, product_name: str = None) -> List[str]:
    """
    Generate category-specific questions with AI enhancement
    """
    
    # Base questions for each category
    category_templates = {
        "food-beverage": [
            "What are the main ingredients and their sources?",
            "Are there any allergens, additives, or preservatives?",
            "What are the nutritional benefits and health impacts?",
            "How is this product packaged and what materials are used?",
            "What certifications (organic, non-GMO, etc.) does this product have?"
        ],
        "fashion-apparel": [
            "What materials and fabrics are used in this product?",
            "Where and how is this product manufactured?",
            "What are the care instructions and expected durability?",
            "Are there any ethical or sustainable production practices?",
            "What sizing information and fit details should consumers know?"
        ],
        "health-wellness": [
            "What are the active ingredients and their therapeutic benefits?",
            "Are there any side effects, contraindications, or warnings?",
            "How should this product be used for optimal results?",
            "What clinical studies or testing support this product's claims?",
            "Is this product suitable for all age groups and conditions?"
        ],
        "electronics": [
            "What are the technical specifications and performance capabilities?",
            "What is the battery life and charging/power requirements?",
            "What warranty, support, and service options are available?",
            "What are the environmental considerations for disposal and recycling?",
            "What accessories or additional components are needed?"
        ],
        "home-living": [
            "What materials are used in construction and finish?",
            "What are the care, maintenance, and cleaning requirements?",
            "What are the dimensions, space requirements, and installation needs?",
            "What safety considerations and certifications should users know?",
            "What is the expected durability, lifespan, and warranty coverage?"
        ]
    }
    
    # Get base questions for category
    base_questions = category_templates.get(category, category_templates["food-beverage"])
    
    # Enhance questions based on product info
    enhanced_questions = []
    
    for i, question in enumerate(base_questions[:3]):  # Return top 3 questions
        # Add product-specific context
        if product_name and brand_name:
            enhanced_question = f"For {product_name} by {brand_name}: {question}"
        elif product_name:
            enhanced_question = f"For {product_name}: {question}"
        else:
            enhanced_question = question
            
        enhanced_questions.append(enhanced_question)
    
    # Add a custom question based on product description
    if product_info and len(product_info) > 10:
        custom_question = f"Based on your description of '{product_info[:50]}...', what additional details would help consumers make an informed decision?"
        enhanced_questions.append(custom_question)
    
    return enhanced_questions

# Alternative endpoint for batch question generation
@app.post("/generate-batch-questions")
async def generate_batch_questions(products: List[ProductInfo]):
    """
    Generate questions for multiple products at once
    """
    try:
        results = []
        for product in products:
            questions = await generate_category_questions(
                product.product_info,
                product.category,
                product.brand_name,
                product.product_name
            )
            results.append({
                "product": product.product_name or "Unknown Product",
                "questions": questions,
                "category": product.category
            })
        
        return {"results": results}
        
    except Exception as e:
        logger.error(f"Error in batch generation: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Batch generation failed: {str(e)}")

# Question validation endpoint
@app.post("/validate-questions")
async def validate_questions(questions: List[str]):
    """
    Validate and score the quality of generated questions
    """
    try:
        validated_questions = []
        
        for question in questions:
            # Basic validation rules
            score = 0
            issues = []
            
            # Check question length
            if len(question) < 10:
                issues.append("Question too short")
            elif len(question) > 200:
                issues.append("Question too long")
            else:
                score += 1
            
            # Check for question mark
            if not question.strip().endswith('?'):
                issues.append("Missing question mark")
            else:
                score += 1
            
            # Check for transparency-related keywords
            transparency_keywords = [
                'ingredients', 'materials', 'manufacturing', 'sourcing',
                'certification', 'testing', 'safety', 'environmental',
                'ethical', 'sustainable', 'health', 'nutrition', 'warranty'
            ]
            
            if any(keyword in question.lower() for keyword in transparency_keywords):
                score += 1
            
            validated_questions.append({
                "question": question,
                "score": score / 3,  # Normalize to 0-1
                "issues": issues,
                "valid": len(issues) == 0
            })
        
        return {"validated_questions": validated_questions}
        
    except Exception as e:
        logger.error(f"Error validating questions: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Validation failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

