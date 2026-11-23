import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      success: false,
      message: "Job applications functionality has been retired. Corporate sponsors contact talent directly through verified contact links.",
    },
    { status: 410 }
  );
}

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      message: "Job applications functionality has been retired.",
    },
    { status: 410 }
  );
}
