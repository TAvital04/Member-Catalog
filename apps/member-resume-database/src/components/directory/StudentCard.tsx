"use client";

import React from "react";
import { Student, getPrimaryEducation, getIeeeLeadershipRole } from "../../data/students";
import { Calendar, Award, Flag, FolderGit2 } from "lucide-react";
import Avatar from "../common/Avatar";
import StatusBadge from "../common/StatusBadge";
import TruncatedText from "../common/TruncatedText";
import MultiLineTruncatedText from "../common/MultiLineTruncatedText";
import SkillTag from "../common/SkillTag";
import Tooltip from "../common/Tooltip";

interface StudentCardProps {
  student: Student;
  onClick: (student: Student) => void;
  adminMode: boolean;
  onToggleFlag?: (id: string) => void;
}

function StudentCard({
  student,
  onClick,
  adminMode,
  onToggleFlag,
}: StudentCardProps) {
  const leadershipRole = getIeeeLeadershipRole(student);

  return (
    <div
      onClick={() => onClick(student)}
      data-student-id={student.id}
      className={`relative group hover:z-30 rounded-2xl glass-panel glass-panel-hover p-4 md:p-5 flex flex-col justify-between h-[185px] md:h-[295px] cursor-pointer transition-all duration-300 ${
        adminMode && student.flagged
          ? "border-red-500/40 bg-red-950/5 hover:border-red-500/60"
          : "border-zinc-800"
      }`}
    >
      {/* Flagged Indicator Icon at Top Right */}
      {student.flagged && (
        <div className="absolute top-3 right-3 md:top-4 md:right-4 text-red-500 bg-red-500/10 border border-red-500/20 p-1.5 rounded-lg shadow-sm animate-fade-in z-20" title={student.flagReason || "Flagged / Reported"}>
          <Flag size={12} className="fill-current" />
        </div>
      )}
      {/* Top Section */}
      <div className="flex flex-col gap-2 md:gap-3">
        <div className="flex items-start justify-between min-w-0">
          <div className="flex items-center gap-2.5 md:gap-3 min-w-0 grow">
            {/* Responsive Avatar blocks */}
            <Avatar name={student.name} size="sm" className="md:hidden" />
            <Avatar name={student.name} size="md" className="hidden md:flex" />
            <div className="min-w-0 grow flex flex-col">
              <h3 className="font-bold text-zinc-100 text-sm md:text-base leading-tight group-hover:text-amber-400 transition-colors flex">
                <TruncatedText text={student.name} maxLength={26} align="left" />
              </h3>
              <div className="text-[11px] md:text-xs text-amber-500/90 font-medium leading-none md:leading-[1.1] mt-1 md:mt-2 flex">
                <TruncatedText text={student.major} maxLength={28} align="left" />
              </div>
            </div>
          </div>
        </div>

        {/* Bio snippet - Desktop only */}
        <p className="hidden md:block text-zinc-400 text-xs leading-relaxed mt-0.5">
          {student.bio.length > 105 ? student.bio.substring(0, 102) + "..." : student.bio}
        </p>
      </div>

      {/* Middle Section (Status Badge, IEEE Leadership Badge & Main IEEE Project Badge) */}
      <div className="flex flex-wrap items-center gap-1.5">
        <StatusBadge status={student.status} />
        {leadershipRole && (
          <span className="bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm shrink-0 max-w-[160px]">
            <Award size={10} className="text-amber-400 shrink-0" />
            <TruncatedText text={leadershipRole} maxLength={20} />
          </span>
        )}
        {student.mainProjectName && (
          <span className="bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm shrink-0 max-w-[160px]">
            <FolderGit2 size={10} className="text-cyan-400 shrink-0" />
            <TruncatedText text={student.mainProjectName} maxLength={20} />
          </span>
        )}
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col gap-2 md:gap-3 pt-2.5 md:pt-3 border-t border-zinc-800/80 w-full">
        <div className="flex items-center justify-between text-zinc-500 text-[11px] md:text-xs">
          <div className="flex items-center gap-1">
            <Calendar size={12} className="text-zinc-500 md:hidden" />
            <Calendar size={13} className="text-zinc-500 hidden md:block" />
            <span>Grad: {student.gradDate}</span>
          </div>
          {getPrimaryEducation(student)?.gpa && (
            <div className="flex items-center gap-1">
              <Award size={12} className="text-zinc-500 md:hidden" />
              <Award size={13} className="text-zinc-500 hidden md:block" />
              <span>GPA: {getPrimaryEducation(student)?.gpa}</span>
            </div>
          )}
        </div>

        {/* Skills Row */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1 overflow-visible">
            {student.skills.slice(0, 3).map((skill) => (
              <SkillTag
                key={skill}
                skill={skill}
                variant="card"
                maxCharLength={10}
                maxWidthClass="max-w-[70px]"
              />
            ))}
          </div>

          {/* Flag / Report Button */}
          {onToggleFlag && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFlag(student.id);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-1 bg-zinc-900 border border-zinc-800 rounded-md text-zinc-400 hover:text-red-400 hover:border-zinc-700 transition-all cursor-pointer relative group/tooltip"
            >
              <Flag size={12} className="md:hidden" />
              <Flag size={13} className="hidden md:block" />
              <Tooltip content="Flag / Report Profile" groupClass="group-hover/tooltip:opacity-100" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default React.memo(StudentCard);
