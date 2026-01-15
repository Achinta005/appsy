export const apiCall = async (endpoint, options = {}, accessToken = null) => {
  const defaultHeaders = {};

  // Only set JSON header if not sending FormData
  if (!(options.body instanceof FormData)) {
    defaultHeaders["Content-Type"] = "application/json";
  }

  // Build final headers (token included)
  const headers = {
    ...defaultHeaders,
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...(options.headers || {}),
  };

  // Final fetch config
  const config = {
    ...options,
    headers,
  };

  try {
    const res = await fetch(endpoint, config);

    let data;
    try {
      data = await res.json();
    } catch {
      data = { message: "Invalid JSON response" };
    }

    if (!res.ok) {
      throw new Error(data.message || `Request failed with ${res.status}`);
    }

    return data;
  } catch (err) {
    console.error(`API call failed (${endpoint}):`, err.message);
    throw err;
  }
};
