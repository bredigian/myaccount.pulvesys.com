import { LocationItemSkeleton, SprayItemSkeleton } from './skeleton';

export const SpraysMasonrySkeleton = () => {
  return (
    <div className='grid grid-cols-6 gap-4 lg:grid-cols-9 xl:grid-cols-10'>
      {Array.from({ length: 20 }, (_, i) => (
        <SprayItemSkeleton key={i} />
      ))}
    </div>
  );
};

export const LocationsMasonrySkeleton = () => {
  return (
    <div className='grid grid-cols-6 gap-4 lg:grid-cols-9 xl:grid-cols-10'>
      {Array.from({ length: 20 }, (_, i) => (
        <LocationItemSkeleton key={i} />
      ))}
    </div>
  );
};
