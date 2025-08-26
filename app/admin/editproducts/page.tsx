"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

// --- COMPONENT IMPORTS ---
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { ArrowLeft, Gem, Crown, Sparkles, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

// --- ZOD VALIDATION SCHEMA ---
const gemstoneschema = z.object({
  type: z.string().min(1, "Gemstone type is required"),
  carat: z.coerce.number().optional(),
  cut: z.string().optional(),
  color: z.string().optional(),
  clarity: z.string().optional(),
});

const formSchema = z.object({
  name: z.string().min(3, { message: "Product name must be at least 3 characters." }),
  description: z.string().min(20, { message: "Description must be at least 20 characters." }),
  shortDescription: z.string().optional(),
  category: z.string({ required_error: "Please select a category." }).min(1, "Category is required."),
  price: z.coerce.number({ required_error: "Price is required." }).positive("Price must be a positive number."),
  discountedPrice: z.coerce.number().optional().nullable(),
  currency: z.string().default("USD"),
  sku: z.string().optional(),
  stockQuantity: z.coerce.number({ required_error: "Stock quantity is required." }).min(0, "Stock quantity cannot be negative."),
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
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});

type ProductFormData = z.infer<typeof formSchema>;

interface Category {
  _id: string;
  name: string;
}

// --- CONDITION OPTIONS ---
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

// --- MAIN COMPONENT ---
const EditProductPage = () => {
  const params = useParams();
  const productId = params.id as string;
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useLanguage();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tagInput, setTagInput] = useState("");

  const form = useForm<ProductFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const { watch, setValue } = form;
  const watchedGemstones = watch("gemstones") || [];
  const watchedTags = watch("tags") || [];

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
  
  // --- DATA FETCHING AND FORM POPULATION ---
  useEffect(() => {
    if (!productId) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch categories and the specific product in parallel
        const [categoriesResponse, productResponse] = await Promise.all([
          fetch('/api/categories?isActive=true'),
          fetch(`/api/products/${productId}?populate=true`)
        ]);

        if (!categoriesResponse.ok || !productResponse.ok) {
          throw new Error('Failed to fetch initial data.');
        }

        const categoriesData = await categoriesResponse.json();
        const productData = await productResponse.json();

        setCategories(categoriesData.categories || []);

        // Populate the form with the fetched product data
        form.reset({
          name: productData.name,
          description: productData.description,
          shortDescription: productData.shortDescription || "",
          category: typeof productData.category === 'object' ? productData.category._id : productData.category,
          price: productData.price,
          discountedPrice: productData.discountedPrice || null,
          currency: productData.currency || "USD",
          sku: productData.sku || "",
          stockQuantity: productData.stockQuantity || 1,
          condition: productData.condition || "good",
          material: productData.material || "",
          period: productData.period || "",
          origin: productData.origin || "",
          weight: productData.weight || undefined,
          dimensions: productData.dimensions || { length: undefined, width: undefined, height: undefined, unit: "mm" },
          gemstones: productData.gemstones || [],
          authenticity: productData.authenticity || { certified: false, certificateNumber: "", certifyingBody: "" },
          tags: productData.tags || [],
          isActive: productData.isActive !== undefined ? productData.isActive : true,
          isFeatured: productData.isFeatured !== undefined ? productData.isFeatured : false,
        });

      } catch (error) {
        console.error("Failed to fetch product data:", error);
        toast.error("Failed to load product data. Please try again.");
        router.push("/admin/products");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [productId, form, router]);

  // --- FORM SUBMISSION HANDLER ---
  const onSubmit: SubmitHandler<ProductFormData> = async (submittedData) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submittedData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update product.');
      }

      toast.success("Antique piece updated successfully!");
      router.push("/admin/products");
      
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error instanceof Error ? error.message : "An unknown error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-300 border-t-amber-600 mx-auto"></div>
          <p className="mt-4 text-amber-700 font-medium">Loading treasure details...</p>
        </div>
      </div>
    );
  }

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
          Edit Antique Treasure
        </h1>
        <p className="text-lg text-amber-700 mt-2">Update details for this precious piece</p>
      </header>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
              <FormField name="name" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-amber-900">Piece Name</FormLabel>
                  <FormControl>
                    <Input {...field} className="border-amber-300 focus:border-amber-500" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField name="sku" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-amber-900">SKU</FormLabel>
                    <FormControl>
                      <Input {...field} className="border-amber-300 focus:border-amber-500" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField name="category" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-amber-900">Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-amber-300">
                          <SelectValue placeholder="-- Select Category --" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map(c => (
                          <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField name="shortDescription" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-amber-900">Short Description</FormLabel>
                  <FormControl>
                    <Input {...field} className="border-amber-300 focus:border-amber-500" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="description" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-amber-900">Full Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={5} className="border-amber-300 focus:border-amber-500" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
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
              <FormField name="price" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-amber-900">Price</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} className="border-amber-300 focus:border-amber-500" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="discountedPrice" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-amber-900">Sale Price (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      step="0.01"
                      value={field.value ?? ''} 
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === "" ? null : Number(value));
                      }}
                      className="border-amber-300 focus:border-amber-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="currency" control={form.control} render={({ field }) => (
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
              )} />

              <FormField name="stockQuantity" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-amber-900">Stock Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} className="border-amber-300 focus:border-amber-500" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          </div>

          {/* Antique Details */}
          <div className={sectionCardClassName}>
            <h2 className={sectionTitleClassName}>
              <Crown className="h-5 w-5 mr-2" />
              Antique Characteristics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FormField name="condition" control={form.control} render={({ field }) => (
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
              )} />

              <FormField name="material" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-amber-900">Material</FormLabel>
                  <FormControl>
                    <Input {...field} className="border-amber-300 focus:border-amber-500" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="period" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-amber-900">Historical Period</FormLabel>
                  <FormControl>
                    <Input {...field} className="border-amber-300 focus:border-amber-500" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="origin" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-amber-900">Origin</FormLabel>
                  <FormControl>
                    <Input {...field} className="border-amber-300 focus:border-amber-500" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="weight" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-amber-900">Weight (grams)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.1" {...field} className="border-amber-300 focus:border-amber-500" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* Dimensions */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-amber-900 mb-4">Dimensions</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <FormField name="dimensions.length" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-amber-900">Length</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} className="border-amber-300 focus:border-amber-500" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField name="dimensions.width" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-amber-900">Width</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} className="border-amber-300 focus:border-amber-500" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField name="dimensions.height" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-amber-900">Height</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} className="border-amber-300 focus:border-amber-500" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField name="dimensions.unit" control={form.control} render={({ field }) => (
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
                )} />
              </div>
            </div>
          </div>

          {/* Gemstones */}
          <div className={sectionCardClassName}>
            <h2 className={sectionTitleClassName}>
              <Sparkles className="h-5 w-5 mr-2" />
              Gemstones
            </h2>
            <div className="space-y-4">
              {watchedGemstones.map((gemstone, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border border-amber-200 rounded-lg bg-white/50">
                  <FormField
                    control={form.control}
                    name={`gemstones.${index}.type`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-amber-900">Type</FormLabel>
                        <FormControl>
                          <Input {...field} className="border-amber-300 focus:border-amber-500" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`gemstones.${index}.carat`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-amber-900">Carat</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} className="border-amber-300 focus:border-amber-500" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`gemstones.${index}.cut`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-amber-900">Cut</FormLabel>
                        <FormControl>
                          <Input {...field} className="border-amber-300 focus:border-amber-500" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`gemstones.${index}.color`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-amber-900">Color</FormLabel>
                        <FormControl>
                          <Input {...field} className="border-amber-300 focus:border-amber-500" />
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
            <div className="space-y-4">
              <FormField name="authenticity.certified" control={form.control} render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="text-amber-900">This piece is certified authentic</FormLabel>
                </FormItem>
              )} />

              {watch("authenticity.certified") && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
                  <FormField name="authenticity.certificateNumber" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-amber-900">Certificate Number</FormLabel>
                      <FormControl>
                        <Input {...field} className="border-amber-300 focus:border-amber-500" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField name="authenticity.certifyingBody" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-amber-900">Certifying Organization</FormLabel>
                      <FormControl>
                        <Input {...field} className="border-amber-300 focus:border-amber-500" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
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
          
          {/* Settings */}
          <div className={sectionCardClassName}>
            <h2 className={sectionTitleClassName}>
              <Crown className="h-5 w-5 mr-2" />
              Display Settings
            </h2>
            <div className="space-y-6">
              <FormField name="isActive" control={form.control} render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-amber-200 p-4 bg-white/50">
                  <div className="space-y-0.5">
                    <FormLabel className="text-amber-900 font-medium">Make Active</FormLabel>
                    <FormDescription className="text-amber-700">Show this piece to customers</FormDescription>
                  </div>
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )} />

              <FormField name="isFeatured" control={form.control} render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-amber-200 p-4 bg-white/50">
                  <div className="space-y-0.5">
                    <FormLabel className="text-amber-900 font-medium">Feature this Piece</FormLabel>
                    <FormDescription className="text-amber-700">Highlight in featured collections</FormDescription>
                  </div>
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )} />
            </div>
          </div>

          <div className="pt-4">
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white py-3 text-lg font-semibold shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Saving Changes...
                </>
              ) : (
                <>
                  <Crown className="h-5 w-5 mr-2" />
                  Update Antique Piece
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditProductPage;