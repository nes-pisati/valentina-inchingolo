'use client'

import PillButton from '../../../ui/PillButton/PillButton'

export const CHECKLIST_OPTIN_EVENT = 'valeink:checklist-optin'

export default function ChecklistButton({ label }: { label: string }) {
  return (
    <PillButton
      label={label}
      variant="default"
      onClick={() => window.dispatchEvent(new CustomEvent(CHECKLIST_OPTIN_EVENT))}
    />
  )
}
