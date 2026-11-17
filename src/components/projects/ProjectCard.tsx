"use client";

import React from "react";
import { Users } from "lucide-react";
import { IEEEProject } from "@/data/projects";
import { ProjectTabType } from "@/components/modal/project/ProjectTabNavigation";
import { CatalogCard } from "@/components/ui";

export interface ProjectCardProps {
  project: IEEEProject;
  onOpenModal: (project: IEEEProject, tab?: ProjectTabType) => void;
  onSelectMember?: (memberId?: string, name?: string, email?: string) => void;
}

function ProjectStatusBadge({
  status,
}: {
  status: "Active" | "Completed";
}) {
  const isCompleted = status === "Completed";
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10.5px] font-medium bg-neutral-100 border border-neutral-200 text-neutral-800">
      <span
        className={`w-1.5 h-1.5 rounded-full shrink-0 ${
          isCompleted ? "bg-black" : "bg-emerald-500"
        }`}
        aria-hidden="true"
      />
      <span>{status}</span>
    </span>
  );
}

/**
 * ProjectCard — Reusable Standardized Project Showcase Card
 * Built with the unified CatalogCard primitive.
 */
export default function ProjectCard({
  project,
  onOpenModal,
}: ProjectCardProps) {
  const memberCount = project.participants?.length || 0;

  return (
    <CatalogCard
      badge={<ProjectStatusBadge status={project.status} />}
      title={project.title}
      description={project.tagline || project.description}
      footerIcon={<Users size={13} className="text-neutral-400" />}
      footerText={
        memberCount > 0
          ? `${memberCount} team member${memberCount === 1 ? "" : "s"}`
          : "Recruiting team members"
      }
      onClick={() => onOpenModal(project, "overview")}
      ariaLabel={`View project details for ${project.title}`}
    />
  );
}
