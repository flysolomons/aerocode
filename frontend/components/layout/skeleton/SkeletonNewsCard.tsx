export default function SkeletonNewsCard() {
  return (
    <div className="bg-white rounded shadow-md p-4 border border-gray-100">
      <div className="h-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded mb-4"></div>
      <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-full"></div>
    </div>
  );
}
