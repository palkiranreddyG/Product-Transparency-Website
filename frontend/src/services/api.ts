// frontend/src/services/api.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? "https://clearchoice-insight-backend.vercel.app"
    : "http://localhost:3001");

export interface CreateProductRequest {
  productName: string;
  brandName: string;
  category: string;
  description?: string;
}

export interface AIQuestion {
  id: string;
  text: string;
  type: "ai_generated" | "fallback";
  step: number;
}

export interface GenerateQuestionsRequest {
  productId: string;
  productInfo: {
    productName: string;
    brandName: string;
    category: string;
    description?: string;
  };
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("cci_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...this.getAuthHeaders(),
      ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      let errorText = "";
      try {
        const errJson = await response.json();
        errorText = errJson.message || JSON.stringify(errJson);
      } catch {
        errorText = response.statusText;
      }
      throw new Error(`API error (${response.status}): ${errorText}`);
    }

    return response.json();
  }

  async login(data: { email: string; password: string }) {
    return this.request<{ success: boolean; message: string; data: { user: any; token: string } }>(
      "/api/auth/login",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  }

  async register(data: { firstName: string; lastName: string; email: string; password: string }) {
    return this.request<{ success: boolean; message: string; data: { user: any; token: string } }>(
      "/api/auth/register",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  }

  async createProduct(data: CreateProductRequest) {
    return this.request<{ success: boolean; data: { id: string } }>(
      "/api/products",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  }

  async generateQuestions(data: GenerateQuestionsRequest) {
    return this.request<{
      success: boolean;
      message: string;
      data: { productId: string; questions: AIQuestion[] };
    }>("/api/questions/generate", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async submitResponse(questionId: string, data: any) {
    return this.request(`/api/questions/${questionId}/response`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async generateReport(data: any) {
    return this.request("/api/reports/generate", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async downloadReportPDF(reportId: string): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/api/reports/${reportId}/pdf`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to download report");
    return response.blob();
  }
}

const apiService = new ApiService();

/** ✨ Google Gemini summary generator */
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY || "");

export async function generateSummaryWithGoogleAPI(formData: any, responses: Record<string, string>) {
  try {
    const prompt = `
      Generate a concise, professional summary (120 words max) for a product transparency report.

      Product Name: ${formData.productName}
      Brand: ${formData.brandName}
      Category: ${formData.category}
      Description: ${formData.description || "N/A"}
      Additional Info: ${responses["additionalInfo"] || "N/A"}

      Write this as a neutral summary focusing on transparency, sustainability, and trustworthiness.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (err) {
    console.error("⚠️ Gemini summary API failed:", err);
    return "This product emphasizes transparency, sustainability, and consumer trust through responsible practices.";
  }
}

export { apiService };
