"use client";

import React from "react";
import { Student } from "../../data/students";
import TimelineCategory from "./TimelineCategory";
import TimelineCard from "./TimelineCard";
import { BookOpen, Award, Briefcase, Flame } from "lucide-react";

interface TimelineSectionProps {
  student: Student;
  formatDateStr: (date: string) => string;
}

export default function TimelineSection({ student, formatDateStr }: TimelineSectionProps) {
  return (
    <div className="flex flex-col gap-6 animate-fade-in pt-1 pb-4">
      {/* Section Header */}
      <div className="flex items-center gap-2 text-zinc-200 font-extrabold text-xs uppercase tracking-wider py-1 leading-normal">
        <BookOpen size={14} className="text-amber-500 shrink-0" />
        <span>Academic, Professional & Leadership History</span>
      </div>

      <div className="flex flex-col gap-8">
        {/* Category 1: Academics (Education) */}
        <TimelineCategory
          title="Academic Pathway"
          icon={<Award size={13} />}
          headerTextColorClass="text-purple-400"
          hasItems={student.education.length > 0}
          emptyMessage="No academic entries."
        >
          {student.education.map((edu, idx) => (
            <TimelineCard
              key={idx}
              startDate={edu.startDate}
              endDate={edu.endDate}
              current={edu.current}
              title={edu.schoolName}
              subtitle1={edu.degreeType}
              subtitle2={edu.major}
              gpa={edu.gpa}
              gpaScale={edu.gpaScale}
              description={edu.description}
              themeColor="purple"
              formatDateStr={formatDateStr}
            />
          ))}
        </TimelineCategory>

        {/* Category 2: Professional Jobs (Work History) */}
        <TimelineCategory
          title="Professional Roles"
          icon={<Briefcase size={13} />}
          headerTextColorClass="text-blue-400"
          hasItems={student.workExperiences.length > 0}
          emptyMessage="No professional entries."
        >
          {student.workExperiences.map((work, idx) => (
            <TimelineCard
              key={idx}
              startDate={work.startDate}
              endDate={work.endDate}
              current={work.currentJob}
              title={work.title}
              subtitle1={work.name}
              description={work.description}
              themeColor="blue"
              formatDateStr={formatDateStr}
            />
          ))}
        </TimelineCategory>

        {/* Category 3: Leadership & Clubs */}
        <TimelineCategory
          title="Clubs & Leadership"
          icon={<Flame size={13} />}
          headerTextColorClass="text-amber-400"
          hasItems={student.clubs.length > 0}
          emptyMessage="No leadership roles."
        >
          {student.clubs.map((club, idx) => (
            <TimelineCard
              key={idx}
              startDate={club.startDate}
              endDate={club.endDate}
              current={club.current}
              title={club.title}
              subtitle1={club.name}
              description={club.description}
              themeColor="amber"
              formatDateStr={formatDateStr}
            />
          ))}
        </TimelineCategory>
      </div>
    </div>
  );
}
