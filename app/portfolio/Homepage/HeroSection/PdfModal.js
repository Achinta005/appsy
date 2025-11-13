import React, { useState, useEffect } from "react";
import { PortfolioApiService } from "@/services/PortfolioApiService";

const PdfModal = ({ pdfUrl, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  const extractGoogleDriveFileId = (url) => {
    if (!url) return null;
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : null;
  };

  const getGoogleDrivePreviewUrl = (url) => {
    const fileId = extractGoogleDriveFileId(url);
    return fileId ? `https://drive.google.com/file/d/${fileId}/preview` : null;
  };

  const getGoogleDocsViewerUrl = (url) => {
    const fileId = extractGoogleDriveFileId(url);
    const cleanUrl = fileId ? `https://drive.google.com/uc?id=${fileId}` : url;
    return `https://docs.google.com/gview?url=${encodeURIComponent(
      cleanUrl
    )}&embedded=true`;
  };

  const getViewerUrl = () => {
    const isGoogleDrive = pdfUrl?.includes("drive.google.com");

    if (useFallback) {
      return isGoogleDrive ? getGoogleDocsViewerUrl(pdfUrl) : pdfUrl;
    }

    if (isGoogleDrive) {
      return getGoogleDrivePreviewUrl(pdfUrl) || pdfUrl;
    }

    return pdfUrl;
  };

  useEffect(() => {
    if (pdfUrl) {
      setIsVisible(true);
      const timer = setTimeout(() => setIsLoading(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [pdfUrl]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleDownload = () => {
    try {
      const isGoogleDrive = pdfUrl?.includes("drive.google.com");

      if (isGoogleDrive) {
        const fileId = extractGoogleDriveFileId(pdfUrl);
        if (fileId) {
          const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
          window.open(downloadUrl, "_blank");
        }
      } else {
        PortfolioApiService.downloadResume();
      }
    } catch (err) {
      console.error("Error downloading:", err);
    }
  };

  const handleIframeError = () => {
    console.log("Primary viewer failed, switching to fallback");
    setUseFallback(true);
    setIsLoading(false);
  };

  if (!pdfUrl) return null;

  const viewerUrl = getViewerUrl();

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-lg transition-all duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div
        className={`relative rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 ${
          isVisible ? "scale-100 rotate-0" : "scale-90 -rotate-3"
        }`}
        style={{
          width: "min(700px, 92vw)",
          height: "min(92vh, 1200px)",
          maxHeight: window.innerWidth < 768 ? "70vh" : "92vh",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl blur-lg opacity-75 animate-pulse"></div>

        <div className="relative bg-slate-900 rounded-2xl overflow-hidden h-full flex flex-col">
          <div className="relative bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 px-4 py-3 flex items-center justify-between border-b border-slate-600/50">
            <div className="flex items-center space-x-2.5 z-10">
              <button
                onClick={handleClose}
                className="w-3.5 h-3.5 bg-gradient-to-br from-red-500 to-red-600 rounded-full hover:from-red-400 hover:to-red-500 transition-all duration-200 shadow-lg hover:shadow-red-500/50 group relative"
                aria-label="Close"
              >
                <svg
                  className="w-2 h-2 absolute inset-0 m-auto text-red-900 opacity-0 group-hover:opacity-100 transition-opacity"
                  fill="currentColor"
                  viewBox="0 0 12 12"
                >
                  <path d="M10.7 1.3c-.4-.4-1-.4-1.4 0L6 4.6 2.7 1.3c-.4-.4-1-.4-1.4 0-.4.4-.4 1 0 1.4L4.6 6 1.3 9.3c-.4.4-.4 1 0 1.4.4.4 1 .4 1.4 0L6 7.4l3.3 3.3c.4.4 1 .4 1.4 0 .4-.4.4-1 0-1.4L7.4 6l3.3-3.3c.4-.4.4-1 0-1.4z" />
                </svg>
              </button>
              <button
                className="w-3.5 h-3.5 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full hover:from-yellow-400 hover:to-yellow-500 transition-all duration-200 shadow-lg hover:shadow-yellow-500/50"
                aria-label="Minimize"
              ></button>
              <button
                className="w-3.5 h-3.5 bg-gradient-to-br from-green-500 to-green-600 rounded-full hover:from-green-400 hover:to-green-500 transition-all duration-200 shadow-lg hover:shadow-green-500/50"
                aria-label="Maximize"
              ></button>
            </div>

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center space-x-2">
              <svg
                className="w-5 h-5 text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="text-sm font-semibold text-gray-200 tracking-wide">
                Achinta Hazra Resume.pdf
              </span>
            </div>

            <button
              onClick={handleClose}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-slate-700/50 transition-all duration-200 z-10 group"
              aria-label="Close modal"
            >
              <svg
                className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex-1 p-2 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-blue-500/20">
            <div className="relative w-full h-full bg-slate-900 rounded-lg overflow-hidden shadow-inner">
              <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-purple-500/20 to-transparent rounded-br-full pointer-events-none z-10"></div>
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-bl-full pointer-events-none z-10"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-pink-500/20 to-transparent rounded-tr-full pointer-events-none z-10"></div>
              <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-purple-500/20 to-transparent rounded-tl-full pointer-events-none z-10"></div>

              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/95 z-10">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-pink-500 rounded-full animate-spin delay-150"></div>
                    <div className="mt-4 text-center">
                      <p className="text-purple-400 text-sm font-medium animate-pulse">
                        Loading Resume...
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="absolute inset-0 rounded-lg overflow-hidden">
                <iframe
                  key={`viewer-${useFallback}`}
                  src={viewerUrl}
                  title="Resume Viewer"
                  className="border-0 rounded-lg"
                  style={{
                    width: "calc(100% + 20px)",
                    height: "calc(100% + 20px)",
                    marginRight: "-20px",
                    marginBottom: "-20px",
                  }}
                  frameBorder="0"
                  onLoad={() => setIsLoading(false)}
                  onError={handleIframeError}
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                >
                  <p className="text-white p-4">
                    Your browser does not support PDF viewing.
                  </p>
                </iframe>
              </div>

              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-900/10 via-transparent to-slate-900/10"></div>

              {useFallback && (
                <div className="absolute top-4 left-4 z-20 bg-yellow-500/20 backdrop-blur-sm border border-yellow-400/30 text-yellow-200 px-3 py-1 rounded text-xs flex items-center gap-2">
                  <span>Using fallback viewer</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 px-4 py-2.5 flex items-center justify-between border-t border-slate-600/50">
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
              <span>Secure View</span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                className="p-1.5 rounded hover:bg-slate-600/50 transition-colors text-gray-400 hover:text-white"
                title="Download"
                onClick={handleDownload}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfModal;
