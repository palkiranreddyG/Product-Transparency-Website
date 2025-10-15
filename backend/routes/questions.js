import express from "express";
import { v4 as uuidv4 } from "uuid";
import Question from "../models/Question.js";
import Response from "../models/Response.js";
import Product from "../models/Product.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

/**
 * Helper: Generate fallback questions based on product category
 */
function generateFallbackQuestions(productInfo) {
  const { category } = productInfo;

  const questionTemplates = {
    "food-beverage": [
      "What are the main ingredients used in this product?",
      "Are there any allergens or dietary restrictions consumers should know about?",
      "How is this product packaged and what materials are used?",
      "What is the nutritional value and health benefits of this product?",
      "How does this product compare to conventional alternatives?"
    ],
    "fashion-apparel": [
      "What materials and fabrics are used in this product?",
      "Where and how is this product manufactured?",
      "What are the care instructions and expected lifespan?",
      "Are there any ethical or sustainable practices in production?",
      "What sizes and fit information should consumers know?"
    ],
    "health-wellness": [
      "What are the active ingredients and their benefits?",
      "Are there any side effects or contraindications?",
      "How should this product be used for best results?",
      "What certifications or testing has this product undergone?",
      "Is this product suitable for all age groups?"
    ],
    "electronics": [
      "What are the technical specifications and capabilities?",
      "What is the expected battery life and charging requirements?",
      "What warranty and support options are available?",
      "What are the environmental considerations for disposal?",
      "What accessories or additional items are needed?"
    ],
    "home-living": [
      "What materials are used in construction and finish?",
      "What are the care and maintenance requirements?",
      "What are the dimensions and space requirements?",
      "What safety considerations should users be aware of?",
      "What is the expected durability and lifespan?"
    ]
  };

  const selected = questionTemplates[category] || questionTemplates["food-beverage"];

  return selected.map((text, index) => ({
    id: uuidv4(),
    text,
    type: "fallback",
    step: index + 1
  }));
}

/**
 * POST /api/questions/generate
 * Generate AI-based product questions or fallback defaults
 */
router.post("/generate", authenticateToken, async (req, res) => {
  try {
    const { productId, productInfo } = req.body;

    // Validation
    if (!productId || !productInfo) {
      return res.status(400).json({
        error: "Missing required fields",
        message: "productId and productInfo are required"
      });
    }

    // Verify product belongs to user
    const product = await Product.findOne({
      _id: productId,
      userId: req.userId
    });

    if (!product) {
      return res.status(404).json({
        error: "Product not found",
        message: "Product not found or access denied"
      });
    }

    const aiServiceUrl = process.env.AI_SERVICE_URL || "http://localhost:8000";
    let aiData;

    try {
      // Call external AI service
      const aiResponse = await fetch(`${aiServiceUrl}/generate-questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_info: `${productInfo.productName} ${productInfo.description || ""}`,
          category: productInfo.category,
          brand_name: productInfo.brandName,
          product_name: productInfo.productName
        })
      });

      if (!aiResponse.ok) {
        throw new Error(`AI service responded with status ${aiResponse.status}`);
      }

      aiData = await aiResponse.json();

      if (!aiData?.questions || !Array.isArray(aiData.questions)) {
        throw new Error("AI response format invalid");
      }

      // Save generated questions (in parallel)
      const questionsToInsert = aiData.questions.map((qText, index) => ({
        productId,
        questionText: qText,
        questionType: "ai_generated",
        stepNumber: index + 1,
        category: productInfo.category
      }));

      const savedQuestions = await Question.insertMany(questionsToInsert);

      return res.status(200).json({
        success: true,
        message: "Questions generated successfully",
        data: {
          productId,
          questions: savedQuestions.map((q) => ({
            id: q._id,
            text: q.questionText,
            type: q.questionType,
            step: q.stepNumber
          }))
        }
      });
    } catch (aiError) {
      console.error("⚠️ AI service error:", aiError.message);

      // Try Gemini directly if key is provided
      try {
        if (process.env.GEMINI_API_KEY) {
          const prompt = `Generate 3 insightful, product-transparency questions for a product with the following info.\n\n` +
            `Name: ${productInfo.productName}\nBrand: ${productInfo.brandName}\nCategory: ${productInfo.category}\nDescription: ${productInfo.description || ''}\n\n` +
            `Questions should be clear and specific, aligned with transparency, safety, sourcing, ethics, and health considerations.`;

          const geminiResp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }]
            })
          });

          if (geminiResp.ok) {
            const gemData = await geminiResp.json();
            const text = gemData?.candidates?.[0]?.content?.parts?.[0]?.text || '';
            const parsed = text
              .split(/\n+/)
              .map(t => t.replace(/^[-*\d\.\s]+/, '').trim())
              .filter(Boolean)
              .slice(0, 3);

            if (parsed.length) {
              const insert = parsed.map((qText, index) => ({
                productId,
                questionText: qText,
                questionType: 'ai_generated',
                stepNumber: index + 1,
                category: productInfo.category
              }));
              const saved = await Question.insertMany(insert);
              return res.status(200).json({
                success: true,
                message: 'Questions generated via Gemini',
                data: {
                  productId,
                  questions: saved.map(q => ({ id: q._id, text: q.questionText, type: q.questionType, step: q.stepNumber }))
                }
              });
            }
          }
        }
      } catch (gemErr) {
        console.error('Gemini generation failed:', gemErr.message);
      }

      // Final fallback logic
      const fallbackQuestions = generateFallbackQuestions(productInfo);
      const fallbackToInsert = fallbackQuestions.map((q) => ({
        productId,
        questionText: q.text,
        questionType: "fallback",
        stepNumber: q.step,
        category: productInfo.category
      }));
      const savedFallback = await Question.insertMany(fallbackToInsert);
      return res.status(200).json({
        success: true,
        message: "Questions generated (fallback mode)",
        data: {
          productId,
          questions: savedFallback.map((q) => ({
            id: q._id,
            text: q.questionText,
            type: q.questionType,
            step: q.stepNumber
          }))
        }
      });
    }
  } catch (error) {
    console.error("❌ Error generating questions:", error);
    res.status(500).json({
      error: "Failed to generate questions",
      message: error.message
    });
  }
});

/**
 * GET /api/questions/product/:productId
 * Get all questions for a specific product
 */
router.get("/product/:productId", authenticateToken, async (req, res) => {
  try {
    const { productId } = req.params;

    // Verify product belongs to user
    const product = await Product.findOne({
      _id: productId,
      userId: req.userId
    });

    if (!product) {
      return res.status(404).json({
        error: "Product not found",
        message: "Product not found or access denied"
      });
    }

    const questions = await Question.find({ productId }).sort({ stepNumber: 1 });

    res.status(200).json({
      success: true,
      data: questions.map((q) => ({
        id: q._id,
        text: q.questionText,
        type: q.questionType,
        step: q.stepNumber
      }))
    });
  } catch (error) {
    console.error("❌ Error fetching questions:", error);
    res.status(500).json({
      error: "Failed to fetch questions",
      message: error.message
    });
  }
});

/**
 * POST /api/questions/:questionId/response
 * Submit user's answer to a specific question
 */
router.post("/:questionId/response", authenticateToken, async (req, res) => {
  try {
    const { questionId } = req.params;
    const { responseText, submissionId, productId } = req.body;

    if (!responseText || !productId) {
      return res.status(400).json({
        error: "Missing required fields",
        message: "responseText and productId are required"
      });
    }

    // Parallel lookup for question + product
    const [question, product] = await Promise.all([
      Question.findById(questionId),
      Product.findOne({ _id: productId, userId: req.userId })
    ]);

    if (!question) {
      return res.status(404).json({
        error: "Question not found",
        message: "Question not found"
      });
    }

    if (!product) {
      return res.status(404).json({
        error: "Product not found",
        message: "Product not found or access denied"
      });
    }

    const newResponse = new Response({
      questionId,
      productId,
      userId: req.userId,
      responseText,
      submissionId: submissionId || uuidv4()
    });

    await newResponse.save();

    res.status(201).json({
      success: true,
      message: "Response submitted successfully",
      data: newResponse
    });
  } catch (error) {
    console.error("❌ Error submitting response:", error);
    res.status(500).json({
      error: "Failed to submit response",
      message: error.message
    });
  }
});

export default router;
