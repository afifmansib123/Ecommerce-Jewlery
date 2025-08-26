// app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import Product from "@/lib/model/Product";
import Category from "@/lib/model/Category";
import mongoose from "mongoose";

// Force this route to be dynamic
export const dynamic = "force-dynamic";

// GET - Fetch single product by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log("🚀 GET /api/products/[id] - Starting...");

  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const populate = searchParams.get("populate") === "true";

    console.log("📥 Product ID:", id, "Populate:", populate);

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error("❌ Invalid product ID format:", id);
      return NextResponse.json(
        { error: "Invalid product ID format" },
        { status: 400 }
      );
    }

    // Connect to database
    console.log("🔌 Connecting to database...");
    await db.connect();
    console.log("✅ Database connected successfully");

    // Find product
    console.log("🔍 Searching for product...");
    let query = Product.findById(id);

    if (populate) {
      query = query.populate("category", "name description slug");
    }

    const product = await query.lean();

    if (!product) {
      console.error("❌ Product not found:", id);
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    console.log("✅ Product found:", product.name);
    return NextResponse.json(product);
  } catch (error: any) {
    console.error("💥 Error in GET /api/products/[id]:", error);
    return NextResponse.json(
      { error: "Failed to fetch product", details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update product by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log("🚀 PUT /api/products/[id] - Starting...");

  try {
    const { id } = params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid product ID format" },
        { status: 400 }
      );
    }

    const body = await request.json();
    console.log("📥 Request body received:", body);

    // Prepare update data with proper type conversions
    const updateData: any = {
      ...body,
      name: body.name?.trim(),
      description: body.description?.trim(),
      shortDescription: body.shortDescription?.trim(),
      material: body.material?.trim(),
      period: body.period?.trim(),
      origin: body.origin?.trim(),
      price: parseFloat(body.price),
      stockQuantity: parseInt(body.stockQuantity, 10),
      weight: body.weight ? parseFloat(body.weight) : undefined,
      discountedPrice:
        body.discountedPrice !== undefined &&
        body.discountedPrice !== null &&
        body.discountedPrice !== ""
          ? parseFloat(body.discountedPrice)
          : undefined,
    };

    // Remove undefined fields
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    console.log("📝 Update data prepared:", updateData);

    await db.connect();

    // Verify category exists if being updated
    if (updateData.category) {
      const categoryExists = await Category.findById(updateData.category);
      if (!categoryExists) {
        return NextResponse.json(
          { error: "Category not found" },
          { status: 400 }
        );
      }
    }

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate("category", "name description slug")
      .lean();

    if (!updatedProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    console.log("✅ Product updated successfully");
    return NextResponse.json(updatedProduct);
  } catch (error: any) {
    console.error("💥 Error in PUT /api/products/[id]:", error);
    
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
      { error: "Failed to update product", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete product by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log("🚀 DELETE /api/products/[id] - Starting...");

  try {
    const { id } = params;
    console.log("📥 Product ID:", id);

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error("❌ Invalid product ID format:", id);
      return NextResponse.json(
        { error: "Invalid product ID format" },
        { status: 400 }
      );
    }

    // Connect to database
    console.log("🔌 Connecting to database...");
    await db.connect();
    console.log("✅ Database connected successfully");

    // Delete product
    const deletedProduct = await Product.findByIdAndDelete(id)
      .populate("category", "name description slug")
      .lean();

    if (!deletedProduct) {
      console.error("❌ Product not found for deletion:", id);
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    console.log("✅ Product deleted successfully:", deletedProduct.name);
    
    return NextResponse.json({
      message: "Product deleted successfully",
      deletedProduct: deletedProduct,
    });
  } catch (error: any) {
    console.error("💥 Error in DELETE /api/products/[id]:", error);
    return NextResponse.json(
      { error: "Failed to delete product", details: error.message },
      { status: 500 }
    );
  }
}