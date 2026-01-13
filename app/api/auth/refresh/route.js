import { NextResponse } from "next/server";

export async function POST(req) {
  const backendRes = await fetch(
    `${process.env.RENDER_API_URL}/auth/refresh`,
    {
      method: "POST",
      headers: {
        cookie: req.headers.get("cookie") || "",
      },
    }
  );

  const data = await backendRes.json();

  return NextResponse.json(data, {
    status: backendRes.status,
  });
}
