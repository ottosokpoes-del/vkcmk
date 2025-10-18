import CarCard from '../components/CarCard';
import { useAppStore } from '../store';

const Favorites = () => {
  const { cars, favorites } = useAppStore();

  const favoriteCars = cars.filter(car => favorites.includes(car.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Favori İlanlarım
        </h1>
        <p className="text-gray-600">
          {favoriteCars.length} favori ilanınız var
        </p>
      </div>

      {favoriteCars.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoriteCars.map(car => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Henüz favori ilan yok
          </h3>
          <p className="text-gray-600 mb-6">
            Beğendiğiniz araçları favorilere ekleyerek burada görüntüleyebilirsiniz
          </p>
          <a
            href="/"
            className="btn-primary"
          >
            Araçları Keşfet
          </a>
        </div>
      )}
    </div>
  );
};

export default Favorites;

