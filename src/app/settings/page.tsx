"use client"

import { withAuth } from "@/components/auth/withAuth"
import SettingsContent from "@/components/SettingsContent "

function SettingsPage() {
  return <SettingsContent />
}

export default withAuth(SettingsPage)