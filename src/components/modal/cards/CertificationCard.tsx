"use client";

import React from "react";
import { CertificationEntry } from "@/data/students";
import { ExternalLink, Clock } from "lucide-react";
import { getSafeUrl } from "@/shared";

import { CARD_INTERACTIVE, CARD_TITLE_HOVER } from "@/lib/cardStyles";

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

  const safeCredUrl = getSafeUrl(certification.credentialUrl);

  return (
    <div className={`${CARD_INTERACTIVE} p-4 md:p-5 flex flex-col justify-between gap-3 min-w-0 overflow-hidden`}>
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between gap-2">
          <span className="bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            Certification
          </span>
          <span className="text-[10px] font-medium text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full shrink-0 flex items-center gap-1.5 leading-none">
            <Clock size={11} className="text-slate-400" />
            {formatDateStr(certification.issueDate)}
          </span>
        </div>

        <h4 className={`font-bold text-sm md:text-base leading-tight ${CARD_TITLE_HOVER} transition-colors`}>
          {displayName}
        </h4>

        <div className="flex flex-col gap-1 text-xs text-slate-600 leading-relaxed font-sans">
          <p>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1.5">Issued By:</span>
            <span className="font-semibold text-slate-800">{cleanIssuer}</span>
          </p>
          {cleanCredId && (
            <p className="font-mono text-[11px] text-slate-500">
              <span className="font-sans text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1.5 font-mono-none">Credential ID:</span>
              <span>{cleanCredId}</span>
            </p>
          )}
        </div>
      </div>

      {safeCredUrl && (
        <div className="pt-2.5 md:pt-3 border-t border-slate-100">
          <a
            href={safeCredUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[10.5px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-700 hover:text-slate-900 transition-all shadow-2xs cursor-pointer active:scale-95"
          >
            <ExternalLink size={11} />
            <span>Verify Credential</span>
          </a>
        </div>
      )}
    </div>
  );
}
