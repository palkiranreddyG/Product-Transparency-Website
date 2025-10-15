import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Apple, Shirt, Home, Heart, Cpu, Sparkles } from "lucide-react";

interface CategoryStepProps {
  formData: {
    category: string;
  };
  updateFormData: (data: Partial<CategoryStepProps["formData"]>) => void;
}

const categories = [
  { value: "food-beverage", label: "Food & Beverage", icon: Apple },
  { value: "fashion-apparel", label: "Fashion & Apparel", icon: Shirt },
  { value: "home-living", label: "Home & Living", icon: Home },
  { value: "health-wellness", label: "Health & Wellness", icon: Heart },
  { value: "electronics", label: "Electronics", icon: Cpu },
  { value: "other", label: "Other", icon: Sparkles },
];

export const CategoryStep = ({ formData, updateFormData }: CategoryStepProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Product Category</h2>
        <p className="text-muted-foreground">
          Select the category that best describes your product. This helps us ask the right questions.
        </p>
      </div>

      <RadioGroup
        value={formData.category}
        onValueChange={(value) => updateFormData({ category: value })}
        className="grid grid-cols-1 gap-4 md:grid-cols-2"
      >
        {categories.map(({ value, label, icon: Icon }) => (
          <Label
            key={value}
            htmlFor={value}
            className={`glass flex cursor-pointer items-center gap-4 rounded-xl p-4 transition-all hover:shadow-lg ${
              formData.category === value
                ? "ring-2 ring-primary bg-primary/5"
                : ""
            }`}
          >
            <RadioGroupItem value={value} id={value} className="sr-only" />
            <div className={`flex h-12 w-12 items-center justify-center rounded-full ${
              formData.category === value
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
            }`}>
              <Icon className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <div className="font-medium">{label}</div>
            </div>
            {formData.category === value && (
              <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-primary-foreground" />
              </div>
            )}
          </Label>
        ))}
      </RadioGroup>
    </div>
  );
};
