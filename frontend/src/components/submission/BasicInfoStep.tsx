import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface BasicInfoStepProps {
  formData: {
    productName: string;
    brandName: string;
    description: string;
  };
  updateFormData: (data: Partial<BasicInfoStepProps["formData"]>) => void;
}

export const BasicInfoStep = ({ formData, updateFormData }: BasicInfoStepProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Basic Product Information</h2>
        <p className="text-muted-foreground">
          Let's start with the essentials about your product.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="productName" className="text-base font-medium">
            Product Name *
          </Label>
          <Input
            id="productName"
            placeholder="e.g., Organic Green Tea"
            value={formData.productName}
            onChange={(e) => updateFormData({ productName: e.target.value })}
            className="text-base"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="brandName" className="text-base font-medium">
            Brand Name *
          </Label>
          <Input
            id="brandName"
            placeholder="e.g., Pure Wellness Co."
            value={formData.brandName}
            onChange={(e) => updateFormData({ brandName: e.target.value })}
            className="text-base"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-base font-medium">
            Product Description
          </Label>
          <Textarea
            id="description"
            placeholder="Briefly describe your product, its purpose, and key features..."
            value={formData.description}
            onChange={(e) => updateFormData({ description: e.target.value })}
            className="min-h-32 text-base resize-none"
          />
          <p className="text-xs text-muted-foreground">
            This helps our AI generate more relevant questions
          </p>
        </div>
      </div>
    </div>
  );
};
