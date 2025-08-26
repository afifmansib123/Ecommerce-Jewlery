// app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import Product, { IProduct } from "@/lib/model/Product";
import Category from "@/lib/model/Category";
import mongoose from "mongoose";
import { uploadFileToS3 } from "@/lib/s3";

// Force this route to be dynamic
export const dynamic = "force-dynamic";

// GET - Fetch all products
export async function GET(request: NextRequest) {
  console.log("🚀 GET /api/products - Starting...");

  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const isActive = searchParams.get("isActive");
    const isFeatured = searchParams.get("isFeatured");
    const condition = searchParams.get("condition");
    const material = searchParams.get("material");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const inStock = searchParams.get("inStock");
    const certified = searchParams.get("certified");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const populate = searchParams.get("populate") === "true";

    console.log("📥 Query parameters:", {
      category,
      isActive,
      isFeatured,
      condition,
      material,
      minPrice,
      maxPrice,
      inStock,
      certified,
      search,
      page,
      limit,
      sortBy,
      sortOrder,
      populate,
    });

    // Connect to database
    console.log("🔌 Connecting to database...");
    await db.connect();
    console.log("✅ Database connected successfully");

    // Build query
    const query: any = {};

    if (category && mongoose.Types.ObjectId.isValid(category)) {
      query.category = category;
    }

    if (isActive !== null && isActive !== undefined) {
      query.isActive = isActive === "true";
    }

    if (isFeatured !== null && isFeatured !== undefined) {
      query.isFeatured = isFeatured === "true";
    }

    if (condition) {
      query.condition = condition;
    }

    if (material) {
      query.material = { $regex: material, $options: "i" };
    }

    if (inStock !== null && inStock !== undefined) {
      query.isInStock = inStock === "true";
    }

    if (certified !== null && certified !== undefined) {
      query["authenticity.certified"] = certified === "true";
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
        { sku: { $regex: search, $options: "i" } },
      ];
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    console.log("🔍 Executing query:", { query, skip, limit, sort });

    // Build query
    let productsQuery = Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    if (populate) {
      productsQuery = productsQuery.populate(
        "category",
        "name description slug"
      );
    }

    // Fetch products with pagination
    const [products, totalCount] = await Promise.all([
      productsQuery.lean(),
      Product.countDocuments(query),
    ]);

    console.log("📊 Found products:", products.length);

    const totalPages = Math.ceil(totalCount / limit);

    const response = {
      products: products,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };

    console.log("📤 Returning products with pagination");
    return NextResponse.json(response);
  } catch (error: any) {
    console.error("💥 Error in GET /api/products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products", details: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new product
export async function POST(request: NextRequest) {
  console.log("🚀 POST /api/products - Starting...");

  try {
    // Parse multipart/form-data
    const formData = await request.formData();
    console.log("📥 FormData received, processing...");

    // Extract basic fields
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const shortDescription = formData.get("shortDescription") as string | null;
    const category = formData.get("category") as string;
    const price = formData.get("price") as string;
    const discountedPrice = formData.get("discountedPrice") as string | null;
    const currency = formData.get("currency") as string;
    const sku = formData.get("sku") as string | null;
    const stockQuantity = formData.get("stockQuantity") as string;
    const condition = formData.get("condition") as string;
    
    // Antique jewelry specific fields
    const material = formData.get("material") as string | null;
    const period = formData.get("period") as string | null;
    const origin = formData.get("origin") as string | null;
    const weight = formData.get("weight") as string | null;
    
    // Complex fields
    const photos = formData.getAll("photos") as File[];
    const tags = JSON.parse((formData.get("tags") as string) || "[]") as string[];
    const dimensions = formData.get("dimensions") ? JSON.parse(formData.get("dimensions") as string) : null;
    const gemstones = formData.get("gemstones") ? JSON.parse(formData.get("gemstones") as string) : [];
    const authenticity = formData.get("authenticity") ? JSON.parse(formData.get("authenticity") as string) : { certified: false };
    
    const isActive = formData.get("isActive") === "true";
    const isFeatured = formData.get("isFeatured") === "true";

    // Validate required fields
    const requiredFields = { name, description, category, price, stockQuantity };
    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key, _]) => key);

    if (missingFields.length > 0) {
      console.error("❌ Missing required fields:", missingFields);
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    console.log(`Found ${photos.length} photos to upload.`);
    const uploadedImageUrls: string[] = [];

    // Upload images if provided
    if (photos && photos.length > 0 && photos[0].size > 0) {
      const uploadPromises = photos.map((photo) => uploadFileToS3(photo));
      const urls = await Promise.all(uploadPromises);
      uploadedImageUrls.push(...urls);
      console.log("✅ All photos uploaded successfully. URLs:", uploadedImageUrls);
    } else {
      console.log("No valid photos found to upload.");
    }

    // Connect to database
    await db.connect();

    // Verify category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 400 }
      );
    }

    // Create new product
    const productData: any = {
      name: name.trim(),
      description: description.trim(),
      shortDescription: shortDescription?.trim(),
      category,
      price: parseFloat(price),
      discountedPrice: discountedPrice && discountedPrice !== "0" ? parseFloat(discountedPrice) : undefined,
      currency: currency || "USD",
      sku: sku?.trim(),
      stockQuantity: parseInt(stockQuantity, 10),
      condition: condition || "good",
      material: material?.trim(),
      period: period?.trim(),
      origin: origin?.trim(),
      weight: weight ? parseFloat(weight) : undefined,
      dimensions,
      gemstones,
      authenticity,
      images: uploadedImageUrls,
      tags: tags || [],
      isActive,
      isFeatured,
    };

    const newProduct = new Product(productData);
    const savedProduct = await newProduct.save();
    
    console.log("✅ Product saved successfully with ID:", savedProduct._id);

    await savedProduct.populate("category", "name description slug");
    const productObj = db.convertDocToObj(savedProduct);

    return NextResponse.json(productObj, { status: 201 });
  } catch (error: any) {
    console.error("💥 Error in POST /api/products:", error);
    
    if (error.name === "ValidationError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    
    if (error.code === 11000) {
      const field = error.keyPattern?.sku ? "SKU" : "slug";
      return NextResponse.json(
        { error: `Product with this ${field} already exists` },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to create product", details: error.message },
      { status: 500 }
    );
  }
}