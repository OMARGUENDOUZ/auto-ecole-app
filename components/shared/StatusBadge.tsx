import { Badge } from '@/components/ui/badge';
import { getStatusLabel, getStatusColor } from '@/lib/utils';
import { StudentStatus } from '@/types/candidat';

interface StatusBadgeProps {
  status: StudentStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge className={getStatusColor(status)}>
      {getStatusLabel(status)}
    </Badge>
  );
}
