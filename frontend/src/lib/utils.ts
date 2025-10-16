import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Validates if all required fields in the current step are filled.
 * @param step - The current step number (1-5)
 * @param formData - The form data object
 * @param responses - The responses object
 * @param questions - The questions array (for step 3)
 * @returns true if all required fields are filled, false otherwise
 */
export function validateStep(
  step: number,
  formData: { productName: string; brandName: string; category: string; description: string },
  responses: Record<string, string>,
  questions: { id: string; text: string }[]
): boolean {
  switch (step) {
    case 1:
      // Basic Info: productName, brandName, description (all mandatory)
      return !!(formData.productName.trim() && formData.brandName.trim() && formData.description.trim());
    case 2:
      // Category: category must be selected
      return !!formData.category;
    case 3:
      // Questions: All AI-generated questions must have responses
      return questions.every(q => responses[q.id]?.trim());
    case 4:
      // Additional Details: additionalInfo must be filled
      return !!responses["additionalInfo"]?.trim();
    case 5:
      // Summary: Validate all previous steps before generating report
      return (
        validateStep(1, formData, responses, questions) &&
        validateStep(2, formData, responses, questions) &&
        validateStep(3, formData, responses, questions) &&
        validateStep(4, formData, responses, questions)
      );
    default:
      return false;
  }
}
