"use client";
import { easeOut, motion } from "framer-motion";
import { PinContainer } from "@/components/ui/3dpin";
import {
  X,
  Download,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { PortfolioApiService } from "@/services/PortfolioApiService";

const CertificatePopup = ({ cert, isOpen, onClose }) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [loadError, setLoadError] = useState(false);
  const [useViewer, setUseViewer] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoadError(false);
      setUseViewer(false);
      setZoomLevel(1);
      setImagePosition({ x: 0, y: 0 });
    }
  }, [isOpen]);

  if (!isOpen || !cert) return null;

  const getGoogleDrivePreviewUrl = (url) => {
    const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (fileIdMatch) {
      return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
    }
    return url;
  };

  const getGoogleDriveDownloadUrl = (url) => {
    const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (fileIdMatch) {
      return `https://drive.google.com/uc?export=download&id=${fileIdMatch[1]}`;
    }
    return url;
  };

  const getDocumentUrl = (path) => {
    if (path.includes("drive.google.com")) {
      return getGoogleDrivePreviewUrl(path);
    }
    return path;
  };

  const getViewerUrl = (originalUrl) => {
    let cleanUrl = originalUrl;

    if (originalUrl.includes("drive.google.com")) {
      const fileIdMatch = originalUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (fileIdMatch) {
        cleanUrl = `https://drive.google.com/uc?id=${fileIdMatch[1]}`;
      }
    }

    return `https://docs.google.com/gview?url=${encodeURIComponent(
      cleanUrl
    )}&embedded=true`;
  };

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () =>
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));

  const handleMouseDown = (e) => {
    if (!useViewer) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - imagePosition.x,
      y: e.clientY - imagePosition.y,
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging && useViewer) {
      setImagePosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
  };

  const downloadCert = () => {
    if (cert.path.includes("drive.google.com")) {
      const downloadUrl = getGoogleDriveDownloadUrl(cert.path);
      window.open(downloadUrl, "_blank");
      return;
    }

    const link = document.createElement("a");
    link.href = cert.path;
    link.download = `${cert.name}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openInNewTab = () => {
    if (cert.path.includes("drive.google.com")) {
      const fileIdMatch = cert.path.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (fileIdMatch) {
        window.open(
          `https://drive.google.com/file/d/${fileIdMatch[1]}/view`,
          "_blank"
        );
        return;
      }
    }
    window.open(cert.path, "_blank", "noopener,noreferrer");
  };

  const handleIframeError = () => {
    console.log("Primary iframe failed, switching to viewer");
    setLoadError(true);
    setUseViewer(true);
  };

  const documentUrl = getDocumentUrl(cert.path);
  const viewerUrl = getViewerUrl(cert.path);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-lg"
        onClick={onClose}
      />

      <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 max-w-5xl max-h-[95vh] w-full mx-4 overflow-hidden">
        <div className="flex items-center justify-between p-2 sm:p-4 border-b border-white/20 bg-white/5 backdrop-blur-sm">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            <img
              src={cert.icon}
              alt={cert.name}
              className="w-6 h-6 sm:w-8 sm:h-8 rounded object-contain flex-shrink-0"
              onError={(e) => {
                e.target.src =
                  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjZjNmNGY2Ii8+CjxwYXRoIGQ9Im0xMiAxNS41IDQtNEw5LjUgOGwtMi00IiBzdHJva2U9IiM5Y2EzYWYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPg==";
              }}
            />
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-sm sm:text-lg text-white truncate">{cert.name}</h3>
              <p className="text-xs sm:text-sm text-white/70 truncate">
                {cert.issuer} • {cert.year}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            <button
              onClick={handleZoomOut}
              className="p-1 sm:p-2 hover:bg-white/10 rounded-lg transition-colors text-white/80 hover:text-white"
              title="Zoom Out"
            >
              <ZoomOut size={14} className="sm:w-4 sm:h-4" />
            </button>
            <span className="text-xs sm:text-sm text-white/70 min-w-[3rem] text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1 sm:p-2 hover:bg-white/10 rounded-lg transition-colors text-white/80 hover:text-white"
              title="Zoom In"
            >
              <ZoomIn size={14} className="sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={resetView}
              className="px-2 py-1 text-xs bg-blue-500/20 text-blue-200 rounded hover:bg-blue-500/30 transition-colors backdrop-blur-sm border border-blue-400/20"
            >
              Reset
            </button>
            <button
              onClick={downloadCert}
              className="p-1 sm:p-2 hover:bg-white/10 rounded-lg transition-colors text-white/80 hover:text-white"
              title="Download Certificate"
            >
              <Download size={14} className="sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={openInNewTab}
              className="p-1 sm:p-2 hover:bg-white/10 rounded-lg transition-colors text-white/80 hover:text-white"
              title="Open in New Tab"
            >
              <ExternalLink size={14} className="sm:w-4 sm:h-4" />
            </button>
            {loadError && (
              <button
                onClick={() => {
                  setLoadError(false);
                  setUseViewer(!useViewer);
                }}
                className="p-1 sm:p-2 hover:bg-yellow-500/20 text-yellow-200 rounded-lg transition-colors"
                title="Switch Viewer"
              >
                <AlertCircle size={14} className="sm:w-4 sm:h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 sm:p-2 hover:bg-red-500/20 text-red-200 rounded-lg transition-colors"
              title="Close"
            >
              <X size={14} className="sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        <div
          className="relative overflow-hidden bg-black/20 backdrop-blur-sm"
          style={{ height: "60vh" }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {loadError && (
            <div className="absolute top-4 left-4 z-10 bg-yellow-500/20 backdrop-blur-sm border border-yellow-400/30 text-yellow-200 px-3 py-2 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle size={14} />
              Using fallback viewer
            </div>
          )}

          <div className="w-full h-full flex items-center justify-center">
            {cert.path.toLowerCase().includes(".pdf") ||
            cert.path.includes("drive.google.com") ? (
              !useViewer ? (
                <iframe
                  key={`primary-${documentUrl}`}
                  src={documentUrl}
                  className="w-full h-full border-0 rounded-lg"
                  title={cert.name}
                  style={{
                    transform: `scale(${zoomLevel})`,
                    transformOrigin: "center center",
                  }}
                  onLoad={() => setLoadError(false)}
                  onError={handleIframeError}
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                />
              ) : (
                <iframe
                  key={`fallback-${viewerUrl}`}
                  src={viewerUrl}
                  className="w-full h-full border-0 rounded-lg"
                  title={`${cert.name} (Viewer)`}
                  style={{
                    transform: `scale(${zoomLevel})`,
                    transformOrigin: "center center",
                  }}
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                />
              )
            ) : (
              <img
                src={cert.path}
                alt={cert.name}
                className={`max-w-none transition-transform rounded-lg ${
                  isDragging ? "cursor-grabbing" : "cursor-grab"
                }`}
                style={{
                  transform: `scale(${zoomLevel}) translate(${imagePosition.x}px, ${imagePosition.y}px)`,
                  transformOrigin: "center center",
                }}
                onMouseDown={handleMouseDown}
                onError={(e) => {
                  console.error("Image failed to load:", cert.path);
                  setLoadError(true);
                }}
                draggable={false}
              />
            )}
          </div>
        </div>

        <div className="p-2 sm:p-3 bg-white/5 backdrop-blur-sm border-t border-white/20">
          <p className="text-xs text-white/60 text-center">
            {cert.path.includes(".pdf") ||
            cert.path.includes("drive.google.com")
              ? "PDF Document • Use zoom controls • Click download or open in new tab"
              : "Use mouse wheel to zoom • Click and drag to pan • Press ESC to close"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default function CertificationSection({certificateData}) {
  const [selectedCert, setSelectedCert] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  

  const openCertificatePopup = (cert) => {
    console.log("Opening certificate:", cert.name, cert.path);
    setSelectedCert(cert);
    setIsPopupOpen(true);
  };

  const closeCertificatePopup = () => {
    setIsPopupOpen(false);
    setTimeout(() => setSelectedCert(null), 300);
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && isPopupOpen) {
        closeCertificatePopup();
      }
    };

    if (isPopupOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";

      return () => {
        document.removeEventListener("keydown", handleEsc);
        document.body.style.overflow = "unset";
      };
    }
  }, [isPopupOpen]);

  return (
    <section className="py-12 sm:py-20 relative min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="backdrop-blur-xl bg-white/5 rounded-3xl border border-white/20 shadow-2xl p-6 sm:p-8 lg:p-12">
          
          <div className="text-center mb-12 sm:mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: easeOut }}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 bg-clip-text text-transparent mb-4 sm:mb-6">
                Certifications
              </h2>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -150 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: easeOut }}
            >
              <p className="text-base sm:text-lg lg:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                Professional certifications that validate my expertise and
                commitment to continuous learning in the ever-evolving tech landscape.
              </p>
            </motion.div>
          </div>

          <div className="block md:hidden space-y-4">
            {certificateData.map((cert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-4 hover:bg-white/15 transition-all duration-300 cursor-pointer"
                onClick={() => openCertificatePopup(cert)}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-lg flex-shrink-0 backdrop-blur-sm border border-white/20">
                    <img
                      src={cert.icon}
                      alt={cert.name}
                      className="w-10 h-10 rounded object-cover"
                      onError={(e) => {
                        e.target.src =
                          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjZjNmNGY2Ii8+CjxwYXRoIGQ9Im0xMiAxNS41IDQtNEw5LjUgOGwtMi00IiBzdHJva2U9IiM5Y2EzYWYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPg==";
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white text-lg leading-tight hover:text-blue-200 transition-colors duration-300 mb-1">
                      {cert.name}
                    </h3>
                    <p className="text-white/70 font-medium text-sm mb-1">
                      {cert.issuer}
                    </p>
                    <p className="text-white/50 text-xs">
                      {cert.year}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 xl:gap-16">
            {certificateData.map((cert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: easeOut, delay: index * 0.1 }}
              >
                <PinContainer
                  title="VIEW CERTIFICATE"
                  onClick={() => openCertificatePopup(cert)}
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 lg:w-16 lg:h-16 flex items-center justify-center bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-lg flex-shrink-0 backdrop-blur-sm border border-white/20">
                      <img
                        src={cert.icon}
                        alt={cert.name}
                        className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg object-cover"
                        onError={(e) => {
                          e.target.src =
                            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjZjNmNGY2Ii8+CjxwYXRoIGQ9Im0xMiAxNS41IDQtNEw5LjUgOGwtMi00IiBzdHJva2U9IiM5Y2EzYWYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPg==";
                        }}
                      />
                    </div>
                    <div className="flex-1 ml-3 lg:ml-4">
                      <h3 className="font-bold text-left text-white text-sm lg:text-base leading-tight hover:text-blue-200 transition-colors duration-300">
                        {cert.name}
                      </h3>
                    </div>
                  </div>
                  <p className="text-white/70 font-medium text-sm mb-1">
                    {cert.issuer}
                  </p>
                  <p className="text-white/50 text-xs">
                    {cert.year}
                  </p>
                </PinContainer>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <CertificatePopup
        cert={selectedCert}
        isOpen={isPopupOpen}
        onClose={closeCertificatePopup}
      />
    </section>
  );
}