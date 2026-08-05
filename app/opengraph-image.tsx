import { ImageResponse } from "next/og";
import { SITE_DESCRIPTION, SITE_NAME } from "@/constants/seo";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = SITE_NAME;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundColor: "#f8fafc",
          padding: "72px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "9999px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundImage:
                "linear-gradient(135deg, #4f46e5 0%, #2563eb 100%)",
              color: "#ffffff",
              fontSize: "40px",
              fontWeight: 700,
            }}
          >
            S/
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: "28px",
              color: "#64748b",
            }}
          >
            <span>Caja, entregas y pedidos</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <h1
            style={{
              fontSize: "64px",
              fontWeight: 800,
              color: "#0f172a",
              letterSpacing: "-0.02em",
              margin: 0,
            }}
          >
            {SITE_NAME}
          </h1>
          <p
            style={{
              fontSize: "30px",
              color: "#475569",
              lineHeight: 1.4,
              margin: 0,
            }}
          >
            {SITE_DESCRIPTION}
          </p>
        </div>

        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "2px solid #e2e8f0",
            paddingTop: "32px",
            color: "#1d4ed8",
            fontSize: "26px",
            fontWeight: 600,
          }}
        >
          <span>Panel · Movimientos · Clientes · Cobros</span>
          <span>Gestión de caja diaria</span>
        </div>
      </div>
    ),
    { ...size },
  );
}