import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Use the CORRECT model: gemini-3.6-flash
const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

// Types
interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
  discount: number;
  discountType: 'percentage' | 'fixed';
}

interface ParsedInvoice {
  companyName: string;
  companyEmail: string;
  companyAddress: string;
  items: InvoiceItem[];
  taxRate: number;
  dueDate: string;
  notes: string;
}

interface CalculatedInvoice extends ParsedInvoice {
  subtotal: number;
  totalDiscount: number;
  taxAmount: number;
  total: number;
}

// Controller functions
export const invoiceAIController = {
  
  // Generate invoice from natural language
  async generateInvoice(req: Request, res: Response) {
    try {
      const { text } = req.body;
      
      if (!text) {
        return res.status(400).json({ 
          success: false, 
          message: 'Please provide invoice text' 
        });
      }

      console.log('Parsing text:', text);
      
      // Parse with Gemini
      const parsedData = await parseWithGemini(text);
      console.log('Parsed data:', parsedData);
      
      // Calculate totals
      const invoice = calculateTotals(parsedData);
      
      res.status(200).json({
        success: true,
        invoice
      });

    } catch (error: any) {
      console.error('Error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to generate invoice',
        error: error.message || 'Unknown error'
      });
    }
  },

  // Test parsing
  async testParse(req: Request, res: Response) {
    try {
      const { text } = req.body;
      
      if (!text) {
        return res.status(400).json({ 
          success: false, 
          message: 'Please provide text' 
        });
      }

      const parsedData = await parseWithGemini(text);
      const invoice = calculateTotals(parsedData);
      
      res.status(200).json({
        success: true,
        invoice
      });

    } catch (error: any) {
      console.error('Error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to parse text',
        error: error.message || 'Unknown error'
      });
    }
  }
};

// Helper: Parse with Gemini
async function parseWithGemini(text: string): Promise<ParsedInvoice> {
  const prompt = `You are an invoice parser. Extract details from: "${text}"
  
  Return ONLY a valid JSON object (no markdown, no code blocks, no explanations):
  {
    "companyName": "extracted company name",
    "companyEmail": "",
    "companyAddress": "",
    "items": [
      {
        "description": "product/service name",
        "quantity": 1,
        "price": 0,
        "discount": 0,
        "discountType": "percentage"
      }
    ],
    "taxRate": 0,
    "dueDate": "",
    "notes": ""
  }
  
  Rules:
  - Extract company name (look for Ltd, LLC, Inc, Company, Corp, Pvt)
  - "10k" means 10000, "5 thousand" means 5000
  - "40%" or "40 percent" means percentage discount
  - If no quantity mentioned, default to 1
  - If no tax mentioned, default to 0
  - Multiple products should be separate items
  - For "website product 10k", price should be 10000 and description "website"`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let textResponse = response.text();
    
    // Clean the response - remove any markdown or code block syntax
    textResponse = textResponse
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();
    
    console.log('Cleaned Gemini response:', textResponse);
    
    // Parse JSON
    try {
      return JSON.parse(textResponse);
    } catch (parseError) {
      // If direct parse fails, try to extract JSON from response
      const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('Could not parse response as JSON');
    }
    
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
}

// Helper: Calculate totals
function calculateTotals(invoice: ParsedInvoice): CalculatedInvoice {
  let subtotal = 0;
  let totalDiscount = 0;

  const items = invoice.items.map(item => {
    const itemTotal = item.quantity * item.price;
    const discountAmount = item.discountType === 'percentage' 
      ? (itemTotal * item.discount) / 100 
      : item.discount;

    subtotal += itemTotal;
    totalDiscount += discountAmount;

    return {
      ...item,
      originalAmount: itemTotal,
      discountAmount: discountAmount,
      finalAmount: itemTotal - discountAmount
    };
  });

  const afterDiscount = subtotal - totalDiscount;
  const taxAmount = (afterDiscount * (invoice.taxRate || 0)) / 100;
  const total = afterDiscount + taxAmount;

  return {
    ...invoice,
    items,
    subtotal,
    totalDiscount,
    taxAmount,
    total
  };
}