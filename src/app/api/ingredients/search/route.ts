import { NextRequest, NextResponse } from "next/server";
import { searchIngredients } from "@/lib/queries/meals";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") || "";
  const results = await searchIngredients(q);
  return NextResponse.json({ results });
}
