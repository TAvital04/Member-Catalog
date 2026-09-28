import { pgTable, uuid, varchar, text, boolean, jsonb, timestamp } from 'drizzle-orm/pg-core';

/**
 * Members Table - Unified Core Member Entity across IEEE Monorepo
 */
export const members = pgTable('members', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 100 }),
  major: varchar('major', { length: 100 }),
  graduationYear: varchar('graduation_year', { length: 10 }),
  active: boolean('active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * Member Resumes Table - Enforces 1-to-1 relationship with Members via UNIQUE member_id FK
 */
export const memberResumes = pgTable('member_resumes', {
  id: uuid('id').defaultRandom().primaryKey(),

  // 1-to-1 foreign key reference (member_id is UNIQUE)
  memberId: uuid('member_id')
    .notNull()
    .unique()
    .references(() => members.id, { onDelete: 'cascade' }),

  fullName: varchar('full_name', { length: 50 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  status: varchar('status', { length: 50 }).notNull(), // 'Seeking Internship' | 'Seeking Full-time' | 'Employed'
  bio: text('bio').notNull(),
  resumePdfUrl: varchar('resume_pdf_url', { length: 200 }).notNull(),

  socialLinks: jsonb('social_links')
    .$type<Array<{ platformName: string; profileUrl: string }>>()
    .default([])
    .notNull(),

  education: jsonb('education')
    .$type<Array<{
      schoolName: string;
      degreeType: string;
      major: string;
      gpa?: number;
      gpaScale?: number;
      startDate: string;
      endDate?: string;
      isCurrent: boolean;
      description?: string;
    }>>()
    .notNull(),

  skills: jsonb('skills').$type<string[]>().default([]).notNull(),

  workExperience: jsonb('work_experience')
    .$type<Array<{
      companyName: string;
      jobTitle: string;
      startDate: string;
      endDate?: string;
      isCurrentJob: boolean;
      description: string;
    }>>()
    .default([])
    .notNull(),

  projects: jsonb('projects')
    .$type<Array<{
      projectName: string;
      description: string;
      startDate: string;
      endDate?: string;
      isOngoing: boolean;
      projectLinks: string[];
    }>>()
    .default([])
    .notNull(),

  clubMemberships: jsonb('club_memberships')
    .$type<Array<{
      clubName: string;
      roleTitle: string;
      startDate: string;
      endDate?: string;
      isActive: boolean;
      description?: string;
    }>>()
    .default([])
    .notNull(),

  certifications: jsonb('certifications')
    .$type<Array<{
      certificationName: string;
      issuer: string;
      issueDate: string;
      expirationDate?: string;
      credentialId?: string;
      credentialUrl?: string;
    }>>()
    .default([])
    .notNull(),

  flagged: boolean('flagged').default(false).notNull(),
  flagReason: varchar('flag_reason', { length: 300 }),
  mainProjectName: varchar('main_project_name', { length: 255 }),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * Events Table - IEEE UCF Events & Activities
 */
export const events = pgTable('events', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  location: varchar('location', { length: 255 }).notNull(),
  committeeId: uuid('committee_id'),
  description: text('description').notNull(),
  flyerUrl: varchar('flyer_url', { length: 500 }),
  rsvpLink: varchar('rsvp_link', { length: 500 }),
  photoUrls: text('photo_urls'),
  slug: varchar('slug', { length: 64 }).unique(),
  startTime: timestamp('start_time', { withTimezone: true }).notNull(),
  endTime: timestamp('end_time', { withTimezone: true }),
  requiresDues: boolean('requires_dues').default(false).notNull(),
  active: boolean('active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

/**
 * Event Attendees Table - Join table linking Members to Events they attended
 */
export const eventAttendees = pgTable('event_attendees', {
  id: uuid('id').defaultRandom().primaryKey(),
  eventId: uuid('event_id').notNull().references(() => events.id, { onDelete: 'cascade' }),
  memberId: uuid('member_id').notNull().references(() => members.id, { onDelete: 'cascade' }),
  timestamp: timestamp('timestamp', { withTimezone: true }).defaultNow().notNull(),
});

/**
 * IEEE Projects Table - Chapter Build Projects & Initiatives
 */
export const ieeeProjects = pgTable('ieee_projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 64 }).notNull().unique(),
  description: text('description').notNull(),
  category: varchar('category', { length: 100 }).notNull(), // 'Robotics' | 'Embedded Systems' | 'Software' | 'Power' | 'AI'
  status: varchar('status', { length: 50 }).notNull().default('Active'), // 'Active' | 'Completed' | 'In Development'
  repositoryUrl: varchar('repository_url', { length: 500 }),
  demoUrl: varchar('demo_url', { length: 500 }),
  active: boolean('active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

/**
 * Project Participants Table - Links Members to IEEE Projects
 */
export const projectParticipants = pgTable('project_participants', {
  id: uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('project_id').notNull().references(() => ieeeProjects.id, { onDelete: 'cascade' }),
  memberId: uuid('member_id').notNull().references(() => members.id, { onDelete: 'cascade' }),
  roleTitle: varchar('role_title', { length: 100 }).default('Team Member').notNull(),
  timestamp: timestamp('timestamp', { withTimezone: true }).defaultNow().notNull(),
});
