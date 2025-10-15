import { useState, useCallback } from "react";
import { apiService, AIQuestion, generateSummaryWithGoogleAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

export interface FormData {
  productName: string;
  brandName: string;
  category: string;
  description: string;
}

/**
 * 🧠 Custom Hook — Handles all logic for the multi-step product submission workflow.
 * Features:
 *  - Create Product
 *  - Generate AI or fallback questions
 *  - Collect user responses
 *  - Generate final Gemini-powered summary
 *  - Handle loading, toast, and step flow
 */
export const useProductSubmission = () => {
  // Core State
  const [productId, setProductId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<AIQuestion[]>([]);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [summaryText, setSummaryText] = useState<string>(""); // Gemini AI summary
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  const { toast } = useToast();

  // ───────────────────────────────────────────────
  // STEP 2 — Create Product
  // ───────────────────────────────────────────────
  const createProduct = useCallback(
    async (formData: FormData) => {
      setIsLoading(true);
      try {
        console.log("🚀 Creating product with:", formData);
        const response = await apiService.createProduct(formData);

        const newId =
          response.data?.id ||
          response.data?.data?.id ||
          response.data?._id ||
          response.data?.data?._id;

        if (!newId) {
          console.warn("⚠️ No product ID returned, cannot advance to Step 3");
          toast({
            title: "Product created, but missing ID",
            description: "Please check backend response format.",
            variant: "destructive",
          });
          return null;
        }

        console.log("✅ Product API returned ID:", newId);
        setProductId(newId);

        toast({
          title: "Product created successfully",
          description: "Your product has been registered.",
        });

        return { id: newId };
      } catch (err: any) {
        console.error("❌ Product creation failed:", err);
        setError(err.message);
        toast({
          title: "Error creating product",
          description: err.message,
          variant: "destructive",
        });
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  // ───────────────────────────────────────────────
  // STEP 3 — Generate Questions
  // ───────────────────────────────────────────────
  const generateQuestions = useCallback(
    async (productInfo: FormData) => {
      if (!productId) throw new Error("Missing product ID");
      setIsLoading(true);
      try {
        const res = await apiService.generateQuestions({ productId, productInfo });
        const questionsList = res.data?.questions || [];
        if (!questionsList.length) throw new Error("No questions returned");

        console.log("✅ Questions generated:", questionsList.length);
        setQuestions(questionsList);
      } catch (err: any) {
        console.error("⚠️ Question generation failed:", err);
        toast({
          title: "Using fallback questions",
          description: "Default questions have been generated for your product.",
        });

        setQuestions([
          { id: "1", text: "What is the key feature of this product?", type: "fallback", step: 1 },
          { id: "2", text: "What materials or ingredients are used?", type: "fallback", step: 2 },
          { id: "3", text: "What benefit does it provide to consumers?", type: "fallback", step: 3 },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [productId, toast]
  );

  // ───────────────────────────────────────────────
  // STEP 4 — Generate Executive Summary via Gemini
  // ───────────────────────────────────────────────
  const generateSummary = useCallback(async (formData: FormData, responses: Record<string, string>) => {
    try {
      console.log("🧠 Generating product summary with Gemini...");
      const summary = await generateSummaryWithGoogleAPI(formData, responses);
      setSummaryText(summary);
      console.log("✅ Summary generated successfully:", summary);
      return summary;
    } catch (err) {
      console.error("⚠️ Failed to generate Gemini summary:", err);
      setSummaryText("This product demonstrates transparency, sustainability, and ethical commitment.");
      return "";
    }
  }, []);

  // ───────────────────────────────────────────────
  // STEP 5 — Final Report Submission
  // ───────────────────────────────────────────────
  const generateReport = useCallback(async () => {
    if (!productId) throw new Error("Missing product ID");
    setIsSubmitting(true);
    try {
      const res = await apiService.generateReport({ submissionId: productId, productId, responses });

      toast({
        title: "Report generated successfully",
        description: "Your transparency report is ready.",
      });

      return res.data;
    } catch (err: any) {
      console.error("❌ Report generation failed:", err);
      toast({
        title: "Error generating report",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, [productId, responses, toast]);

  // ───────────────────────────────────────────────
  // Return Hook Values
  // ───────────────────────────────────────────────
  return {
    productId,
    questions,
    responses,
    summaryText,
    isLoading,
    isSubmitting,
    error,
    currentStep,
    setCurrentStep,
    setResponses,
    createProduct,
    generateQuestions,
    generateSummary,
    generateReport,
    setProductId,
  };
};
