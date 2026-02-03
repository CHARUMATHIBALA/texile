# Spec and build

## Agent Instructions

Ask the user questions when anything is unclear or needs their input. This includes:

- Ambiguous or incomplete requirements
- Technical decisions that affect architecture or user experience
- Trade-offs that require business context

Do not make assumptions on important decisions — get clarification first.

---

## Workflow Steps

### [x] Step: Technical Specification

Assess the task's difficulty, as underestimating it leads to poor outcomes.

- easy: Straightforward implementation, trivial bug fix or feature
- **medium**: Moderate complexity, some edge cases or caveats to consider
- hard: Complex logic, many caveats, architectural considerations, or high-risk changes

Create a technical specification for the task that is appropriate for the complexity level:

- Review the existing codebase architecture and identify reusable components.
- Define the implementation approach based on established patterns in the project.
- Identify all source code files that will be created or modified.
- Define any necessary data model, API, or interface changes.
- Describe verification steps using the project's test and lint commands.

Save the output to `d:\new co\.zencoder\chats\97b98a5a-6388-4e00-a332-ee48a05a1e5d/spec.md` with:

- Technical context (language, dependencies)
- Implementation approach
- Source code structure changes
- Data model / API / interface changes
- Verification approach

If the task is complex enough, create a detailed implementation plan based on `d:\new co\.zencoder\chats\97b98a5a-6388-4e00-a332-ee48a05a1e5d/spec.md`:

- Break down the work into concrete tasks (incrementable, testable milestones)
- Each task should reference relevant contracts and include verification steps
- Replace the Implementation step below with the planned tasks

Rule of thumb for step size: each step should represent a coherent unit of work (e.g., implement a component, add an API endpoint, write tests for a module). Avoid steps that are too granular (single function).

Save to `d:\new co\.zencoder\chats\97b98a5a-6388-4e00-a332-ee48a05a1e5d/plan.md`. If the feature is trivial and doesn't warrant this breakdown, keep the Implementation step below as is.

---

### [x] Step: Backend Implementation
- [x] Add `ADMIN_SIGNUP_SECRET` to `backend/.env`
- [x] Update `backend/controllers/authController.js` to handle admin signup with secret and dynamic admin login
- [x] Verify backend changes with manual API calls or tests

### [x] Step: Frontend Implementation
- [x] Update `frontend/src/context/AuthContext.jsx` to support `adminSecret` in signup
- [x] Create `frontend/src/components/AdminSignupModal.jsx`
- [x] Create `frontend/src/components/AdminLoginModal.jsx` (Replaced with `AdminAuth.jsx` page for better accessibility)
- [x] Update `frontend/src/components/Navbar.jsx` or another appropriate location to link to admin login/signup
- [x] Verify frontend implementation by performing admin signup and login

### [x] Step: Final Verification and Report
- [x] Run lint and typecheck if available
- [x] Perform final manual verification
- [x] Write report to `d:\new co\.zencoder\chats\97b98a5a-6388-4e00-a332-ee48a05a1e5d/report.md`
