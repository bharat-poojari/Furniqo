import { cn } from '../../utils/cn';

export const Skeleton = ({ className }) => {
  return (
    <div
      className={cn(
        'animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800',
        className
      )}
    />
  );
};

export const ProductCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden shadow-soft border border-neutral-100 dark:border-neutral-800">
      <Skeleton className="w-full h-56 rounded-none" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex gap-2 items-center pt-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
};

export const ProductDetailSkeleton = () => {
  return (
    <div className="w-full px-[1%] sm:px-[1.5%] py-8">
      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-4">
          <Skeleton className="w-full aspect-square rounded-2xl" />
          <div className="grid grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-32 w-full" />
          <div className="flex gap-3">
            <Skeleton className="h-12 flex-1" />
            <Skeleton className="h-12 w-12" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const CartSkeleton = () => {
  return (
    <div className="w-full px-[1%] sm:px-[1.5%] py-8">
      <Skeleton className="h-8 w-48 mb-8" />
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-4 p-4 bg-white dark:bg-neutral-900 rounded-xl">
              <Skeleton className="w-24 h-24 rounded-lg flex-shrink-0" />
              <div className="flex-grow space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/4" />
                <div className="flex justify-between">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div>
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export const ProfileSkeleton = () => {
  return (
    <div className="w-full px-[1%] sm:px-[1.5%] py-8 max-w-2xl">
      <Skeleton className="h-12 w-12 rounded-full mb-6" />
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
};

export const HomeSkeleton = () => {
  return (
    <div>
      <Skeleton className="w-full h-[600px] rounded-none" />
      <div className="w-full px-[1%] sm:px-[1.5%] py-16">
        <div className="text-center mb-12">
          <Skeleton className="h-8 w-64  mb-4" />
          <Skeleton className="h-4 w-96 " />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="text-center">
              <Skeleton className="w-full h-32 rounded-xl mb-3" />
              <Skeleton className="h-4 w-20 " />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};