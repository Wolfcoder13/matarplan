import { NextRequest, NextResponse } from "next/server";
import { searchMeals } from "@/lib/queries/meals";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") || "";
  const results = await searchMeals(q);
  return NextResponse.json({ results });
}
