"use client";

import { QRCodeSVG } from "qrcode.react";

export function TicketQrCode({ value }: { value: string }) {
  return (
    <div className="inline-block rounded-2xl bg-white p-3 shadow-[0_2px_16px_rgba(111,35,128,0.15)]">
      <QRCodeSVG value={value} size={180} fgColor="#6F2380" bgColor="#ffffff" level="M" />
    </div>
  );
}
