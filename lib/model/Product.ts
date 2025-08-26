// lib/model/Product.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
  _id: string;
  name: string;
  description: string;
  shortDescription?: string;
  category: mongoose.Types.ObjectId;
  price: number;
  discountedPrice?: number;
  currency: string;
  sku: string; // Stock Keeping Unit
  images: string[];
  // Antique jewelry specific fields
  material?: string; // e.g., "Gold", "Silver", "Platinum", "Bronze"
  period?: string; // e.g., "Victorian", "Art Deco", "Edwardian"
  origin?: string; // Country/region of origin
  weight?: number; // Weight in grams
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    unit: "mm" | "cm" | "inches";
  };
  gemstones?: Array<{
    type: string; // e.g., "Diamond", "Ruby", "Emerald"
    carat?: number;
    cut?: string;
    color?: string;
    clarity?: string;
  }>;
  condition: "excellent" | "very-good" | "good" | "fair" | "poor";
  authenticity: {
    certified: boolean;
    certificateNumber?: string;
    certifyingBody?: string; // e.g., "GIA", "AGS", "Independent Appraiser"
  };
  // Inventory
  stockQuantity: number;
  isInStock: boolean;
  // SEO and status
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  slug: string;
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [200, "Product name cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [3000, "Description cannot exceed 3000 characters"],
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: [300, "Short description cannot exceed 300 characters"],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    discountedPrice: {
      type: Number,
      min: [0, "Discounted price cannot be negative"],
      validate: {
        validator: function(this: IProduct, value: number) {
          return !value || value < this.price;
        },
        message: "Discounted price must be less than regular price"
      }
    },
    currency: {
      type: String,
      required: true,
      default: "USD",
      enum: ["JPY", "USD", "EUR", "GBP", "INR", "AUD", "CAD"],
    },
    sku: {
      type: String,
      required: [true, "SKU is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    // Antique jewelry specific fields
    material: {
      type: String,
      trim: true,
      maxlength: [100, "Material cannot exceed 100 characters"],
    },
    period: {
      type: String,
      trim: true,
      maxlength: [100, "Period cannot exceed 100 characters"],
    },
    origin: {
      type: String,
      trim: true,
      maxlength: [100, "Origin cannot exceed 100 characters"],
    },
    weight: {
      type: Number,
      min: [0, "Weight cannot be negative"],
    },
    dimensions: {
      length: {
        type: Number,
        min: [0, "Length cannot be negative"],
      },
      width: {
        type: Number,
        min: [0, "Width cannot be negative"],
      },
      height: {
        type: Number,
        min: [0, "Height cannot be negative"],
      },
      unit: {
        type: String,
        enum: ["mm", "cm", "inches"],
        default: "mm",
      },
    },
    gemstones: [
      {
        type: {
          type: String,
          required: true,
          trim: true,
        },
        carat: {
          type: Number,
          min: [0, "Carat cannot be negative"],
        },
        cut: {
          type: String,
          trim: true,
        },
        color: {
          type: String,
          trim: true,
        },
        clarity: {
          type: String,
          trim: true,
        },
      },
    ],
    condition: {
      type: String,
      required: true,
      enum: ["excellent", "very-good", "good", "fair", "poor"],
      default: "good",
    },
    authenticity: {
      certified: {
        type: Boolean,
        default: false,
      },
      certificateNumber: {
        type: String,
        trim: true,
      },
      certifyingBody: {
        type: String,
        trim: true,
      },
    },
    // Inventory
    stockQuantity: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock quantity cannot be negative"],
      default: 1,
    },
    isInStock: {
      type: Boolean,
      default: true,
    },
    // SEO and status
    tags: [
      {
        type: String,
        trim: true,
        maxlength: [50, "Each tag cannot exceed 50 characters"],
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: "products",
  }
);

// Create slug from name before saving
productSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  
  // Auto-generate SKU if not provided
  if (this.isNew && !this.sku) {
    const timestamp = Date.now().toString().slice(-6);
    const nameCode = this.name.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'X');
    this.sku = `${nameCode}${timestamp}`;
  }
  
  // Update stock status based on quantity
  this.isInStock = this.stockQuantity > 0;
  
  next();
});

// Indexes for better performance
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ slug: 1 });
productSchema.index({ sku: 1 });
productSchema.index({ isFeatured: 1, isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ tags: 1 });
productSchema.index({ material: 1 });
productSchema.index({ condition: 1 });
productSchema.index({ "authenticity.certified": 1 });

const Product =
  mongoose.models.Product ||
  mongoose.model<IProduct>("Product", productSchema);

export default Product;