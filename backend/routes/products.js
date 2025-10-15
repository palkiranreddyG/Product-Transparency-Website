import express from 'express';
import Product from '../models/Product.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/products - Create a new product (authenticated)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { productName, brandName, category, description } = req.body;
    
    // Validate required fields
    if (!productName || !brandName || !category) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'productName, brandName, and category are required'
      });
    }

    // Validate category
    const validCategories = [
      'food-beverage',
      'fashion-apparel',
      'home-living',
      'health-wellness',
      'electronics',
      'other'
    ];

    if (!validCategories.includes(category)) {
      return res.status(400).json({
        error: 'Invalid category',
        message: `Category must be one of: ${validCategories.join(', ')}`
      });
    }

    const product = new Product({
      productName,
      brandName,
      category,
      description: description || '',
      userId: req.userId
    });

    await product.save();

    // ✅ FIXED: Return consistent "data.id" shape
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { id: product._id }  // 👈 consistent format expected by frontend
    });

  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      error: 'Failed to create product',
      message: error.message
    });
  }
});

// GET /api/products/:id - Get product by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findOne({ 
      _id: id, 
      userId: req.userId 
    });

    if (!product) {
      return res.status(404).json({
        error: 'Product not found',
        message: `No product found with ID: ${id}`
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });

  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      error: 'Failed to fetch product',
      message: error.message
    });
  }
});

// GET /api/products - Get all products for authenticated user (with pagination)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, category, brand } = req.query;
    const offset = (page - 1) * limit;
    
    // Build query
    const query = { userId: req.userId };
    if (category) query.category = category;
    if (brand) query.brandName = { $regex: brand, $options: 'i' };

    // Get total count
    const totalCount = await Product.countDocuments(query);

    // Get products with pagination
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(offset);

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      error: 'Failed to fetch products',
      message: error.message
    });
  }
});

// PUT /api/products/:id - Update product
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { productName, brandName, category, description } = req.body;
    
    // Check if product exists and belongs to user
    const product = await Product.findOne({ 
      _id: id, 
      userId: req.userId 
    });

    if (!product) {
      return res.status(404).json({
        error: 'Product not found',
        message: `No product found with ID: ${id}`
      });
    }

    // Update fields
    if (productName) product.productName = productName;
    if (brandName) product.brandName = brandName;
    if (category) product.category = category;
    if (description !== undefined) product.description = description;

    await product.save();

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });

  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      error: 'Failed to update product',
      message: error.message
    });
  }
});

// DELETE /api/products/:id - Delete product
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findOneAndDelete({ 
      _id: id, 
      userId: req.userId 
    });

    if (!product) {
      return res.status(404).json({
        error: 'Product not found',
        message: `No product found with ID: ${id}`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      data: product
    });

  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      error: 'Failed to delete product',
      message: error.message
    });
  }
});

export default router;
