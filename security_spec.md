# Security Specification: School Report Assistant (Firebase Firestore)

## 1. Data Invariants
- Each `SchoolReport` belongs to an authenticated user (`userId == request.auth.uid`).
- Each `ReportSubmission` must reference a valid report and be created by the authenticated sender (`userId == request.auth.uid`).
- Unauthenticated users cannot read, list, create, update, or delete any reports or submissions.
- Users cannot read or modify reports belonging to another user.

## 2. Collections
- `/school_reports/{reportId}`: Individual reports containing school statistics, education outputs, and approval status.
- `/report_submissions/{submissionId}`: Records of transmitted/submitted reports sent to Cluster or District Education Offices.

## 3. Threat Model & Safeguards
- **ID Poisoning Guard**: Enforce `isValidId(id)` checking length <= 128 and matching `^[a-zA-Z0-9_\-]+$`.
- **Identity Spoofing Guard**: Ensure `incoming().userId == request.auth.uid` on write.
- **Query Enforcer**: `allow list: if isSignedIn() && resource.data.userId == request.auth.uid` ensures queries are scoped to the authenticated owner.
