import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Breweries from './pages/Breweries';
import BreweryDetail from './pages/BreweryDetail';
import BreweryForm from './pages/BreweryForm';
import BeerDetail from './pages/BeerDetail';
import BeerForm from './pages/BeerForm';
import Trips from './pages/Trips';
import TripsNew from './pages/TripsNew';
import TripDetail from './pages/TripDetail';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import Challenges from './pages/Challenges';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="breweries" element={<Breweries />} />
        <Route path="breweries/new" element={<ProtectedRoute><BreweryForm /></ProtectedRoute>} />
        <Route path="breweries/:id/edit" element={<ProtectedRoute><BreweryForm /></ProtectedRoute>} />
        <Route path="breweries/:id" element={<BreweryDetail />} />
        <Route path="beers/new" element={<ProtectedRoute><BeerForm /></ProtectedRoute>} />
        <Route path="beers/:breweryId/new" element={<ProtectedRoute><BeerForm /></ProtectedRoute>} />
        <Route path="beers/:id/edit" element={<ProtectedRoute><BeerForm /></ProtectedRoute>} />
        <Route path="beers/:id" element={<BeerDetail />} />
        <Route path="trips" element={<ProtectedRoute><Trips /></ProtectedRoute>} />
        <Route path="trips/new" element={<ProtectedRoute><TripsNew /></ProtectedRoute>} />
        <Route path="trips/:id" element={<ProtectedRoute><TripDetail /></ProtectedRoute>} />
        <Route path="favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
        <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="challenges" element={<Challenges />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
