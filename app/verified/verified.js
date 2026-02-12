"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";

function VerifiedContent() {
  const router = useRouter();
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Parse tokens from URL hash (Supabase OAuth/Magic Link callback)
        const hashParams = new URLSearchParams(
          window.location.hash.substring(1),
        );

        const type = hashParams.get("type");
        const access_token = hashParams.get("access_token");

        if (!access_token) {
          setStatus("error");
          setMessage("Missing authentication token");
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API_URL}/auth/verify-callback`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            access_token,
            type,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("❌ Session setup failed:", errorData);
          setStatus("error");
          setMessage(errorData.message || "Authentication failed");
          return;
        }

        const data = await response.json();

        // Success!
        setStatus("success");
        setMessage(
          type === "signup"
            ? "Email verified successfully!"
            : type === "recovery"
              ? "Password reset successful!"
              : "Authentication successful!",
        );

        // Clean up URL hash
        window.history.replaceState(null, "", window.location.pathname);

        // Redirect after 2 seconds
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } catch (err) {
        console.error("💥 Unexpected error:", err);
        setStatus("error");
        setMessage("An unexpected error occurred. Please try again.");
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="verified-container">
      <div className="verified-card">
        {status === "verifying" && (
          <>
            <div className="spinner"></div>
            <h1>Verifying your account...</h1>
            <p>Please wait while we confirm your email address.</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="success-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h1>Success!</h1>
            <p>{message}</p>
            <p className="redirect-text">
              Redirecting you to your dashboard...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="error-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            </div>
            <h1>Verification Failed</h1>
            <p>{message}</p>
            <button
              onClick={() => router.push("/login")}
              className="retry-button"
            >
              Go to Login
            </button>
          </>
        )}
      </div>

      <style jsx>{`
        .verified-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
          font-family:
            -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
            "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
            sans-serif;
        }

        .verified-card {
          background: white;
          border-radius: 16px;
          padding: 48px 40px;
          max-width: 480px;
          width: 100%;
          text-align: center;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: slideUp 0.5s ease-out;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .spinner {
          margin: 0 auto 24px;
          width: 48px;
          height: 48px;
          border: 4px solid #f3f4f6;
          border-top-color: #667eea;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .success-icon,
        .error-icon {
          margin: 0 auto 24px;
          width: 64px;
          height: 64px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: scaleIn 0.5s ease-out;
        }

        .success-icon {
          background: #d1fae5;
          color: #059669;
        }

        .error-icon {
          background: #fee2e2;
          color: #dc2626;
        }

        .success-icon svg,
        .error-icon svg {
          width: 36px;
          height: 36px;
        }

        @keyframes scaleIn {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }

        h1 {
          margin: 0 0 12px 0;
          font-size: 28px;
          font-weight: 700;
          color: #111827;
        }

        p {
          margin: 0 0 16px 0;
          font-size: 16px;
          color: #6b7280;
          line-height: 1.6;
        }

        .redirect-text {
          font-size: 14px;
          color: #9ca3af;
          margin-top: 24px;
        }

        .retry-button {
          margin-top: 24px;
          padding: 12px 32px;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .retry-button:hover {
          background: #5568d3;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .retry-button:active {
          transform: translateY(0);
        }

        @media (max-width: 640px) {
          .verified-card {
            padding: 32px 24px;
          }

          h1 {
            font-size: 24px;
          }

          p {
            font-size: 15px;
          }
        }
      `}</style>
    </div>
  );
}

export default function VerifiedPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "48px 40px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                margin: "0 auto 24px",
                width: "48px",
                height: "48px",
                border: "4px solid #f3f4f6",
                borderTopColor: "#667eea",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }}
            ></div>
            <h1>Loading...</h1>
          </div>
        </div>
      }
    >
      <VerifiedContent />
    </Suspense>
  );
}
