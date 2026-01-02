'use client';

import { useState, useMemo } from 'react';
import { CandidatFilters } from '@/src/components/candidats/CandidatFilters';
import { CandidatTable } from '@/src/components/candidats/CandidatTable';
import { useCandidats } from '@/src/hooks/use-candidats';
import { StudentFilters, PaginatedResponse, StudentStatus } from '@/src/types/candidat';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/src/components/ui/button';
import { Plus } from 'lucide-react';
import { Pagination } from '@/src/components/ui/pagination';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";

const DEFAULT_PAGE_SIZE = 20;

export function CandidatsListContent() {
  const [filters, setFilters] = useState<StudentFilters>({
    page: 0,
    limit: DEFAULT_PAGE_SIZE,
  });
  const { data, isLoading } = useCandidats(filters);
  const t = useTranslations('candidats');
  const params = useParams();
  const locale = (params?.locale as string) ?? 'ar';

  // Dériver l'onglet actif depuis le filtre de statut
  const getActiveTab = () => {
    switch (filters.status) {
      case StudentStatus.REGISTERED:
        return 'inscrits';
      case StudentStatus.IN_TRAINING:
        return 'formation';
      case StudentStatus.LICENSED:
        return 'certifies';
      default:
        return 'all';
    }
  };

  const handleTabChange = (value: string) => {
    let newStatus: StudentStatus | undefined;
    switch (value) {
      case 'inscrits':
        newStatus = StudentStatus.REGISTERED;
        break;
      case 'formation':
        newStatus = StudentStatus.IN_TRAINING;
        break;
      case 'certifies':
        newStatus = StudentStatus.LICENSED;
        break;
      case 'all':
      default:
        newStatus = undefined;
        break;
    }

    setFilters((prev) => ({
      ...prev,
      status: newStatus,
      page: 0, // Reset pagination
    }));
  };

  // Gérer les deux formats de réponse (paginated ou array)
  const paginatedData = useMemo(() => {
    if (!data) {
      return {
        content: [],
        totalElements: 0,
        totalPages: 0,
        page: 0,
        size: DEFAULT_PAGE_SIZE,
        first: true,
        last: true,
      };
    }

    // Si c'est déjà paginé
    if ('content' in data) {
      return data as PaginatedResponse<typeof data.content[0]>;
    }

    // Sinon, wrapper dans un format paginé (rétrocompatibilité)
    return {
      content: data as unknown[],
      totalElements: (data as unknown[]).length,
      totalPages: 1,
      page: 0,
      size: (data as unknown[]).length,
      first: true,
      last: true,
    };
  }, [data]);

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Link href={`/${locale}/candidats/nouveau`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t('newCandidat')}
          </Button>
        </Link>
      </div>

      <Tabs
        value={getActiveTab()}
        onValueChange={handleTabChange}
        className="w-full space-y-6"
        dir={locale === 'ar' ? 'rtl' : 'ltr'}
      >
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="all">{t('all') || 'Tous'}</TabsTrigger>
          <TabsTrigger value="inscrits">{t('registered') || 'Inscrits'}</TabsTrigger>
          <TabsTrigger value="formation">{t('inTraining') || 'En Formation'}</TabsTrigger>
          <TabsTrigger value="certifies">{t('licensed') || 'Certifiés'}</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <CandidatFilters filters={filters} onFiltersChange={setFilters} />
          <CandidatTableWrapper
            paginatedData={paginatedData}
            isLoading={isLoading}
            handlePageChange={handlePageChange}
            t={t}
          />
        </TabsContent>

        <TabsContent value="inscrits" className="space-y-6">
          <CandidatFilters filters={filters} onFiltersChange={setFilters} />
          <CandidatTableWrapper
            paginatedData={paginatedData}
            isLoading={isLoading}
            handlePageChange={handlePageChange}
            t={t}
          />
        </TabsContent>

        <TabsContent value="formation" className="space-y-6">
          <CandidatFilters filters={filters} onFiltersChange={setFilters} />
          <CandidatTableWrapper
            paginatedData={paginatedData}
            isLoading={isLoading}
            handlePageChange={handlePageChange}
            t={t}
          />
        </TabsContent>

        <TabsContent value="certifies" className="space-y-6">
          <CandidatFilters filters={filters} onFiltersChange={setFilters} />
          <CandidatTableWrapper
            paginatedData={paginatedData}
            isLoading={isLoading}
            handlePageChange={handlePageChange}
            t={t}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Wrapper local pour éviter la duplication du tableau
function CandidatTableWrapper({
  paginatedData,
  isLoading,
  handlePageChange,
  t
}: {
  paginatedData: any,
  isLoading: boolean,
  handlePageChange: (page: number) => void,
  t: any
}) {
  return (
    <div className="space-y-4">
      <CandidatTable candidats={paginatedData.content} isLoading={isLoading} />

      {paginatedData.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {paginatedData.page * paginatedData.size + 1} - {Math.min(
              (paginatedData.page + 1) * paginatedData.size,
              paginatedData.totalElements
            )} {t('of') || 'sur'} {paginatedData.totalElements} {t('results')}
          </p>
          <Pagination
            currentPage={paginatedData.page}
            totalPages={paginatedData.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
