import { useState, useEffect, useRef, useCallback } from "react";
import { Monitor, Smartphone, RefreshCw } from "lucide-react";

/**
 * Live preview of the ACTUAL email HTML rendered by the server.
 * Desktop shows the full-width render; Mobile shows a 390px phone frame
 * that scales down on narrow viewports (320–430px) with no horizontal scroll.
 */
export default function EmailPreview({ html, loading, device, onDeviceChange }) {
  const [frameHeight, setFrameHeight] = useState(720);
  const [refreshKey, setRefreshKey] = useState(0);
  const wrapRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => {
      const available = el.clientWidth;
      if (device === "mobile") {
        setScale(Math.min(1, available / 410));
      } else {
        setScale(1);
      }
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [device]);

  const onFrameLoad = useCallback((e) => {
    try {
      const doc = e.currentTarget.contentDocument;
      if (doc?.body) setFrameHeight(Math.max(doc.body.scrollHeight + 24, 420));
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 min-w-0">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-warm-gray">
          Live Email Preview
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            title="Refresh preview"
            className="p-2 rounded-lg text-warm-gray hover:text-primary hover:bg-gray-50 transition cursor-pointer"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          </button>
          <div className="flex rounded-lg bg-gray-100 p-0.5">
            {[
              { key: "desktop", icon: Monitor, label: "Desktop" },
              { key: "mobile", icon: Smartphone, label: "Mobile" },
            ].map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                onClick={() => onDeviceChange(key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition cursor-pointer ${
                  device === key
                    ? "bg-white text-primary shadow-sm"
                    : "text-warm-gray hover:text-charcoal"
                }`}
              >
                <Icon size={13} /> {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* preview stage */}
      <div className="rounded-xl bg-[#efe9dc] p-4 sm:p-6 overflow-hidden flex justify-center min-h-[420px]">
        {!html && !loading && (
          <div className="self-center text-sm text-warm-gray text-center px-6 py-16">
            Select an enquiry to see its notification preview.
          </div>
        )}
        {html && device === "desktop" && (
          <div className={`w-full ${"max-w-[680px]"}`}>
            <iframe
              key={refreshKey}
              srcDoc={html}
              title="Email preview — desktop"
              onLoad={onFrameLoad}
              sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox"
              className="w-full bg-white rounded-lg shadow-md border border-black/5"
              style={{ height: frameHeight }}
            />
          </div>
        )}
        {html && device === "mobile" && (
          <div
            ref={wrapRef}
            className="w-full flex justify-center"
            style={{ height: frameHeight * scale + 36 }}
          >
            <div style={{ transform: `scale(${scale})`, transformOrigin: "top center" }}>
              {/* phone chrome */}
              <div className="rounded-[28px] bg-charcoal p-[9px] pt-6 pb-7 relative shadow-xl">
                <span className="absolute top-2.5 left-1/2 -translate-x-1/2 h-4 w-20 rounded-full bg-black/80" />
                <iframe
                  key={refreshKey}
                  srcDoc={html}
                  title="Email preview — mobile"
                  onLoad={onFrameLoad}
                  sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                  className="bg-white rounded-[18px] block"
                  style={{ width: 390, height: frameHeight }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <p className="mt-3 text-[11px] leading-4 text-gray-400">
        Preview renders the exact HTML sent to recipients — table-based layout,
        inline styles, mobile-stacked columns.
      </p>
    </section>
  );
}
