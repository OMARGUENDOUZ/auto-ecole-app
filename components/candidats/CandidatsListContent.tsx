'use client';

import { useState } from 'react';
import { CandidatFilters } from '@/components/candidats/CandidatFilters';
import { CandidatTable } from '@/components/candidats/CandidatTable';
import { useCandidats } from '@/hooks/use-candidats';
import { StudentFilters } from '@/types/candidat';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function CandidatsListContent() {
  const [filters, setFilters] = useState<StudentFilters>({});
  const { data: candidats = [], isLoading } = useCandidats(filters);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Link href="/candidats/nouveau">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau Candidat
          </Button>
        </Link>
      </div>

      <CandidatFilters filters={filters} onFiltersChange={setFilters} />
      <CandidatTable candidats={candidats} isLoading={isLoading} />
    </div>
  );
}
