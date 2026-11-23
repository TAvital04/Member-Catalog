import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      success: false,
      message: "Job board functionality has been retired. Corporate sponsors access talent via the Candidate Directory and Resume Book export.",
    },
    { status: 410 }
  );
}

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      message: "Job board functionality has been retired.",
    },
    { status: 410 }
  );
}
