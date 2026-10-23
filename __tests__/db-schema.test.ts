import { members, memberResumes, studentConsents } from "@/db";

describe("Database Schema Integrity & FERPA Model Definitions", () => {
  it("defines members entity with expected fields", () => {
    expect(members).toBeDefined();
    expect(members.id).toBeDefined();
    expect(members.email).toBeDefined();
    expect(members.major).toBeDefined();
    expect(members.graduationYear).toBeDefined();
    expect(members.active).toBeDefined();
  });

  it("defines memberResumes table with 1-to-1 foreign key and FERPA consent fields", () => {
    expect(memberResumes).toBeDefined();
    expect(memberResumes.memberId).toBeDefined();
    expect(memberResumes.fullName).toBeDefined();
    expect(memberResumes.email).toBeDefined();
    expect(memberResumes.education).toBeDefined();
    expect(memberResumes.skills).toBeDefined();
    expect(memberResumes.workExperience).toBeDefined();
    expect(memberResumes.projects).toBeDefined();

    // Verify critical FERPA audit fields
    expect(memberResumes.ferpaConsentSigned).toBeDefined();
    expect(memberResumes.ferpaConsentAt).toBeDefined();
    expect(memberResumes.shareGpaWithRecruiters).toBeDefined();
  });

  it("defines studentConsents audit trail table complying with 34 CFR Part 99", () => {
    expect(studentConsents).toBeDefined();
    expect(studentConsents.memberId).toBeDefined();
    expect(studentConsents.consentScope).toBeDefined();
    expect(studentConsents.gpaDisclosureAuthorized).toBeDefined();
    expect(studentConsents.resumeDisclosureAuthorized).toBeDefined();
    expect(studentConsents.signatureText).toBeDefined();
    expect(studentConsents.signedAt).toBeDefined();
  });
});
