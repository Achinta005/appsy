export async function POST(req) {
  try {
    const { serviceId, ApiKey } = await req.json();

    const apiRes = await fetch(
      `https://api.render.com/v1/services/${serviceId}/restart`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({})
      }
    );

    const text = await apiRes.text();
    return new Response(text, { status: 200 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
