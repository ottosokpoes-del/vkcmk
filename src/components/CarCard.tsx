import { Link } from 'react-router-dom';
import { FiHeart, FiMapPin, FiCalendar, FiActivity, FiSettings } from 'react-icons/fi';
import { Car } from '../types';
import { useAppStore } from '../store';

interface CarCardProps {
  car: Car;
}

const CarCard = ({ car }: CarCardProps) => {
  const { favorites, toggleFavorite } = useAppStore();
  const isFavorite = favorites.includes(car.id);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="card hover:shadow-lg transition-shadow duration-300">
      <Link to={`/car/${car.id}`} className="block">
        {/* Image */}
        <div className="relative h-48 bg-gray-200 overflow-hidden">
          <img
            src={car.images[0]}
            alt={car.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          {car.isNew && (
            <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Yeni İlan
            </div>
          )}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(car.id);
            }}
            className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
          >
            <FiHeart 
              className={`w-4 h-4 ${isFavorite ? 'text-sahibinden-red fill-current' : 'text-gray-600'}`} 
            />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">
            {car.title}
          </h3>

          {/* Price */}
          <div className="text-2xl font-bold text-sahibinden-red mb-3">
            {formatPrice(car.price)}
          </div>

          {/* Specs */}
          <div className="space-y-1 text-sm text-gray-600 mb-3">
            <div className="flex items-center space-x-1">
              <FiCalendar className="w-4 h-4" />
              <span>{car.year}</span>
            </div>
            <div className="flex items-center space-x-1">
              <FiActivity className="w-4 h-4" />
              <span>{car.mileage ? car.mileage.toLocaleString('tr-TR') : 'N/A'} km</span>
            </div>
            <div className="flex items-center space-x-1">
              <FiSettings className="w-4 h-4" />
              <span>{car.fuel} • {car.transmission}</span>
            </div>
            <div className="flex items-center space-x-1">
              <FiMapPin className="w-4 h-4" />
              <span>{car.location}</span>
            </div>
          </div>

          {/* Seller Type */}
          <div className="flex justify-between items-center">
            <span className={`text-xs px-2 py-1 rounded-full ${
              car.sellerType === 'Sahibinden' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {car.sellerType}
            </span>
            <span className="text-xs text-gray-500">
              {new Date(car.createdAt).toLocaleDateString('tr-TR')}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CarCard;

