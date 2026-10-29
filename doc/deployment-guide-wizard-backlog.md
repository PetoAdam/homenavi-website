# Deployment Guide And Setup Wizard Backlog

## Scope

This backlog covers the first release of the website deployment guide and its deterministic client-side setup wizard. Estimates use Fibonacci story points and describe relative implementation effort, not calendar time. Technical claims must remain traceable to the Homenavi repository or an upstream hardware vendor source.

## Release boundaries

**First release:** Epics 1-3. It delivers verified Compose and Helm guidance, the decision wizard, conditional hardware help, explicit capability limits, responsive UI, and regression coverage.

**Later enhancement:** Epic 4. It does not block a useful deployment guide.

## Epic 1: Documentation And Deployment Profiles - 21 points

### DEP-01: Audit deployment sources - 3 points

**User story:** As a prospective operator, I need site guidance that matches the platform I will actually install.

**Description:** Inventory Compose, Helm, `.env.example`, service ownership, and current integration/voice/device support. Record a source link for every command and capability claim.

**Dependencies:** None.

**Acceptance criteria:** Compose and Helm commands are source-backed; unsupported Matter/Thread/voice paths have a documented status; source ownership is recorded.

**Testing requirements:** Compare rendered commands and variable names against the main repository during review.

**Definition of done:** Audit notes are reflected in site content and no unverified runtime claim remains.

### DEP-02: Define deployment profiles and comparison - 5 points

**User story:** As an operator, I can compare self-hosted, hybrid, cloud-first, and Kubernetes-oriented choices before installing.

**Description:** Maintain profile metadata for hosting location, complexity, privacy, availability, cloud dependency, and ideal user.

**Dependencies:** DEP-01.

**Acceptance criteria:** Four profiles are browsable without the wizard; advanced homelab is an overlay rather than a mutually exclusive hosting architecture.

**Testing requirements:** Unit-test profile selection and mobile table usability.

**Definition of done:** Comparison content renders from one typed source of truth.

### DEP-03: Compose and Helm walkthroughs - 8 points

**User story:** As a beginner or cluster operator, I can follow the relevant verified path without mixing Compose and Helm commands.

**Description:** Provide separate step-by-step walkthroughs with prerequisites, commands, expected outcomes, validation, troubleshooting links, persistence, security, and upgrade context.

**Dependencies:** DEP-01, DEP-02.

**Acceptance criteria:** Compose and Helm walkthroughs remain separate; every shown command is documented upstream; incomplete cloud and radio paths are stated as such.

**Testing requirements:** Link checks and build-time guide rendering checks.

**Definition of done:** Each path is reachable from the wizard and detailed guides.

### DEP-04: Hardware and connectivity guidance - 5 points

**User story:** As a user with existing hardware, I can understand what I need without being pushed into unnecessary purchases.

**Description:** Explain host reuse, optional gateways, Zigbee coordinators/Zigbee2MQTT, Matter/Thread boundaries, and voice workload limits.

**Dependencies:** DEP-01.

**Acceptance criteria:** Existing capable hardware is preferred; Zigbee includes its integration path; Thread is not represented as a complete Matter implementation; local AI requirements are conditional.

**Testing requirements:** Unit-test all conditional recommendations.

**Definition of done:** Confirmed, experimental, and planned capabilities are visibly distinct.

## Epic 2: Interactive Deployment Wizard - 26 points

### WIZ-01: Wizard state and accessibility - 8 points

**User story:** As a new self-hoster, I can answer plain-language questions and move back without losing my decisions.

**Description:** Implement hosting, hardware, connectivity, voice, and experience steps with labels, keyboard controls, visible focus, progress, back, restart, and edit-answer actions.

**Dependencies:** DEP-02.

**Acceptance criteria:** Answers persist through back/forward navigation; all inputs have labels; incomplete connectivity has a sensible default.

**Testing requirements:** Playwright keyboard and back-navigation coverage at desktop and mobile widths.

**Definition of done:** Wizard is fully usable without a mouse and does not depend on a backend.

### WIZ-02: Recommendation engine - 8 points

**User story:** As an operator, I receive an explainable profile recommendation rather than a black-box answer.

**Description:** Add a pure typed recommendation engine that returns profile, rationale, pros/cons, required/optional hardware, services, limitations, and a verified walkthrough.

**Dependencies:** DEP-02, DEP-04.

**Acceptance criteria:** Hybrid does not require an extra gateway; existing hosts are reused; unvalidated protocols are warnings rather than installation instructions.

**Testing requirements:** Unit tests for every profile and protocol/voice constraint.

**Definition of done:** Recommendation data is deterministic and separately testable from React.

### WIZ-03: Selected-architecture visualization - 5 points

**User story:** As an operator, I can see which components run at home, remotely, and on the device side.

**Description:** Render a responsive architecture map from the selected profile, voice need, and connectivity constraints.

**Dependencies:** WIZ-02.

**Acceptance criteria:** Local, remote, and physical-device boundaries are distinct; planned Matter/Thread components are not drawn as available.

**Testing requirements:** Visual QA at desktop and mobile widths.

**Definition of done:** Diagram remains readable without animation and with reduced motion.

### WIZ-04: Homepage and guide entry points - 5 points

**User story:** As a visitor, I can find deployment help from the homepage and existing documentation.

**Description:** Make Deploy it yourself a featured homepage destination and link Quickstart, Self-hosting, and Guides to the planner.

**Dependencies:** WIZ-01.

**Acceptance criteria:** Demo and deployment are featured; MCP remains a supporting discovery link; all internal links resolve.

**Testing requirements:** E2E route/link assertions.

**Definition of done:** Navigation remains usable on narrow screens.

## Epic 3: Documentation Quality And Validation - 13 points

### QUA-01: Automated command and link regression checks - 5 points

**User story:** As a maintainer, I can detect drift between wizard guidance and site navigation.

**Description:** Cover recommendation rules, guide registration, page links, and static build output in unit and browser tests.

**Dependencies:** DEP-03, WIZ-02, WIZ-04.

**Acceptance criteria:** Tests cover profiles, incomplete answers, protocol limitations, and guide routes.

**Testing requirements:** Run typecheck, unit, build, responsive E2E, and visual QA in CI.

**Definition of done:** The release pipeline fails on a broken internal guide route or recommendation invariant.

### QUA-02: Accessibility and content review - 3 points

**User story:** As a keyboard or mobile user, I can complete the guide without hidden or misleading information.

**Description:** Review semantic form controls, visible focus, contrast, long-content wrapping, and roadmap labels.

**Dependencies:** WIZ-01, WIZ-03.

**Acceptance criteria:** No horizontal overflow at 390px; no roadmap item is described as shipped; controls retain labels.

**Testing requirements:** Browser accessibility-focused smoke checks and manual screen-reader review.

**Definition of done:** Findings are resolved or recorded as explicit follow-up work.

### QUA-03: Operational content ownership - 5 points

**User story:** As a maintainer, I know when to update deployment guidance after a platform release.

**Description:** Establish review triggers for Compose, chart values, integration capability, hardware verification, and upstream links.

**Dependencies:** DEP-01.

**Acceptance criteria:** Content links to authoritative upstream documents and names unverified estimates.

**Testing requirements:** Link validation in release review.

**Definition of done:** The website does not become an independent source of deployment truth.

## Epic 4: Future Enhancements - 21 points

### FUT-01: Structured hardware catalogue - 8 points

**User story:** As an operator, I can browse confirmed and community hardware without treating it as a shopping list.

**Description:** Add version-controlled metadata for manufacturer, category, protocols, connection, required software, compatibility, limitations, tests, official URL, and verification date.

**Dependencies:** DEP-04, verified vendor research.

**Acceptance criteria:** Recommendations are conditional and entries separate confirmed from untested configurations.

**Testing requirements:** Schema and stale-verification-date checks.

**Definition of done:** No catalogue item implies a hardware purchase is mandatory.

### FUT-02: Downloadable setup checklist and configuration preview - 5 points

**User story:** As an operator, I can keep a tailored setup checklist without generating unsafe secrets or configuration automatically.

**Description:** Export selected recommendation details and optionally preview non-secret configuration choices.

**Dependencies:** WIZ-02.

**Acceptance criteria:** No secret is generated or stored in the browser; preview remains clear about manual review.

**Testing requirements:** Snapshot/unit coverage for exports.

**Definition of done:** Export is useful offline and contains source links.

### FUT-03: Environment validation and architecture discovery - 8 points

**User story:** As an advanced operator, I can validate a chosen host without granting the website runtime control of it.

**Description:** Explore optional local validation tooling and read-only infrastructure discovery, with explicit consent and no deployment automation prerequisite.

**Dependencies:** QUA-03, security design.

**Acceptance criteria:** No backend is introduced merely for recommendations; any probe has documented permissions and failure modes.

**Testing requirements:** Security review and integration tests.

**Definition of done:** Runtime deployment automation remains optional.

## Estimate

- First release, Epics 1-3: **60 points**
- Future enhancements, Epic 4: **21 points**
- Total backlog: **81 points**
