function RecipeSkeleton() {
  return (
    <div className="animate-pulse bg-white p-4 rounded-2xl shadow">
      <div className="w-full h-48 bg-gray-200 rounded-xl"></div>

      <div className="h-4 bg-gray-200 rounded mt-4 w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded mt-2 w-1/2"></div>

      <div className="flex gap-2 mt-4">
        <div className="h-4 w-16 bg-gray-200 rounded"></div>
        <div className="h-4 w-16 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}

export default RecipeSkeleton;
