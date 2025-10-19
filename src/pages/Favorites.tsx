import CarCard from '../components/CarCard';
import { useAppStore } from '../store';
import { FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const Favorites = () => {
  const navigate = useNavigate();
  const { graders, parts, favorites, toggleFavorite } = useAppStore();

  // Favorilerdeki graders ve parts'ları ayır
  const favoriteGraders = graders.filter(grader => favorites.includes(grader.id));
  const favoriteParts = parts.filter(part => favorites.includes(part.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Favori Ürünlerim
        </h1>
        <p className="text-gray-600">
          {favoriteGraders.length + favoriteParts.length} favori ürününüz var
        </p>
      </div>

      {(favoriteGraders.length > 0 || favoriteParts.length > 0) ? (
        <div className="space-y-8">
          {/* Favori Graders */}
          {favoriteGraders.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Favori Graderlar ({favoriteGraders.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {favoriteGraders.map(grader => (
                  <CarCard key={grader.id} grader={grader} />
                ))}
              </div>
            </div>
          )}

          {/* Favori Parts */}
          {favoriteParts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Favori Parçalar ({favoriteParts.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {favoriteParts.map(part => (
                  <div 
                    key={part.id} 
                    onClick={() => navigate(`/part/${part.id}`)}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 relative cursor-pointer"
                  >
                    {/* Remove from favorites button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(part.id);
                      }}
                      className="absolute top-3 right-3 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                      title="Favorilerden çıkar"
                    >
                      <FiX className="w-4 h-4 text-red-600" />
                    </button>
                    
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={part.images[0]}
                        alt={part.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6 overflow-hidden">
                      <h3 className="text-lg font-bold text-gray-900 mb-1 break-words">
                        {part.title}
                      </h3>
                      <p className="text-orange-600 font-bold text-xl mb-2">
                        ₺{part.price.toLocaleString()}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                          {part.brand}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                          {part.category}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2 break-words">
                        {part.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Henüz favori ürün yok
          </h3>
          <p className="text-gray-600 mb-6">
            Beğendiğiniz grader ve parçaları favorilere ekleyerek burada görüntüleyebilirsiniz
          </p>
          <a
            href="/"
            className="btn-primary"
          >
            Ürünleri Keşfet
          </a>
        </div>
      )}
    </div>
  );
};

export default Favorites;

