import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Skeleton } from './ui/skeleton';

export const PulverizacionItemSkeleton = () => {
  return (
    <li className='col-span-full flex items-start justify-between md:col-span-3 xl:col-span-2'>
      <Card className='h-full w-full duration-200 ease-in-out hover:cursor-pointer hover:bg-secondary'>
        <CardHeader>
          <CardTitle className='flex items-start justify-between gap-4'>
            <Skeleton className='h-4 w-full max-w-48' />
            <Skeleton className='h-3 w-32' />
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <ul className='flex flex-wrap items-start gap-2 overflow-hidden'>
            {Array.from({ length: 2 }, (_, i) => (
              <LoteItemSkeleton key={`lote-skeleton-${i}`} />
            ))}
          </ul>
          <div className='flex flex-wrap gap-2'>
            <Skeleton className='h-3 w-28' />
            <Skeleton className='h-3 w-28' />
          </div>
          <ul className='flex flex-wrap items-center gap-2'>
            <Skeleton className='h-3 w-24' />
            <Skeleton className='h-3 w-24' />
            <Skeleton className='h-3 w-24' />
          </ul>
        </CardContent>
      </Card>
    </li>
  );
};

export const LoteItemSkeleton = () => {
  return <Skeleton className='h-6 w-20' />;
};
