import { Badge } from '~/components/ui/Card'
import type { AppRole, MemberStatus } from '~/integrations/supabase/types'

const roleStyles: Record<AppRole, string> = {
  admin: 'bg-forest-100 text-forest-800',
  operator: 'bg-ocean-100 text-ocean-800',
  anggota: 'bg-cendrawasih-100 text-cendrawasih-800',
}

const statusStyles: Record<MemberStatus, string> = {
  pending: 'bg-sand-100 text-sand-700',
  active: 'bg-forest-100 text-forest-800',
  rejected: 'bg-red-100 text-red-700',
  inactive: 'bg-sand-200 text-sand-600',
}

export function RoleBadge({ role }: { role: AppRole }) {
  return <Badge className={roleStyles[role]}>{role}</Badge>
}

export function StatusBadge({ status }: { status: MemberStatus }) {
  return <Badge className={statusStyles[status]}>{status}</Badge>
}
