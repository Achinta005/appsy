import { NextResponse } from "next/server";

export async function POST(req) {
  const backendRes = await fetch(
    `${process.env.RENDER_API_URL}/auth/logout`,
    {
      method: "POST",
      headers: {
        // Forward cookies (refresh token)
        cookie: req.headers.get("cookie") || "",
        // Forward access token if present
        authorization: req.headers.get("authorization") || "",
      },
    }
  );

  const response = NextResponse.json(
    { success: true },
    { status: backendRes.status }
  );

  // 🔥 Forward cookie clear (Set-Cookie)
  const setCookie = backendRes.headers.get("set-cookie");
  if (setCookie) {
    response.headers.set("set-cookie", setCookie);
  }

  return response;
}
