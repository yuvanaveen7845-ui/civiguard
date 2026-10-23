import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import cloudinary from "@/services/cloudinary";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ message: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Cryptographic SHA-256 hash for chain-of-custody verification
    const hashSum = crypto.createHash("sha256");
    hashSum.update(buffer);
    const fileHash = hashSum.digest("hex");

    let secureUrl = "";

    // Check if Cloudinary credentials are fully configured
    if (
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    ) {
      try {
        const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "civicguard_evidence", resource_type: "auto" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result as any);
            }
          );
          uploadStream.end(buffer);
        });
        secureUrl = uploadResult.secure_url;
      } catch (cloudErr) {
        console.warn("Cloudinary upload failed, falling back to secure data URL:", cloudErr);
      }
    }

    // Fallback if no Cloudinary credentials or error
    if (!secureUrl) {
      const mimeType = file.type || "application/octet-stream";
      secureUrl = `data:${mimeType};base64,${buffer.toString("base64")}`;
    }

    return NextResponse.json({
      url: secureUrl,
      fileType: file.type || "image/jpeg",
      fileHash,
      fileName: file.name
    }, { status: 200 });

  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ message: "Failed to upload file" }, { status: 500 });
  }
}
