# TODO: Add Step Validation and Logout Button to ProductSubmission

## Steps to Complete

- [x] Add validateStep helper function to frontend/src/lib/utils.ts
- [x] Update ProductSubmission.tsx: Integrate validation in handleNext function
- [x] Update ProductSubmission.tsx: Integrate validation in handleGenerateReport function
- [x] Update ProductSubmission.tsx: Add Logout button JSX and logic in the header

## Notes
- Validation: Check all required fields in current step before proceeding.
- Logout: Clear token, navigate to '/', show toast.
- Use window.alert for validation popup.
- Ensure existing functionality remains intact.
