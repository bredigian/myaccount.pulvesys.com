import { PulverizacionItemSkeleton } from './skeleton';

export const PulverizacionesMasonrySkeleton = () => {
  return (
    <div className='grid grid-cols-6 gap-4 lg:grid-cols-9 xl:grid-cols-10'>
      {Array.from({ length: 20 }, (_, i) => (
        <PulverizacionItemSkeleton key={i} />
      ))}
    </div>
  );
};
