"use client";

import React from "react";
import { CertificationEntry } from "../../../data/students";
import { ExternalLink } from "lucide-react";

interface CertificationCardProps {
  certification: CertificationEntry;
  formatDateStr: (dateStr: string) => string;
}

export default function CertificationCard({
  certification,
  formatDateStr,
}: CertificationCardProps) {
  const cleanName = certification.name.replace(/^(Cert Name|Certification Name|Certification)\s*/i, "").trim();
  const displayName = cleanName || certification.name;

  const cleanIssuer = certification.issuer.replace(/^(Issuer Name|Issuer)\s*/i, "").trim() || certification.issuer;

  const cleanCredId = certification.credentialId
    ? certification.credentialId.replace(/^(Cred ID|Credential ID|ID)\s*/i, "").trim() || certification.credentialId
    : "";

  return (
    <div className="p-4 rounded-xl bg-zinc-850 border border-zinc-800 flex flex-col gap-2 shadow-sm min-w-0 overflow-hidden">
      <div className="flex justify-between items-start gap-2 border-b border-zinc-800/60 pb-1.5">
        <span className="text-[9px] text-amber-500 font-extrabold uppercase tracking-wider">
          CERTIFICATION
        </span>
        <span className="text-[9.5px] text-zinc-500 font-semibold bg-zinc-950/80 border border-zinc-800 px-2 py-0.5 rounded-md">
          {formatDateStr(certification.issueDate)}
        </span>
      </div>

      <h5 className="font-extrabold text-zinc-100 text-xs whitespace-normal break-all [overflow-wrap:anywhere] leading-snug">
        {displayName}
      </h5>

      <div className="flex flex-col gap-1 pt-1 border-t border-zinc-800/60">
        <p className="text-[10.5px] text-zinc-300 whitespace-normal break-all [overflow-wrap:anywhere]">
          <span className="text-[9px] font-extrabold text-zinc-500 uppercase tracking-wider mr-1.5">ISSUED BY:</span>
          <span className="font-semibold text-zinc-200">{cleanIssuer}</span>
        </p>
        {cleanCredId && (
          <p className="text-[9.5px] text-zinc-400 font-mono whitespace-normal break-all [overflow-wrap:anywhere]">
            <span className="font-sans text-[9px] font-extrabold text-zinc-550 uppercase tracking-wider mr-1.5">CREDENTIAL ID:</span>
            <span>{cleanCredId}</span>
          </p>
        )}
      </div>

      {certification.credentialUrl && (
        <a
          href={certification.credentialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-amber-500 hover:text-amber-400 font-medium flex items-center gap-1 mt-1 pt-1.5 border-t border-zinc-800/50"
        >
          <ExternalLink size={10} />
          <span>Verify Credential</span>
        </a>
      )}
    </div>
  );
}
