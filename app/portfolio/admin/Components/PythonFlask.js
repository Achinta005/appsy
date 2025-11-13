import { useEffect, useState } from "react";
import { apiCall } from "@/services/baseApi";

export default function ConnectionCheck() {
  const [status, setStatus] = useState("checking...");
  const [message, setMessage] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    let cancelled = false;
    async function check() {
      try {
        const [mRes, uRes] = await Promise.all([
          apiCall('/api/message'),
          apiCall('/api/user/123'),
        ]);
        if (!mRes.ok) throw new Error(`message HTTP ${mRes.status}`);
        if (!uRes.ok) throw new Error(`user HTTP ${uRes.status}`);

        const [mJson, uJson] = await Promise.all([mRes.json(), uRes.json()]);

        if (cancelled) return;

        setMessage(mJson);
        setUser(uJson);
        setStatus("connected");
        setError(null);
      } catch (e) {
        if (!cancelled) {
          setStatus("not connected");
          setError(e.message || String(e));
          setMessage(null);
          setUser(null);
        }
      }
    }

    check();
  }, []);

  return (
    <div style={{ fontFamily: "system-ui", padding: 16 }}>
      <p>Status: {status}</p>
      {error && <p style={{ color: "crimson" }}>Error: {error}</p>}

      {message && (
        <>
          <h3>/api/message</h3>
          Backend :- {message.message}
          Time:- {message.time}
        </>
      )}

      {user && (
        <>
          <h3>/api/user/123</h3>
          ID:-{user.id}
          name:-{user.name}
          RolE:-{user.role}
        </>
      )}
    </div>
  );
}
