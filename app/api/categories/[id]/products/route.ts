// app/api/categories/[id]/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import Product from "@/lib/model/Product";
import Category from "@/lib/model/Category";
import mongoose from "mongoose";

// Force this route to be dynamic
export const dynamic = "force-dynamic";

interface CategoryDocument {
  _id: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  slug: string;
  isActive: boolean;
}

// GET - Fetch all products for a specific category
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log("🚀 GET /api/categories/[id]/products - Starting...");

  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
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

    console.log("📥 Category ID:", id);
    console.log("📥 Query parameters:", {
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
    });

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error("❌ Invalid category ID format:", id);
      return NextResponse.json(
        { error: "Invalid category ID format" },
        { status: 400 }
      );
    }

    // Connect to database
    console.log("🔌 Connecting to database...");
    await db.connect();
    console.log("✅ Database connected successfully");

    // Verify category exists
    const category = (await Category.findById(
      id
    ).lean()) as CategoryDocument | null;
    if (!category) {
      console.error("❌ Category not found:", id);
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Build query
    const query: any = { category: id };

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

    // Fetch products with pagination
    const [products, totalCount] = await Promise.all([
      Product.find(query)
        .populate("category", "name description slug")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query),
    ]);

    console.log("📊 Found products:", products.length);

    const totalPages = Math.ceil(totalCount / limit);

    const response = {
      category: {
        ...category,
        _id: (category as any)?._id?.toString(),
      },
      products: (products as any[]).map((product: any) => ({
        ...product,
        _id: product._id?.toString(),
        category: product.category && typeof product.category === 'object' && '_id' in product.category 
          ? {
              ...product.category,
              _id: product.category._id?.toString(),
            }
          : product.category
      })),
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };

    console.log("📤 Returning products for category");
    return NextResponse.json(response);
  } catch (error: any) {
    console.error("💥 Error in GET /api/categories/[id]/products:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch products for category",
        details: error.message,
      },
      { status: 500 }
    );
  }
}