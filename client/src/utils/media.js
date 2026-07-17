const BREWERY_IMAGES = [
  'https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1559526324-593bc073d938?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1612528443702-f6741f70a049?auto=format&fit=crop&w=900&q=80',
];

const TYPE_IMAGES = {
  farmhouse: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
  regional: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=900&q=80',
  sour: 'https://images.unsplash.com/photo-1566633806327-68e152aaf26d?auto=format&fit=crop&w=900&q=80',
};

const BEER_STYLE_IMAGES = {
  ipa: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=900&q=80',
  stout: 'https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?auto=format&fit=crop&w=900&q=80',
  porter: 'https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?auto=format&fit=crop&w=900&q=80',
  pilsner: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=900&q=80',
  lager: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=900&q=80',
  saison: 'https://images.unsplash.com/photo-1566633806327-68e152aaf26d?auto=format&fit=crop&w=900&q=80',
  farmhouse: 'https://images.unsplash.com/photo-1566633806327-68e152aaf26d?auto=format&fit=crop&w=900&q=80',
  sour: 'https://images.unsplash.com/photo-1566633806327-68e152aaf26d?auto=format&fit=crop&w=900&q=80',
};

const CHALLENGE_IMAGES = {
  beginner: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&w=700&q=80',
  style: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=700&q=80',
  social: 'https://images.unsplash.com/photo-1529511582893-2d7e684dd128?auto=format&fit=crop&w=700&q=80',
  travel: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=700&q=80',
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
  return BREWERY_IMAGES[stableIndex(brewery?.id || brewery?.name, BREWERY_IMAGES.length)];
}

export function beerImageUrl(beer) {
  if (isUsableImageUrl(beer?.image_url)) return beer.image_url;
  const style = beer?.style?.toLowerCase() || '';
  const match = Object.keys(BEER_STYLE_IMAGES).find((key) => style.includes(key));
  return match ? BEER_STYLE_IMAGES[match] : BREWERY_IMAGES[1];
}

export function challengeImageUrl(challenge) {
  if (isUsableImageUrl(challenge?.image_url)) return challenge.image_url;
  return CHALLENGE_IMAGES[challenge?.category] || CHALLENGE_IMAGES.beginner;
}

function isUsableImageUrl(url) {
  if (!url) return false;
  return !String(url).includes('source.unsplash.com');
}
