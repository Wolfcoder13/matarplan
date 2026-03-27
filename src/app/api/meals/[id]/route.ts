import { NextRequest, NextResponse } from "next/server";
import { getMealById } from "@/lib/queries/meals";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const meal = await getMealById(id);
  if (!meal) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ meal });
}
