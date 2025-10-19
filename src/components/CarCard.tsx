import { Link } from 'react-router-dom';
import { FiHeart, FiMapPin, FiCalendar, FiActivity, FiSettings } from 'react-icons/fi';
import { Grader } from '../types';
import { useAppStore } from '../store';

interface GraderCardProps {
  grader: Grader;
}

const GraderCard = ({ grader }: GraderCardProps) => {
  const { favorites, toggleFavorite } = useAppStore();
  const isFavorite = favorites.includes(grader.id);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="card hover:shadow-lg transition-shadow duration-300">
      <Link to={`/grader/${grader.id}`} className="block">
        {/* Image */}
        <div className="relative h-48 bg-gray-200 overflow-hidden">
          <img
            src={grader.images[0]}
            alt={grader.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          {grader.isNew && (
            <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Yeni İlan
            </div>
          )}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(grader.id);
            }}
            className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
          >
            <FiHeart 
              className={`w-4 h-4 ${isFavorite ? 'text-orange-600 fill-current' : 'text-gray-600'}`} 
            />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">
            {grader.title}
          </h3>

          {/* Price */}
          <div className="text-2xl font-bold text-orange-600 mb-3">
            {formatPrice(grader.price)}
          </div>

          {/* Specs */}
          <div className="space-y-1 text-sm text-gray-600 mb-3">
            <div className="flex items-center space-x-1">
              <FiCalendar className="w-4 h-4" />
              <span>{grader.year}</span>
            </div>
            <div className="flex items-center space-x-1">
              <FiActivity className="w-4 h-4" />
              <span>{grader.operatingHours ? grader.operatingHours.toLocaleString('tr-TR') : 'N/A'} saat</span>
            </div>
            <div className="flex items-center space-x-1">
              <FiSettings className="w-4 h-4" />
              <span>{grader.fuel} • {grader.transmission}</span>
            </div>
            <div className="flex items-center space-x-1">
              <FiMapPin className="w-4 h-4" />
              <span>{grader.location}</span>
            </div>
          </div>

          {/* Seller Type */}
          <div className="flex justify-between items-center">
            <span className={`text-xs px-2 py-1 rounded-full ${
              grader.sellerType === 'Sahibinden' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {grader.sellerType}
            </span>
            <span className="text-xs text-gray-500">
              {new Date(grader.createdAt).toLocaleDateString('tr-TR')}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default GraderCard;

