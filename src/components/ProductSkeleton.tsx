import React from "react";

const ProductSkeleton = () => (
  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col animate-pulse">
    <div className="h-56 w-full bg-slate-100" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-slate-100 rounded w-3/4" />
      <div className="h-6 bg-slate-100 rounded w-1/2" />
      <div className="h-10 bg-slate-100 rounded w-full" />
      <div className="space-y-2 pt-4">
        <div className="h-3 bg-slate-100 rounded w-1/2" />
        <div className="h-3 bg-slate-100 rounded w-full" />
      </div>
    </div>
  </div>
);

export default ProductSkeleton;
