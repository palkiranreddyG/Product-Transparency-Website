import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import PDFDocument from 'pdfkit';
import Report from '../models/Report.js';
import Product from '../models/Product.js';
import Question from '../models/Question.js';
import Response from '../models/Response.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/reports/generate - Generate transparency report
router.post('/generate', authenticateToken, async (req, res) => {
  try {
    const { submissionId, productId, responses } = req.body;
    
    if (!submissionId || !productId) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'submissionId and productId are required'
      });
    }

    // Verify product belongs to user
    const product = await Product.findOne({ 
      _id: productId, 
      userId: req.userId 
    });

    if (!product) {
      return res.status(404).json({
        error: 'Product not found',
        message: 'Product not found or access denied'
      });
    }

    // Fetch questions and responses
    const questions = await Question.find({ productId }).sort({ stepNumber: 1 });
    const questionResponses = await Response.find({ 
      productId, 
      userId: req.userId,
      submissionId 
    });

    // Create response map
    const responseMap = {};
    questionResponses.forEach(response => {
      responseMap[response.questionId.toString()] = response.responseText;
    });

    // Create report data
    const reportData = {
      product: {
        name: product.productName,
        brand: product.brandName,
        category: product.category,
        description: product.description,
        created_at: product.createdAt
      },
      questions: questions.map(question => ({
        question: question.questionText,
        response: responseMap[question._id.toString()] || 'No response provided',
        step: question.stepNumber
      })),
      generated_at: new Date().toISOString(),
      report_id: uuidv4()
    };

    // Store report in database
    const report = new Report({
      productId: productId,
      userId: req.userId,
      submissionId: submissionId,
      reportData: reportData,
      status: 'completed',
      completedAt: new Date()
    });

    await report.save();

    res.status(201).json({
      success: true,
      message: 'Report generated successfully',
      data: {
        reportId: report._id,
        reportData
      }
    });

  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({
      error: 'Failed to generate report',
      message: error.message
    });
  }
});

// GET /api/reports/:reportId/pdf - Download report as PDF
router.get('/:reportId/pdf', authenticateToken, async (req, res) => {
  try {
    const { reportId } = req.params;
    
    // Fetch report data
    const report = await Report.findOne({ 
      _id: reportId, 
      userId: req.userId 
    });

    if (!report) {
      return res.status(404).json({
        error: 'Report not found',
        message: `No report found with ID: ${reportId}`
      });
    }

    const reportData = report.reportData;

    // Generate PDF
    const pdfBuffer = await generatePDFReport(reportData);

    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="transparency-report-${reportId}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    res.send(pdfBuffer);

  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({
      error: 'Failed to generate PDF',
      message: error.message
    });
  }
});

// GET /api/reports/:reportId - Get report data
router.get('/:reportId', authenticateToken, async (req, res) => {
  try {
    const { reportId } = req.params;
    
    const report = await Report.findOne({ 
      _id: reportId, 
      userId: req.userId 
    });

    if (!report) {
      return res.status(404).json({
        error: 'Report not found',
        message: `No report found with ID: ${reportId}`
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: report._id,
        status: report.status,
        reportData: report.reportData,
        createdAt: report.createdAt,
        completedAt: report.completedAt,
        pdfUrl: report.pdfUrl
      }
    });

  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({
      error: 'Failed to fetch report',
      message: error.message
    });
  }
});

// Helper function to generate PDF report
async function generatePDFReport(reportData) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margins: {
          top: 50,
          bottom: 50,
          left: 50,
          right: 50
        }
      });

      const chunks = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Header
      doc.fontSize(24)
         .fillColor('#2D5016') // Primary color from CSS
         .text('Product Transparency Report', { align: 'center' });
      
      doc.moveDown(1);

      // Product Information Section
      doc.fontSize(18)
         .fillColor('#1E40AF') // Secondary color
         .text('Product Information', { underline: true });
      
      doc.fontSize(12)
         .fillColor('black')
         .text(`Product Name: ${reportData.product.name}`, { indent: 20 })
         .text(`Brand: ${reportData.product.brand}`, { indent: 20 })
         .text(`Category: ${reportData.product.category}`, { indent: 20 })
         .text(`Description: ${reportData.product.description || 'Not provided'}`, { indent: 20 })
         .text(`Report Generated: ${new Date(reportData.generated_at).toLocaleDateString()}`, { indent: 20 });

      doc.moveDown(2);

      // Questions and Responses Section
      doc.fontSize(18)
         .fillColor('#1E40AF')
         .text('Transparency Assessment', { underline: true });

      reportData.questions.forEach((item, index) => {
        doc.moveDown(1);
        doc.fontSize(14)
           .fillColor('#059669') // Accent color
           .text(`Question ${item.step}: ${item.question}`, { indent: 10 });
        
        doc.fontSize(12)
           .fillColor('black')
           .text(`Response: ${item.response}`, { indent: 20 });
      });

      doc.moveDown(2);

      // Footer
      doc.fontSize(10)
         .fillColor('#6B7280')
         .text('Generated by ClearChoice Insight', { align: 'center' })
         .text('AI-powered Product Transparency Platform', { align: 'center' })
         .text(`Report ID: ${reportData.report_id}`, { align: 'center' });

      doc.end();

    } catch (error) {
      reject(error);
    }
  });
}

export default router;