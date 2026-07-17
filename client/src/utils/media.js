const BREWERY_IMAGES = [
  '/images/brewery-01.jpg',
  '/images/brewery-02.jpg',
  '/images/brewery-03.jpg',
  '/images/brewery-04.jpg',
  '/images/brewery-05.jpg',
  '/images/brewery-06.jpg',
  '/images/brewery-07.jpg',
  '/images/brewery-08.jpg',
];

// Generic brewery building photos (not tied to a specific named brewery),
// used as a sensible fallback so we never show a different brewery's photo.
const BREWERY_FALLBACK_IMAGES = [
  '/images/brewery-08.jpg',
  '/images/brewery-03.jpg',
  '/images/brewery-04.jpg',
];

const TYPE_IMAGES = {
  farmhouse: '/images/brewery-04.jpg',
  regional: '/images/brewery-02.jpg',
  sour: '/images/brewery-03.jpg',
  micro: '/images/brewery-08.jpg',
};

const BEER_STYLE_IMAGES = {
  ipa: '/images/beer-ipa.jpg',
  'pale ale': '/images/beer-ipa.jpg',
  ale: '/images/beer-lager.jpg',
  stout: '/images/beer-stout.jpg',
  porter: '/images/beer-porter.jpg',
  pilsner: '/images/beer-pilsner.jpg',
  lager: '/images/beer-lager.jpg',
  saison: '/images/beer-saison.jpg',
  farmhouse: '/images/beer-farmhouse.jpg',
  'farmhouse ale': '/images/beer-farmhouse.jpg',
  sour: '/images/beer-sour.jpg',
  wheat: '/images/beer-lager.jpg',
  witbier: '/images/beer-lager.jpg',
  maibock: '/images/beer-lager.jpg',
  'old ale': '/images/beer-stout.jpg',
};

const CHALLENGE_IMAGES = {
  beginner: '/images/challenge-beginner.jpg',
  style: '/images/challenge-style.jpg',
  social: '/images/challenge-social.jpg',
  travel: '/images/challenge-travel.jpg',
};

function stableIndex(value, length) {
  const source = String(value || 'beer-road');
  let hash = 0;
  for (let i = 0; i < source.length; i += 1) {
    hash = source.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % length;
}

export function breweryImageUrl(brewery) {
  if (isUsableImageUrl(brewery?.image_url)) return brewery.image_url;
  const typeKey = brewery?.type?.toLowerCase();
  if (typeKey && TYPE_IMAGES[typeKey]) return TYPE_IMAGES[typeKey];
  return BREWERY_FALLBACK_IMAGES[stableIndex(brewery?.id || brewery?.name, BREWERY_FALLBACK_IMAGES.length)];
}

export function beerImageUrl(beer) {
  if (isUsableImageUrl(beer?.image_url)) return beer.image_url;
  const style = beer?.style?.toLowerCase() || '';
  const match = Object.keys(BEER_STYLE_IMAGES).find((key) => style.includes(key));
  return match ? BEER_STYLE_IMAGES[match] : '/images/beer-lager.jpg';
}

export function challengeImageUrl(challenge) {
  if (isUsableImageUrl(challenge?.image_url)) return challenge.image_url;
  return CHALLENGE_IMAGES[challenge?.category] || CHALLENGE_IMAGES.beginner;
}

function isUsableImageUrl(url) {
  if (!url) return false;
  return !String(url).includes('source.unsplash.com');
}
