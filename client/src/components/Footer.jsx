import { Link } from 'react-router-dom';
import { useI18n } from '../context/I18nContext';

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-white hover:text-primary-400 transition-colors">
              <span className="text-2xl">🍻</span>
              <span>Beer Road Save</span>
            </Link>
            <p className="mt-3 text-sm text-gray-400 max-w-md">
              {t('footerText')}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">{t('explore')}</h3>
            <ul className="space-y-2.5">
              <li><Link to="/breweries" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">{t('navBreweries')}</Link></li>
              <li><Link to="/trips" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">{t('roadTrips')}</Link></li>
              <li><Link to="/favorites" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">{t('navFavorites')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">{t('account')}</h3>
            <ul className="space-y-2.5">
              <li><Link to="/login" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">{t('navLogin')}</Link></li>
              <li><Link to="/register" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">{t('navRegister')}</Link></li>
              <li><Link to="/profile" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">{t('navProfile')}</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Beer Road Save. {t('allRightsReserved')}
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">{t('about')}</a>
            <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">{t('privacy')}</a>
            <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">{t('terms')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
