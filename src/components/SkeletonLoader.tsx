import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export const CourseCardSkeleton = () => (
  <Card className="overflow-hidden">
    <Skeleton className="h-48 w-full" />
    <div className="p-6 space-y-4">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
  </Card>
);

export const TestimonialSkeleton = () => (
  <Card className="p-6">
    <div className="flex items-start gap-4 mb-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
    <Skeleton className="h-4 w-20 mb-3" />
    <Skeleton className="h-16 w-full" />
  </Card>
);

export const PartnershipSkeleton = () => (
  <Card className="p-6">
    <div className="flex items-start gap-3 mb-4">
      <Skeleton className="h-12 w-12 rounded" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
    <Skeleton className="h-12 w-full" />
  </Card>
);
