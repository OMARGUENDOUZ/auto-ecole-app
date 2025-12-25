'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Student } from '@/types/candidat';
import { formatDate, formatPhoneNumber } from '@/lib/utils';
import { Eye, User } from 'lucide-react';
import Link from 'next/link';

interface CandidatTableProps {
  candidats: Student[];
  isLoading?: boolean;
}

export function CandidatTable({ candidats, isLoading }: CandidatTableProps) {
  if (isLoading) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>Chargement...</p>
      </div>
    );
  }

  if (candidats.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Aucun candidat trouvé</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>N° Inscription</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Prénom</TableHead>
            <TableHead>Date de Naissance</TableHead>
            <TableHead>Permis Demandé</TableHead>
            <TableHead>Téléphone</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidats.map((candidat) => {
            return (
              <TableRow key={candidat.id} className="hover:bg-gray-50">
                <TableCell className="font-mono text-sm font-medium">
                  {candidat.inscriptionId}
                </TableCell>
                <TableCell className="font-medium">
                  {candidat.name.lastName}
                </TableCell>
                <TableCell>
                  {candidat.name.firstName}
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {formatDate(candidat.birthDate)}
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                    {candidat.requestedLicense}
                  </span>
                </TableCell>
                <TableCell className="text-sm">
                  {formatPhoneNumber(candidat.phoneNumber)}
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/candidats/${candidat.id}`}>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
