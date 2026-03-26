import { Suspense } from 'react';
import CandidatDetailContent from '@/src/components/candidats/CandidatDetailContent';

export default function CandidatDetailPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CandidatDetailContent />
        </Suspense>
    );
}
