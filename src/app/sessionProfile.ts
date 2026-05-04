export type SessionRole = "student" | "instructor" | "admin";

export function setSessionProfile(role: SessionRole) {
  const profiles: Record<SessionRole, { name: string; line: string; initials: string }> = {
    student: {
      name: "Carson Smith",
      line: "Student · CXS224467",
      initials: "CS",
    },
    instructor: {
      name: "Dr. Morgan Reeves",
      line: "Instructor · Computer Science",
      initials: "MR",
    },
    admin: {
      name: "Jordan Ellis",
      line: "Administrator · Academic Technology",
      initials: "JE",
    },
  };
  const p = profiles[role];
  localStorage.setItem("lms-profile-name", p.name);
  localStorage.setItem("lms-profile-line", p.line);
  localStorage.setItem("lms-profile-initials", p.initials);
  window.dispatchEvent(new Event("lms-profile-changed"));
}

export function clearSessionProfile() {
  localStorage.removeItem("lms-profile-name");
  localStorage.removeItem("lms-profile-line");
  localStorage.removeItem("lms-profile-initials");
  window.dispatchEvent(new Event("lms-profile-changed"));
}

export function readSessionProfile() {
  return {
    name: localStorage.getItem("lms-profile-name") ?? "Guest",
    line: localStorage.getItem("lms-profile-line") ?? "",
    initials: localStorage.getItem("lms-profile-initials") ?? "?",
  };
}
