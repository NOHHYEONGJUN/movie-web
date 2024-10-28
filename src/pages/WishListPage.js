import React, { useEffect, useState } from 'react';
import { Heart, ArrowUpDown, Calendar, Star, Grid, Table2 } from 'lucide-react';
import Header from '../components/common/header';

const RECOMMENDED_MOVIES_KEY = 'recommendedMovies';

const WishlistPage = () => {
 const [recommendedMovies, setRecommendedMovies] = useState([]);
 const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'asc' });
 const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

 useEffect(() => {
   const savedMovies = localStorage.getItem(RECOMMENDED_MOVIES_KEY);
   if (savedMovies) {
     setRecommendedMovies(JSON.parse(savedMovies));
   }
 }, []);

 const toggleRecommendation = (movie) => {
   const newRecommended = recommendedMovies.filter(m => m.id !== movie.id);
   localStorage.setItem(RECOMMENDED_MOVIES_KEY, JSON.stringify(newRecommended));
   setRecommendedMovies(newRecommended);
 };

 const handleSort = (key) => {
   setSortConfig(current => {
     if (current.key === key) {
       return {
         ...current,
         direction: current.direction === 'asc' ? 'desc' : 'asc'
       };
     }
     return { key, direction: 'asc' };
   });
 };

 const sortedMovies = [...recommendedMovies].sort((a, b) => {
   if (sortConfig.key === 'title') {
     const titleA = (a.title || a.original_title || '').toLowerCase();
     const titleB = (b.title || b.original_title || '').toLowerCase();
     return sortConfig.direction === 'asc' 
       ? titleA.localeCompare(titleB)
       : titleB.localeCompare(titleA);
   }
   if (sortConfig.key === 'release_date') {
     return sortConfig.direction === 'asc'
       ? a.release_date.localeCompare(b.release_date)
       : b.release_date.localeCompare(a.release_date);
   }
   if (sortConfig.key === 'vote_average') {
     return sortConfig.direction === 'asc'
       ? a.vote_average - b.vote_average
       : b.vote_average - a.vote_average;
   }
   return 0;
 });

 const GridView = () => (
   <div className="grid grid-flow-col auto-cols-max gap-2 overflow-x-auto pb-8 relative">
     {sortedMovies.map((movie) => (
       <div key={movie.id} className="relative group cursor-pointer z-0 hover:z-50 px-8 py-16">
         <div className="relative transform-gpu transition-transform duration-300 group-hover:scale-125">
           <img 
             src={movie.image} 
             alt={movie.title}
             className="w-[300px] h-[450px] object-cover rounded-md shadow-lg"
           />
           <div className="absolute inset-0 bg-black/60 opacity-0 
             group-hover:opacity-100 transition-opacity duration-300 ease-in-out rounded-md">
             <div className="absolute inset-0 p-4 flex flex-col justify-between pt-14">
               <div className="space-y-2">
                 <div className="flex items-center justify-between">
                   <h3 className="text-white font-bold text-lg line-clamp-2">{movie.title}</h3>
                   <button
                     onClick={(e) => {
                       e.stopPropagation();
                       toggleRecommendation(movie);
                     }}
                     className="p-2 bg-rose-500 hover:bg-rose-600 rounded-full transition-colors"
                     aria-label="찜하기 취소"
                   >
                     <Heart className="w-5 h-5 fill-white" />
                   </button>
                 </div>
                 <p className="text-gray-300 text-sm line-clamp-4">{movie.overview}</p>
               </div>
               <div className="space-y-2">
                 {movie.genres && movie.genres.length > 0 && (
                   <div className="flex flex-wrap gap-2">
                     {movie.genres.map((genre, index) => (
                       <span 
                         key={index}
                         className="bg-gray-700/50 text-white text-xs px-2 py-1 rounded"
                       >
                         {genre}
                       </span>
                     ))}
                   </div>
                 )}
                 <div className="flex items-center justify-between text-sm">
                   <div className="flex items-center space-x-2">
                     <Calendar className="w-4 h-4" />
                     <span className="text-gray-300">{movie.release_date}</span>
                   </div>
                   <div className="flex items-center space-x-1">
                     <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                     <span className="text-gray-300">{movie.vote_average.toFixed(1)}</span>
                   </div>
                 </div>
               </div>
             </div>
           </div>
         </div>
       </div>
     ))}
   </div>
 );

 const TableView = () => (
   <div className="overflow-x-auto rounded-lg border border-gray-800">
     <table className="w-full text-sm">
       <thead className="text-base uppercase bg-gray-900">
         <tr>
           <th className="px-4 py-4 text-center w-40">
             <span className="text-lg">포스터</span>
           </th>
           <th className="px-4 py-4 cursor-pointer" onClick={() => handleSort('title')}>
             <div className="flex items-center justify-center gap-2">
               <span className="text-lg">제목</span>
               <ArrowUpDown className={`w-5 h-5 ${sortConfig.key === 'title' ? 'text-blue-500' : ''}`} />
             </div>
           </th>
           <th className="px-4 py-4 cursor-pointer w-40" onClick={() => handleSort('release_date')}>
             <div className="flex items-center justify-center gap-2">
               <span className="text-lg">개봉일</span>
               <ArrowUpDown className={`w-5 h-5 ${sortConfig.key === 'release_date' ? 'text-blue-500' : ''}`} />
             </div>
           </th>
           <th className="px-4 py-4 cursor-pointer w-36" onClick={() => handleSort('vote_average')}>
             <div className="flex items-center justify-center gap-2">
               <span className="text-lg">평점</span>
               <ArrowUpDown className={`w-5 h-5 ${sortConfig.key === 'vote_average' ? 'text-blue-500' : ''}`} />
             </div>
           </th>
           <th className="hidden md:table-cell px-4 py-4 text-center w-48">
             <span className="text-lg">장르</span>
           </th>
           <th className="px-4 py-4 text-center w-48">
             <span className="text-lg">찜</span>
           </th>
         </tr>
       </thead>
       <tbody className="text-center">
         {sortedMovies.map((movie) => (
           <tr key={movie.id} className="border-b border-gray-800 bg-gray-900/50 hover:bg-gray-900">
             <td className="px-4 py-6">
               <img 
                 src={movie.image} 
                 alt={movie.title}
                 className="w-28 h-40 object-cover rounded-lg mx-auto shadow-lg"
                 loading="lazy"
               />
             </td>
             <td className="px-4 py-6">
               <div className="space-y-2">
                 <p className="text-lg font-medium">{movie.title || movie.original_title}</p>
                 <p className="text-sm text-gray-400 line-clamp-2 max-w-xl">{movie.overview}</p>
               </div>
             </td>
             <td className="px-4 py-6 text-lg">{movie.release_date}</td>
             <td className="px-4 py-6">
               <div className="flex items-center justify-center space-x-1">
                 <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                 <span className="text-lg">{movie.vote_average?.toFixed(1)}</span>
               </div>
             </td>
             <td className="hidden md:table-cell px-4 py-6">
               <div className="flex flex-wrap gap-1 justify-center">
                 {movie.genres?.map((genre, index) => (
                   <span 
                     key={index}
                     className="bg-gray-700/50 text-white text-xs px-2 py-1 rounded"
                   >
                     {genre}
                   </span>
                 ))}
               </div>
             </td>
             <td className="px-4 py-6">
               <button
                 onClick={() => toggleRecommendation(movie)}
                 className="p-3 bg-rose-500 hover:bg-rose-600 rounded-full transition-colors mx-auto"
                 aria-label="찜하기 취소"
               >
                 <Heart className="w-6 h-6 fill-white" />
               </button>
             </td>
           </tr>
         ))}
       </tbody>
     </table>
   </div>
 );

 return (
   <div className="min-h-screen bg-black text-white">
     <Header />
     <main className="container mx-auto px-2 sm:px-4 pt-24 pb-12">
       <div className="flex justify-between items-center mb-8">
         <h1 className="text-3xl font-bold">내가 찜한 리스트</h1>
         <div className="flex items-center space-x-4">
           <button
             onClick={() => setViewMode('table')}
             className={`px-4 py-2 rounded flex items-center gap-2
               ${viewMode === 'table' ? 'bg-white text-black' : 'bg-gray-800 text-white'}`}
           >
             <Table2 className="w-5 h-5" />
             <span className="hidden sm:inline">테이블 뷰</span>
           </button>
           <button
             onClick={() => setViewMode('grid')}
             className={`px-4 py-2 rounded flex items-center gap-2
               ${viewMode === 'grid' ? 'bg-white text-black' : 'bg-gray-800 text-white'}`}
           >
             <Grid className="w-5 h-5" />
             <span className="hidden sm:inline">그리드 뷰</span>
           </button>
         </div>
       </div>

       {recommendedMovies.length === 0 ? (
         <div className="text-center py-12">
           <Heart className="w-16 h-16 text-gray-500 mx-auto mb-4" />
           <p className="text-gray-400 text-lg">아직 찜한 영화가 없습니다.</p>
         </div>
       ) : (
         viewMode === 'table' ? <TableView /> : <GridView />
       )}
     </main>
   </div>
 );
};

export default WishlistPage;