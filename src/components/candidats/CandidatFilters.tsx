"use client";

import { useCallback, useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';
import { STATUS_OPTIONS, LICENSE_OPTIONS } from '@/src/lib/constants';
import { StudentFilters } from '@/src/types/candidat';
import { useDebounce } from '@/src/hooks/use-debounce';

interface CandidatFiltersProps {
  filters: StudentFilters;
  onFiltersChange: (filters: StudentFilters) => void;
}

export function CandidatFilters({ filters = {}, onFiltersChange }: CandidatFiltersProps) {
  const t = useTranslations('candidats');
  const tLicense = useTranslations('license');
  const tPlaceholders = useTranslations('placeHolders');

  // États locaux pour les champs de recherche (non paginés)
  const [firstName, setFirstName] = useState(filters?.firstName || '');
  const [lastName, setLastName] = useState(filters?.lastName || '');
  const [phoneNumber, setPhoneNumber] = useState(filters?.phoneNumber || '');

  // Debounce des valeurs de recherche (300ms)
  const debouncedFirstName = useDebounce(firstName, 300);
  const debouncedLastName = useDebounce(lastName, 300);
  const debouncedPhoneNumber = useDebounce(phoneNumber, 300);

  // Mettre à jour les filtres quand les valeurs debounced changent
  useEffect(() => {
    // Éviter les mises à jour inutiles si les valeurs n'ont pas changé
    const currentFirstName = filters?.firstName || '';
    const currentLastName = filters?.lastName || '';
    const currentPhoneNumber = filters?.phoneNumber || '';

    if (
      debouncedFirstName !== currentFirstName ||
      debouncedLastName !== currentLastName ||
      debouncedPhoneNumber !== currentPhoneNumber
    ) {
      onFiltersChange({
        ...filters,
        firstName: debouncedFirstName || undefined,
        lastName: debouncedLastName || undefined,
        phoneNumber: debouncedPhoneNumber || undefined,
        page: 0, // Reset à la première page lors d'un changement de filtre
      });
    }
  }, [debouncedFirstName, debouncedLastName, debouncedPhoneNumber, filters, onFiltersChange]);

  // Synchroniser les états locaux avec les filtres externes (si changés de l'extérieur, ex: reset)
  useEffect(() => {
    if (filters?.firstName !== firstName && filters?.firstName !== debouncedFirstName) {
      setFirstName(filters?.firstName || '');
    }
    if (filters?.lastName !== lastName && filters?.lastName !== debouncedLastName) {
      setLastName(filters?.lastName || '');
    }
    if (filters?.phoneNumber !== phoneNumber && filters?.phoneNumber !== debouncedPhoneNumber) {
      setPhoneNumber(filters?.phoneNumber || '');
    }
  }, [filters?.firstName, filters?.lastName, filters?.phoneNumber]);

  // Mettre à jour les filtres quand les valeurs debounced changent
  const handleSearchChange = useCallback((field: keyof StudentFilters, value: string) => {
    // Mettre à jour l'état local immédiatement pour l'UI
    if (field === 'firstName') setFirstName(value);
    if (field === 'lastName') setLastName(value);
    if (field === 'phoneNumber') setPhoneNumber(value);
  }, []);

  // Pour les selects (status, license), pas de debounce nécessaire
  const handleSelectChange = useCallback((field: keyof StudentFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [field]: value === 'all' ? undefined : value,
      page: 0, // Reset à la première page
    });
  }, [filters, onFiltersChange]);

  const handleReset = useCallback(() => {
    onFiltersChange({});
  }, [onFiltersChange]);

  const hasActiveFilters = Object.values(filters || {}).some(v => v);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Filter className="h-5 w-5 text-gray-500" />
        <h3 className="font-semibold">{t('searchFilters')}</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="ltr:ml-auto rtl:mr-auto"
          >
            <X className="h-4 w-4 ltr:mr-1 rtl:ml-1" />
            {t('reset')}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Prénom */}
        <div className="relative">
          <Search className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={tPlaceholders('firstName')}
            value={firstName}
            onChange={(e) => handleSearchChange('firstName', e.target.value)}
            className="ltr:pl-9 rtl:pr-9"
          />
        </div>

        {/* Nom */}
        <div className="relative">
          <Search className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={tPlaceholders('lastName')}
            value={lastName}
            onChange={(e) => handleSearchChange('lastName', e.target.value)}
            className="ltr:pl-9 rtl:pr-9"
          />
        </div>

        {/* Téléphone */}
        <div className="relative">
          <Search className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={tPlaceholders('phone')}
            value={phoneNumber}
            onChange={(e) => handleSearchChange('phoneNumber', e.target.value)}
            className="ltr:pl-9 rtl:pr-9"
          />
        </div>



        {/* Permis Demandé */}
        <Select
          value={filters?.requestedLicense || 'all'}
          onValueChange={(value) => handleSelectChange('requestedLicense', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('allLicenses')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allLicenses')}</SelectItem>
            {LICENSE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {tLicense(option.labelKey)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
