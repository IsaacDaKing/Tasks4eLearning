const courseData = [
  {
    id: "ba-3105",
    termGroup: "2026 Spring - Eight Wk 1",
    code: "2262-UTDAL-BA-31...",
    title: "BA 3105.055 - Professional Development - S26",
    instructor: "Victoria Cirilo",
    status: "Open",
    accent: "#dc4b3f",
    titleColor: "#dc4b3f",
    image: "assets/course-professional-development.png",
    hero: "assets/course-professional-development.png",
    modules: [
      {
        title: "Start Here",
        summary: "Syllabus, grading rubric, course schedule, and participation expectations.",
        meta: "Module 1 • Available now"
      },
      {
        title: "Career Narrative Workshop",
        summary: "Draft your professional introduction and polish your headline, summary, and elevator pitch.",
        meta: "Module 2 • Due Friday"
      },
      {
        title: "Resume Review Submission",
        summary: "Upload a current resume draft for instructor feedback before the peer review session.",
        meta: "Assignment • 25 points"
      },
      {
        title: "Networking Reflection",
        summary: "Reflect on outreach strategy, informational interviews, and professional communication norms.",
        meta: "Discussion • Due Sunday"
      }
    ]
  },
  {
    id: "baun-3301",
    termGroup: "2026 Spring - regular",
    code: "2262-UTDAL-BUAN...",
    title: "BUAN 3301.502 - AI in Business - S26",
    instructor: "Ashim Bose",
    status: "Open",
    accent: "#4989f4",
    titleColor: "#4989f4",
    image: "assets/course-ai-business.png",
    hero: "assets/course-ai-business.png",
    modules: [
      {
        title: "Foundations of Enterprise AI",
        summary: "Review business use cases, adoption patterns, and common implementation constraints.",
        meta: "Week 1"
      },
      {
        title: "Prompting Lab",
        summary: "Evaluate instruction quality, retrieval grounding, and output consistency across scenarios.",
        meta: "Lab • Available now"
      },
      {
        title: "Case Analysis",
        summary: "Compare how organizations operationalize automation, forecasting, and decision support.",
        meta: "Assignment • 50 points"
      }
    ]
  },
  {
    id: "cs-3354",
    termGroup: "2026 Spring - regular",
    code: "2262-UTDAL-CS-33...",
    title: "CS 3354.012 - Software Engineering - S26",
    instructor: "Klyne Smith",
    status: "Open",
    accent: "#05f17e",
    titleColor: "#05c76a",
    image: "assets/course-software-engineering.png",
    hero: "assets/course-software-engineering.png",
    modules: [
      {
        title: "Project Charter",
        summary: "Team setup, roles, backlog structure, and sprint expectations for the term project.",
        meta: "Sprint 1"
      },
      {
        title: "Requirements Elicitation",
        summary: "User stories, acceptance criteria, and constraints for the initial release plan.",
        meta: "Reading"
      },
      {
        title: "Architecture Review",
        summary: "Static design overview, service boundaries, and interface contracts for the demo build.",
        meta: "Peer review"
      }
    ]
  },
  {
    id: "itss-4300",
    termGroup: "2026 Spring - regular",
    code: "2262-UTDAL-ITSS-4...",
    title: "ITSS 4300.001 - Database Fundamentals - S26",
    instructor: "Naser Islam",
    status: "Open",
    accent: "#1aa260",
    titleColor: "#1aa260",
    image: "assets/course-database-fundamentals.png",
    hero: "assets/course-database-fundamentals.png",
    modules: [
      {
        title: "Relational Modeling",
        summary: "Primary keys, normalization, and diagram conventions for transactional systems.",
        meta: "Lecture"
      },
      {
        title: "SQL Lab 2",
        summary: "Join logic, aggregate functions, and filtering patterns on production style datasets.",
        meta: "Lab • 30 points"
      },
      {
        title: "ER Diagram Critique",
        summary: "Annotate entity relationships and identify data anomalies in the starter model.",
        meta: "Discussion"
      }
    ]
  },
  {
    id: "itss-4360",
    termGroup: "2026 Spring - regular",
    code: "2262-UTDAL-ITSS-4...",
    title: "ITSS 4360.501 - Network and Information Security - S26",
    instructor: "Nambi Thirumalai",
    status: "Open",
    accent: "#ffb300",
    titleColor: "#e48600",
    image: "assets/course-network-security.png",
    hero: "assets/course-network-security.png",
    modules: [
      {
        title: "Threat Landscape Overview",
        summary: "Current attack patterns, security controls, and layered defense concepts.",
        meta: "Week 2"
      },
      {
        title: "Firewall Quiz",
        summary: "Traffic rules, segmentation, and rule order evaluation for perimeter defenses.",
        meta: "Quiz • Timed"
      },
      {
        title: "Incident Response Notes",
        summary: "Prepare a lightweight response checklist for malware, phishing, and access breaches.",
        meta: "Template"
      }
    ]
  },
  {
    id: "opre-3310",
    termGroup: "2026 Spring - regular",
    code: "2262-UTDAL-OPRE-...",
    title: "OPRE 3310.009 - Supply Chain and Operations Management - S26",
    instructor: "Vaidyanathan Vaid...",
    status: "Open",
    accent: "#dc4b3f",
    titleColor: "#dc4b3f",
    image: "assets/course-supply-chain.png",
    hero: "assets/course-supply-chain.png",
    modules: [
      {
        title: "Forecasting Models",
        summary: "Moving averages, exponential smoothing, and demand variability tradeoffs.",
        meta: "Chapter 3"
      },
      {
        title: "Process Flow Mapping",
        summary: "Create and critique a current state operations map using lead time measures.",
        meta: "Workshop"
      },
      {
        title: "Capacity Planning Homework",
        summary: "Analyze throughput and identify bottlenecks in a multi step supply chain system.",
        meta: "Homework • 40 points"
      }
    ]
  }
];

const courseGroupsContainer = document.getElementById("courseGroups");
const moduleList = document.getElementById("moduleList");
const detailTitle = document.getElementById("detailTitle");
const detailInstructor = document.getElementById("detailInstructor");
const courseHero = document.getElementById("courseHero");
const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");
const mobileMenuButton = document.getElementById("mobileMenuButton");
const backToCoursesButton = document.getElementById("backToCourses");
const navItems = Array.from(document.querySelectorAll(".nav-item"));
const pages = Array.from(document.querySelectorAll(".page"));

function renderCourses() {
  const grouped = courseData.reduce((accumulator, course) => {
    if (!accumulator[course.termGroup]) {
      accumulator[course.termGroup] = [];
    }
    accumulator[course.termGroup].push(course);
    return accumulator;
  }, {});

  courseGroupsContainer.innerHTML = Object.entries(grouped)
    .map(([groupTitle, courses]) => {
      const cards = courses
        .map(
          (course) => `
            <article
              class="course-card"
              data-course-id="${course.id}"
              style="--course-color:${course.titleColor};"
              aria-label="Open ${course.title}"
              tabindex="0"
            >
              <div class="course-card__accent" style="background:${course.accent};"></div>
              <div class="course-card__body">
                <div class="course-card__image" style="background-image:url('${course.image}');"></div>
                <div class="course-card__meta">
                  <div class="course-card__code">${course.code}</div>
                  <div class="course-card__title">${course.title}</div>
                  <div class="course-card__status">${course.status}</div>
                  <div class="course-card__footer">
                    <span class="course-card__instructor">${course.instructor}</span>
                    <span class="course-card__favorite" aria-hidden="true">
                      <svg viewBox="0 0 24 24">
                        <path d="m12 17.27 4.95 2.99-1.31-5.63L20 10.76l-5.77-.49L12 5 9.77 10.27 4 10.76l4.36 3.87-1.31 5.63Z"></path>
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </article>
          `
        )
        .join("");

      return `
        <section class="course-group">
          <h2 class="course-group__title">${groupTitle}</h2>
          <div class="course-grid">${cards}</div>
        </section>
      `;
    })
    .join("");

  Array.from(document.querySelectorAll(".course-card")).forEach((card) => {
    card.addEventListener("click", () => openCourseDetail(card.dataset.courseId));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openCourseDetail(card.dataset.courseId);
      }
    });
  });
}

function renderModules(course) {
  moduleList.innerHTML = course.modules
    .map(
      (module) => `
        <article class="module-item">
          <div class="module-item__title">
            <span>${module.title}</span>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
              <path d="m9 6 6 6-6 6-1.41-1.41L12.17 12 7.59 7.41Z"></path>
            </svg>
          </div>
          <div class="module-item__summary">${module.summary}</div>
          <div class="module-item__meta">${module.meta}</div>
        </article>
      `
    )
    .join("");
}

function showPage(pageName) {
  pages.forEach((page) => {
    page.classList.toggle("is-active", page.id === `page-${pageName}`);
  });

  navItems.forEach((item) => {
    const shouldStayHighlighted = pageName === "course-detail" && item.dataset.page === "courses";
    item.classList.toggle("is-active", item.dataset.page === pageName || shouldStayHighlighted);
  });

  if (pageName !== "course-detail") {
    document.body.classList.remove("sidebar-open");
  }
}

function openCourseDetail(courseId) {
  const course = courseData.find((item) => item.id === courseId);
  if (!course) return;

  detailTitle.textContent = course.title;
  detailInstructor.textContent = course.instructor;
  courseHero.style.backgroundImage = `url('${course.hero}')`;
  renderModules(course);
  showPage("course-detail");
}

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    const pageName = item.dataset.page;
    if (pageName === "courses") {
      showPage("courses");
      return;
    }

    showPage(pageName);
  });
});

backToCoursesButton.addEventListener("click", () => {
  showPage("courses");
});

mobileMenuButton.addEventListener("click", () => {
  document.body.classList.toggle("sidebar-open");
});

sidebarOverlay.addEventListener("click", () => {
  document.body.classList.remove("sidebar-open");
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 980) {
    document.body.classList.remove("sidebar-open");
  }
});

renderCourses();
renderModules(courseData[0]);
