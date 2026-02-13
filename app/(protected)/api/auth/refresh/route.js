import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const backendRes = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_API_URL}/auth/refresh`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          cookie: req.headers.get("cookie") ?? "",
        },
        credentials: "include",
      }
    );

    const data = await backendRes.json();

    // ✅ Forward cookies from backend to client
    const response = NextResponse.json(data, {
      status: backendRes.status,
    });

    // Extract and forward Set-Cookie headers
    const setCookieHeader = backendRes.headers.get("set-cookie");
    if (setCookieHeader) {
      response.headers.set("set-cookie", setCookieHeader);
    }

    return response;
  } catch (err) {
    console.error("Auth refresh failed:", err);
    return NextResponse.json(
      { success: false, message: "Auth refresh failed" },
      { status: 500 }
    );
  }
}