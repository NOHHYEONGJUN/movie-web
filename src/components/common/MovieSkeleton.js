import React from 'react';

export const GridSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
    {[...Array(10)].map((_, index) => (
      <div key={index} className="relative animate-pulse">
        <div className="w-full aspect-[2/3] bg-gray-800 rounded-lg"></div>
        <div className="absolute inset-0 bg-black/60 rounded-lg p-4 flex flex-col justify-between">
          <div>
            <div className="h-6 bg-gray-700 rounded mb-2 w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-700 rounded w-5/6"></div>
              <div className="h-4 bg-gray-700 rounded w-4/6"></div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-6 bg-gray-700 rounded w-16"></div>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <div className="h-6 bg-gray-700 rounded w-24"></div>
              <div className="h-10 w-10 bg-gray-700 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const TableSkeleton = () => (
  <div className="overflow-x-auto rounded-lg border border-gray-800">
    <table className="w-full text-sm">
      <thead className="text-base uppercase bg-gray-900">
        <tr>
          <th className="px-4 py-4 text-center w-40">포스터</th>
          <th className="px-4 py-4 text-center">제목</th>
          <th className="px-4 py-4 text-center w-40">개봉일</th>
          <th className="px-4 py-4 text-center w-36">평점</th>
          <th className="hidden md:table-cell px-4 py-4 text-center w-48">장르</th>
          <th className="px-4 py-4 text-center w-48">찜</th>
        </tr>
      </thead>
      <tbody>
        {[...Array(5)].map((_, index) => (
          <tr key={index} className="border-b border-gray-800 bg-gray-900/50 animate-pulse">
            <td className="px-4 py-6">
              <div className="w-28 h-40 bg-gray-800 rounded-lg mx-auto"></div>
            </td>
            <td className="px-4 py-6">
              <div className="space-y-2">
                <div className="h-5 bg-gray-800 rounded w-3/4"></div>
                <div className="h-4 bg-gray-800 rounded w-full"></div>
                <div className="h-4 bg-gray-800 rounded w-5/6"></div>
              </div>
            </td>
            <td className="px-4 py-6">
              <div className="h-4 bg-gray-800 rounded mx-auto w-24"></div>
            </td>
            <td className="px-4 py-6">
              <div className="h-4 bg-gray-800 rounded mx-auto w-12"></div>
            </td>
            <td className="hidden md:table-cell px-4 py-6">
              <div className="flex flex-wrap gap-1 justify-center">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="h-6 bg-gray-800 rounded w-16"></div>
                ))}
              </div>
            </td>
            <td className="px-4 py-6">
              <div className="h-12 w-12 bg-gray-800 rounded-full mx-auto"></div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);