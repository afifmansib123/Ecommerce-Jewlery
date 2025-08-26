"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

// --- SHADCN/UI & OTHER COMPONENT IMPORTS ---
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { ArrowLeft, Gem, Plus, Trash2, Crown, Sparkles } from "lucide-react";
import Link from "next/link";

// --- FILEPOND IMPORTS ---
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";

registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType,
  FilePondPluginFileValidateSize
);

// --- ANTIQUE JEWELRY SPECIFIC OPTIONS ---
const CONDITION_OPTIONS = [
  { value: "excellent", label: "Excellent", description: "Museum quality, pristine condition" },
  { value: "very-good", label: "Very Good", description: "Minor signs of age, well preserved" },
  { value: "good", label: "Good", description: "Good condition with age-appropriate wear" },
  { value: "fair", label: "Fair", description: "Shows wear but structurally sound" },
  { value: "poor", label: "Poor", description: "Significant wear, may need restoration" }
];

const DIMENSION_UNITS = [
  { value: "mm", label: "Millimeters (mm)" },
  { value: "cm", label: "Centimeters (cm)" },
  { value: "inches", label: "Inches" }
];

interface Category {
  _id: string;
  name: string;
  slug: string;
  isActive: boolean;
}

// --- ZOD VALIDATION SCHEMA ---
const gemstoneschema = z.object({
  type: z.string().min(1, "Gemstone type is required"),
  carat: z.coerce.number().optional(),
  cut: z.string().optional(),
  color: z.string().optional(),
  clarity: z.string().optional(),
});

const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Product name must be at least 3 characters." }),
  description: z
    .string()
    .min(20, { message: "Description must be at least 20 characters." }),
  shortDescription: z.string().optional(),
  category: z
    .string({ required_error: "Please select a category." })
    .min(1, "Category is required."),
  price: z.coerce
    .number({ required_error: "Price is required." })
    .positive("Price must be a positive number."),
  discountedPrice: z.coerce.number().optional().nullable(),
  currency: z.string().default("USD"),
  sku: z.string().optional(),
  stockQuantity: z.coerce
    .number({ required_error: "Stock quantity is required." })
    .min(0, "Stock quantity cannot be negative."),
  condition: z.enum(["excellent", "very-good", "good", "fair", "poor"]),
  material: z.string().optional(),
  period: z.string().optional(),
  origin: z.string().optional(),
  weight: z.coerce.number().optional(),
  dimensions: z.object({
    length: z.coerce.number().optional(),
    width: z.coerce.number().optional(),
    height: z.coerce.number().optional(),
    unit: z.enum(["mm", "cm", "inches"]).default("mm"),
  }).optional(),
  gemstones: z.array(gemstoneschema).optional(),
  authenticity: z.object({
    certified: z.boolean().default(false),
    certificateNumber: z.string().optional(),
    certifyingBody: z.string().optional(),
  }),
  tags: z.array(z.string()).optional(),
  photos: z
    .array(z.instanceof(File))
    .min(1, { message: "At least one product photo is required." }),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});

type ProductFormData = z.infer<typeof formSchema>;

// --- API CALL FUNCTION ---
const createProductAPI = async (
  formData: FormData
): Promise<{ success: boolean; product?: any; message?: string }> => {
  console.log("API CALL (POST): /api/products...");
  try {
    const response = await fetch("/api/products", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (!response.ok)
      return {
        success: false,
        message: data.message || `Error: ${response.status}`,
      };
    return {
      success: true,
      product: data,
      message: "Antique piece added to collection successfully!",
    };
  } catch (error) {
    console.error("createProductAPI error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Network error",
    };
  }
};

// --- MAIN COMPONENT ---
const NewProductPage = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [tagInput, setTagInput] = useState("");

  const form = useForm<ProductFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      shortDescription: "",
      category: "",
      price: 0,
      discountedPrice: null,
      currency: "USD",
      sku: "",
      stockQuantity: 1,
      condition: "good",
      material: "",
      period: "",
      origin: "",
      weight: undefined,
      dimensions: {
        length: undefined,
        width: undefined,
        height: undefined,
        unit: "mm",
      },
      gemstones: [],
      authenticity: {
        certified: false,
        certificateNumber: "",
        certifyingBody: "",
      },
      tags: [],
      photos: [],
      isActive: true,
      isFeatured: false,
    },
  });

  const { control, handleSubmit, reset, watch, setValue } = form;

  // Watch gemstones to handle dynamic addition/removal
  const watchedGemstones = watch("gemstones") || [];
  const watchedTags = watch("tags") || [];

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await fetch("/api/categories?isActive=true");
        if (response.ok) {
          const data = await response.json();
          setCategories(data.categories || []);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Helper functions for dynamic arrays
  const addGemstone = () => {
    const currentGemstones = watchedGemstones || [];
    setValue("gemstones", [...currentGemstones, { type: "", carat: undefined, cut: "", color: "", clarity: "" }]);
  };

  const removeGemstone = (index: number) => {
    const currentGemstones = watchedGemstones || [];
    setValue("gemstones", currentGemstones.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (tagInput.trim() && !watchedTags.includes(tagInput.trim())) {
      setValue("tags", [...watchedTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setValue("tags", watchedTags.filter(tag => tag !== tagToRemove));
  };

  const onInvalid = (errors: any) => {
    console.error("Form validation failed:", errors);
    const errorFields = Object.keys(errors)
      .map((key) => key.charAt(0).toUpperCase() + key.slice(1))
      .join(", ");
    alert(
      `Please fix the errors before submitting.\n\nCheck the following fields: ${errorFields}`
    );
  };

  const onSubmit: SubmitHandler<ProductFormData> = async (submittedData) => {
    setIsSubmitting(true);
    setSubmitMessage(null);

    if (!user) {
      setSubmitMessage({
        type: "error",
        text: "Authentication error. Please log in.",
      });
      setIsSubmitting(false);
      return;
    }

    const formDataToSubmit = new FormData();

    // Handle regular fields
    Object.entries(submittedData).forEach(([key, value]) => {
      const K = key as keyof ProductFormData;
      if (K === "photos") return;

      // Handle complex objects and arrays
      if (Array.isArray(value) || typeof value === 'object') {
        formDataToSubmit.append(K, JSON.stringify(value || []));
      } else if (value !== undefined && value !== null && value !== "") {
        formDataToSubmit.append(K, String(value));
      }
    });

    // Handle product photos
    if (submittedData.photos && submittedData.photos.length > 0) {
      submittedData.photos.forEach((file) =>
        formDataToSubmit.append("photos", file)
      );
    }

    const response = await createProductAPI(formDataToSubmit);
    if (response.success) {
      setSubmitMessage({
        type: "success",
        text: response.message || "Product created successfully!",
      });
      reset();
      setTimeout(() => {
        router.push("/admin/products");
      }, 2000);
    } else {
      setSubmitMessage({
        type: "error",
        text: response.message || "Failed to create product.",
      });
    }
    setIsSubmitting(false);
  };

  const sectionCardClassName = "bg-gradient-to-br from-amber-50 to-orange-50 shadow-lg rounded-xl p-6 border border-amber-200";
  const sectionTitleClassName = "text-xl font-bold text-amber-900 mb-1 flex items-center";
  const sectionDescriptionClassName = "text-sm text-amber-700 mb-6";

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-8 px-4 sm:px-6 lg:px-8">
      <header className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Button asChild variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-100">
            <Link href="/admin/products">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Collection
            </Link>
          </Button>
        </div>

        <h1 className="text-4xl font-bold text-amber-900 flex items-center">
          <Crown className="h-8 w-8 mr-3 text-amber-600" />
          Add New Antique Treasure
        </h1>
        <div className="text-lg text-amber-700 mt-2">
          <p>Catalog a precious piece for your antique jewelry collection</p>
        </div>
      </header>

      {submitMessage && (
        <div
          className={`mb-6 p-4 rounded-lg border ${
            submitMessage.type === "success"
              ? "bg-green-50 text-green-800 border-green-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {submitMessage.text}
        </div>
      )}

      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit, onInvalid)}
          className="space-y-8"
        >
          {/* Product Overview */}
          <div className={sectionCardClassName}>
            <h2 className={sectionTitleClassName}>
              <Gem className="h-5 w-5 mr-2" />
              Essential Details
            </h2>
            <p className={sectionDescriptionClassName}>
              Basic information about this antique piece
            </p>
            <div className="space-y-4">
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-amber-900">Piece Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Victorian Rose Gold Brooch"
                        {...field}
                        className="border-amber-300 focus:border-amber-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-amber-900">SKU (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Auto-generated if empty"
                          {...field}
                          className="border-amber-300 focus:border-amber-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-amber-900">Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={categoriesLoading}
                      >
                        <FormControl>
                          <SelectTrigger className="border-amber-300 focus:border-amber-500">
                            <SelectValue
                              placeholder={
                                categoriesLoading
                                  ? "Loading..."
                                  : "-- Select Category --"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category._id} value={category._id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={control}
                name="shortDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-amber-900">Short Description (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Brief description for listings..."
                        {...field}
                        className="border-amber-300 focus:border-amber-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-amber-900">Full Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Detailed description including history, craftsmanship, and unique features..."
                        rows={5}
                        {...field}
                        className="border-amber-300 focus:border-amber-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className={sectionCardClassName}>
            <h2 className={sectionTitleClassName}>
              <Sparkles className="h-5 w-5 mr-2" />
              Pricing & Inventory
            </h2>
            <p className={sectionDescriptionClassName}>
              Set pricing and manage stock levels
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <FormField
                control={control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-amber-900">Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        className="border-amber-300 focus:border-amber-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="discountedPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-amber-900">Sale Price (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? null : Number(value));
                        }}
                        className="border-amber-300 focus:border-amber-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-amber-900">Currency</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-amber-300">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="JPY">JPY (¥)</SelectItem>
                        <SelectItem value="CAD">CAD ($)</SelectItem>
                        <SelectItem value="AUD">AUD ($)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="stockQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-amber-900">Stock Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        {...field}
                        className="border-amber-300 focus:border-amber-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Antique Details */}
          <div className={sectionCardClassName}>
            <h2 className={sectionTitleClassName}>
              <Crown className="h-5 w-5 mr-2" />
              Antique Characteristics
            </h2>
            <p className={sectionDescriptionClassName}>
              Specific details about this antique piece
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FormField
                control={control}
                name="condition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-amber-900">Condition</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-amber-300">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CONDITION_OPTIONS.map((condition) => (
                          <SelectItem key={condition.value} value={condition.value}>
                            <div>
                              <div className="font-medium">{condition.label}</div>
                              <div className="text-xs text-gray-600">{condition.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="material"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-amber-900">Material</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., 18K Gold, Sterling Silver"
                        {...field}
                        className="border-amber-300 focus:border-amber-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="period"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-amber-900">Historical Period</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Victorian, Art Deco"
                        {...field}
                        className="border-amber-300 focus:border-amber-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="origin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-amber-900">Origin</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., France, England"
                        {...field}
                        className="border-amber-300 focus:border-amber-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-amber-900">Weight (grams)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.1"
                        placeholder="0.0"
                        {...field}
                        className="border-amber-300 focus:border-amber-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Dimensions */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-amber-900 mb-4">Dimensions (Optional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <FormField
                  control={control}
                  name="dimensions.length"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-amber-900">Length</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          step="0.1"
                          {...field}
                          className="border-amber-300 focus:border-amber-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="dimensions.width"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-amber-900">Width</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          step="0.1"
                          {...field}
                          className="border-amber-300 focus:border-amber-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="dimensions.height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-amber-900">Height</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          step="0.1"
                          {...field}
                          className="border-amber-300 focus:border-amber-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="dimensions.unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-amber-900">Unit</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-amber-300">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {DIMENSION_UNITS.map((unit) => (
                            <SelectItem key={unit.value} value={unit.value}>
                              {unit.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Gemstones */}
          <div className={sectionCardClassName}>
            <h2 className={sectionTitleClassName}>
              <Sparkles className="h-5 w-5 mr-2" />
              Gemstones (Optional)
            </h2>
            <p className={sectionDescriptionClassName}>
              Add details about any gemstones in this piece
            </p>
            <div className="space-y-4">
              {watchedGemstones.map((gemstone, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border border-amber-200 rounded-lg bg-white/50">
                  <FormField
                    control={control}
                    name={`gemstones.${index}.type`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-amber-900">Type</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Diamond"
                            {...field}
                            className="border-amber-300 focus:border-amber-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name={`gemstones.${index}.carat`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-amber-900">Carat</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            {...field}
                            className="border-amber-300 focus:border-amber-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name={`gemstones.${index}.cut`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-amber-900">Cut</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Round"
                            {...field}
                            className="border-amber-300 focus:border-amber-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name={`gemstones.${index}.color`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-amber-900">Color</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., D"
                            {...field}
                            className="border-amber-300 focus:border-amber-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeGemstone(index)}
                      className="w-full"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                onClick={addGemstone}
                className="border-amber-300 text-amber-700 hover:bg-amber-50"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Gemstone
              </Button>
            </div>
          </div>

          {/* Authenticity */}
          <div className={sectionCardClassName}>
            <h2 className={sectionTitleClassName}>
              <Crown className="h-5 w-5 mr-2" />
              Authentication
            </h2>
            <p className={sectionDescriptionClassName}>
              Certification and authenticity details
            </p>
            <div className="space-y-4">
              <FormField
                control={control}
                name="authenticity.certified"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-amber-900">
                      This piece is certified authentic
                    </FormLabel>
                  </FormItem>
                )}
              />

              {watch("authenticity.certified") && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
                  <FormField
                    control={control}
                    name="authenticity.certificateNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-amber-900">Certificate Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., GIA-123456"
                            {...field}
                            className="border-amber-300 focus:border-amber-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="authenticity.certifyingBody"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-amber-900">Certifying Organization</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., GIA, AGS"
                            {...field}
                            className="border-amber-300 focus:border-amber-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className={sectionCardClassName}>
            <h2 className={sectionTitleClassName}>
              <Sparkles className="h-5 w-5 mr-2" />
              Tags
            </h2>
            <p className={sectionDescriptionClassName}>
              Add keywords to help customers find this piece
            </p>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="border-amber-300 focus:border-amber-500"
                />
                <Button
                  type="button"
                  onClick={addTag}
                  variant="outline"
                  className="border-amber-300 text-amber-700 hover:bg-amber-50"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {watchedTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {watchedTags.map((tag, index) => (
                    <div key={index} className="flex items-center gap-1 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">
                      <span>{tag}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTag(tag)}
                        className="h-4 w-4 p-0 hover:bg-amber-200"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Photos */}
          <div className={sectionCardClassName}>
            <h2 className={sectionTitleClassName}>
              <Gem className="h-5 w-5 mr-2" />
              Product Photos
            </h2>
            <FormField
              control={control}
              name="photos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-amber-900">Product Photos (Required)</FormLabel>
                  <FormDescription className="text-amber-700">
                    Upload high-quality photos showcasing this antique piece. JPG, PNG, WEBP accepted. Max 5MB each.
                  </FormDescription>
                  <FormControl>
                    <FilePond
                      files={field.value as File[]}
                      onupdatefiles={(fileItems) =>
                        field.onChange(
                          fileItems.map((item) => item.file as File)
                        )
                      }
                      allowMultiple={true}
                      maxFiles={10}
                      name="photos"
                      labelIdle={`Drag & Drop your photos or <span class="filepond--label-action">Browse</span>`}
                      allowImagePreview={true}
                      imagePreviewHeight={160}
                      acceptedFileTypes={[
                        "image/png",
                        "image/jpeg",
                        "image/webp",
                      ]}
                      allowFileSizeValidation={true}
                      maxFileSize="5MB"
                      credits={false}
                      stylePanelAspectRatio="1:1"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Product Settings */}
          <div className={sectionCardClassName}>
            <h2 className={sectionTitleClassName}>
              <Crown className="h-5 w-5 mr-2" />
              Display Settings
            </h2>
            <p className={sectionDescriptionClassName}>
              Control how this piece appears in your collection
            </p>
            <div className="space-y-6">
              <FormField
                control={control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border border-amber-200 p-4 bg-white/50">
                    <div className="space-y-0.5">
                      <FormLabel className="text-amber-900 font-medium">
                        Make Active
                      </FormLabel>
                      <FormDescription className="text-amber-700">
                        Show this piece to customers in your collection
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border border-amber-200 p-4 bg-white/50">
                    <div className="space-y-0.5">
                      <FormLabel className="text-amber-900 font-medium">
                        Feature this Piece
                      </FormLabel>
                      <FormDescription className="text-amber-700">
                        Highlight this piece in featured collections and homepage
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Submission */}
          <div className="pt-4">
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white py-3 text-lg font-semibold shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Adding to Collection...
                </>
              ) : (
                <>
                  <Crown className="h-5 w-5 mr-2" />
                  Add to Antique Collection
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NewProductPage;