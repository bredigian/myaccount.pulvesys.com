import BillingContainer from '@/components/billing-container';
import { ManageBillingDropdown } from '@/components/billing-dropdown';
import { SubscriptionContainerSkeleton } from '@/components/container-skeleton';
import { Suspense } from 'react';

export default async function BillingPage() {
  return (
    <main className='space-y-4 p-4 pt-0'>
      <ManageBillingDropdown />
      <Suspense fallback={<SubscriptionContainerSkeleton />}>
        <BillingContainer />
      </Suspense>
    </main>
  );
}
