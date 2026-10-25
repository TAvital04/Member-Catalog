CREATE TABLE "event_attendees" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"member_id" uuid NOT NULL,
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "event_attendees_event_member_unique" UNIQUE("event_id","member_id")
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"location" varchar(255) NOT NULL,
	"committee_id" uuid,
	"description" text NOT NULL,
	"flyer_url" varchar(500),
	"rsvp_link" varchar(500),
	"photo_urls" text,
	"slug" varchar(64),
	"start_time" timestamp with time zone NOT NULL,
	"end_time" timestamp with time zone,
	"requires_dues" boolean DEFAULT false NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "events_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "ieee_projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(64) NOT NULL,
	"tagline" varchar(300),
	"description" text NOT NULL,
	"category" varchar(100) NOT NULL,
	"status" varchar(50) DEFAULT 'Active' NOT NULL,
	"repository_url" varchar(500),
	"demo_url" varchar(500),
	"banner_url" varchar(500),
	"tools" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"timeline" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"skills_taught" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"sponsorship_info" jsonb,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "ieee_projects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "member_resumes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"member_id" uuid NOT NULL,
	"full_name" varchar(50) NOT NULL,
	"email" varchar(255) NOT NULL,
	"status" varchar(50) NOT NULL,
	"bio" text NOT NULL,
	"resume_pdf_url" varchar(200) NOT NULL,
	"social_links" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"education" jsonb NOT NULL,
	"skills" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"work_experience" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"projects" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"club_memberships" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"certifications" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"flagged" boolean DEFAULT false NOT NULL,
	"flag_reason" varchar(300),
	"main_project_name" varchar(255),
	"points" integer DEFAULT 0 NOT NULL,
	"point_breakdown" jsonb,
	"ferpa_consent_signed" boolean DEFAULT false NOT NULL,
	"ferpa_consent_at" timestamp with time zone,
	"share_gpa_with_recruiters" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "member_resumes_member_id_unique" UNIQUE("member_id")
);
--> statement-breakpoint
CREATE TABLE "members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(100),
	"major" varchar(100),
	"graduation_year" varchar(10),
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "members_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "project_participants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"member_id" uuid NOT NULL,
	"role_title" varchar(100) DEFAULT 'Team Member' NOT NULL,
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "project_participants_project_member_unique" UNIQUE("project_id","member_id")
);
--> statement-breakpoint
CREATE TABLE "student_consents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"member_id" uuid NOT NULL,
	"consent_scope" varchar(100) DEFAULT 'recruiter_directory' NOT NULL,
	"gpa_disclosure_authorized" boolean DEFAULT false NOT NULL,
	"resume_disclosure_authorized" boolean DEFAULT true NOT NULL,
	"contact_disclosure_authorized" boolean DEFAULT true NOT NULL,
	"signature_text" varchar(255) NOT NULL,
	"signed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone,
	"revoked_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "event_attendees" ADD CONSTRAINT "event_attendees_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_attendees" ADD CONSTRAINT "event_attendees_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member_resumes" ADD CONSTRAINT "member_resumes_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_participants" ADD CONSTRAINT "project_participants_project_id_ieee_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."ieee_projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_participants" ADD CONSTRAINT "project_participants_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_consents" ADD CONSTRAINT "student_consents_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;