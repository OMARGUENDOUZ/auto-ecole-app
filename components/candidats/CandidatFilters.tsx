'use client';

import { useCallback } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { STATUS_OPTIONS, LICENSE_OPTIONS } from '@/lib/constants';
import { StudentFilters } from '@/types/candidat';

interface CandidatFiltersProps {
  filters: StudentFilters;
  onFiltersChange: (filters: StudentFilters) => void;
}

export function CandidatFilters({ filters = {}, onFiltersChange }: CandidatFiltersProps) {
  const handleSearchChange = useCallback((field: keyof StudentFilters, value: string) => {
    onFiltersChange({ ...filters, [field]: value || undefined });
  }, [filters, onFiltersChange]);

  const handleReset = useCallback(() => {
    onFiltersChange({});
  }, [onFiltersChange]);

  const hasActiveFilters = Object.values(filters || {}).some(v => v);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Filter className="h-5 w-5 text-gray-500" />
        <h3 className="font-semibold">Filtres de recherche</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="ml-auto"
          >
            <X className="h-4 w-4 mr-1" />
            Réinitialiser
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Prénom */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Prénom..."
            value={filters?.firstName || ''}
            onChange={(e) => handleSearchChange('firstName', e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Nom */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Nom..."
            value={filters?.lastName || ''}
            onChange={(e) => handleSearchChange('lastName', e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Téléphone */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Téléphone..."
            value={filters?.phoneNumber || ''}
            onChange={(e) => handleSearchChange('phoneNumber', e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Status */}
        <Select
          value={filters?.status || 'all'}
          onValueChange={(value) => handleSearchChange('status', value === 'all' ? '' : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Tous les statuts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Permis Demandé */}
        <Select
          value={filters?.requestedLicense || 'all'}
          onValueChange={(value) => handleSearchChange('requestedLicense', value === 'all' ? '' : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Tous les permis" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les permis</SelectItem>
            {LICENSE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
