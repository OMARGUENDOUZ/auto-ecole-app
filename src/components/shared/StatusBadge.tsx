import { Badge } from '@/src/components/ui/badge';
import { getStatusLabel, getStatusColor } from '@/src/lib/utils';
import { StudentStatus } from '@/src/types/candidat';

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
