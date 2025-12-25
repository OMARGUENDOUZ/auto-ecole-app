'use client';

import { useCandidats } from '@/hooks/use-candidats';
import { AlertCircle, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

export default function CandidatsNonFiniContent() {
  const { data: candidats = [], isLoading } = useCandidats();

  if (isLoading) {
    return <div className="text-center py-12">Chargement...</div>;
  }

  // Filter candidats with incomplete status
  const candidatsNonFini = (candidats || []).filter(
    (candidat) => candidat.status === 'REGISTERED'
  );

  if (candidatsNonFini.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Tous les dossiers sont complets</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {candidatsNonFini.map((candidat) => (
        <Link key={candidat.id} href={`/candidats/${candidat.id}`}>
          <Card className="hover:bg-gray-50 cursor-pointer transition-colors">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="font-semibold">
                  {candidat.name.firstName} {candidat.name.lastName}
                </p>
                <p className="text-sm text-gray-600">{candidat.phoneNumber}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
