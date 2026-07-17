-- Seed sample breweries across the US.
-- ON CONFLICT (id) DO NOTHING keeps re-seeding idempotent.

INSERT INTO breweries (id, name, address, city, state, country, lat, lng, website, phone, description, type) VALUES
(1,  'Deschutes Brewery', '1044 NW Bond St', 'Bend', 'OR', 'USA', 44.0582, -121.3153, 'https://www.deschutesbrewery.com', '541-382-9242', 'Pioneering Pacific Northwest brewery known for Fresh Squeezed IPA and Black Butte Porter, with a lively pub in downtown Bend.', 'Micro'),
(2,  'Rogue Ales', '2320 OSU Dr', 'Newport', 'OR', 'USA', 44.6303, -124.0535, 'https://www.rogue.com', '541-867-3660', 'Coastal craft brewery with a sprawling taproom, famous for Dead Guy Ale and its own estate hops and malt.', 'Micro'),
(3,  'Cascade Brewing', '939 SE Belmont St', 'Portland', 'OR', 'USA', 45.5156, -122.6587, 'https://www.cascadebrewing.com', '503-265-8603', 'The sour beer authority of Portland, specializing in barrel-aged fruit lambics and blends.', 'Sour'),
(4,  'Hair of the Dog Brewing', '4509 SE 23rd Ave', 'Portland', 'OR', 'USA', 45.4908, -122.6417, 'https://www.haarofthedog.com', '503-232-6585', 'Small-batch brewery celebrated for big, complex ales like Adam and Fred, served in a converted warehouse.', 'Micro'),
(5,  'Great Divide Brewing Co.', '2201 Arapahoe St', 'Denver', 'CO', 'USA', 39.7536, -104.9889, 'https://www.greatdivide.com', '303-296-9460', 'Denver staple founded in 1994, beloved for Yeti Imperial Stout and Colette Saison.', 'Micro'),
(6,  'New Belgium Brewing', '500 Linden St', 'Fort Collins', 'CO', 'USA', 40.5884, -105.0808, 'https://www.newbelgium.com', '970-221-0524', 'Fat Tire originators with a sustainability-focused, bike-friendly riverside campus.', 'Micro'),
(7,  'Left Hand Brewing', '1265 Boston Ave', 'Longmont', 'CO', 'USA', 40.1672, -105.1028, 'https://www.lefthandbrewing.com', '303-772-3373', 'Nitro milk stout specialists and a cornerstone of the Front Range beer scene.', 'Micro'),
(8,  'Avery Brewing', '4910 Nautilus Ct N', 'Boulder', 'CO', 'USA', 40.0636, -105.2008, 'https://www.averybrewing.com', '303-440-4324', 'Boulder brewery known for the Demons series and an expansive food menu overlooking the Flatirons.', 'Micro'),
(9,  'Stone Brewing', '2818 Historic Decatur Rd', 'San Diego', 'CA', 'USA', 32.7341, -117.1975, 'https://www.stonebrewing.com', '619-269-2100', 'Iconic Southern California brewery behind Stone IPA, set in a gardens-and-koi-pond espresso roastery-like campus.', 'Micro'),
(10, 'Ballast Point Brewing', '10051 Old Grove Rd', 'San Diego', 'CA', 'USA', 32.9013, -117.1170, 'https://www.ballastpoint.com', '858-695-2739', 'San Diego brewery famous for Sculpin IPA and a wide range of experimental small-batch releases.', 'Micro'),
(11, 'Modern Times Beer', '3000 Upas St', 'San Diego', 'CA', 'USA', 32.7545, -117.1434, 'https://www.moderntimesbeer.com', '619-546-9694', 'Futuristic-themed craft brewery known for crisp lagers and hazy IPAs in the North Park neighborhood.', 'Micro'),
(12, 'Green Flash Brewing', '6550 Mira Mesa Blvd', 'San Diego', 'CA', 'USA', 32.9141, -117.1400, 'https://www.greenflashbrew.com', '858-622-0085', 'West Coast IPA pioneers with a tasting room built around a sprawling bar and outdoor beer garden.', 'Micro'),
(13, 'Wicked Weed Brewing', '91 Biltmore Ave', 'Asheville', 'NC', 'USA', 35.5941, -82.5511, 'https://www.wickedweedbrewing.com', '828-575-9599', 'Asheville Brewpub famed for funky sours and the annual Funkatorium sour beer showcase.', 'Sour'),
(14, 'Sierra Nevada Brewing Co.', '100 Sierra Nevada Way', 'Mills River', 'NC', 'USA', 35.3840, -82.6020, 'https://www.sierranevada.com', '828-708-6464', 'East Coast outpost of the California legend, with a farm-to-table restaurant and expansive beer garden.', 'Micro'),
(15, 'Hi-Wire Brewing', '197 Hilliard Ave', 'Asheville', 'NC', 'USA', 35.5963, -82.5556, 'https://www.hiwirebrewing.com', '828-738-9531', 'Asheville brewery known for balanced lagers, Zirkusfest, and a big top-themed taproom.', 'Micro'),
(16, 'Founders Brewing Co.', '235 Grandville Ave SW', 'Grand Rapids', 'MI', 'USA', 42.9584, -85.6767, 'https://www.foundersbrewing.com', '616-776-1195', 'Michigan heavyweight behind KBS, Breakfast Stout, and All Day IPA, with a massive downtown taproom.', 'Micro'),
(17, 'Bell''s Brewery', '355 E Kalamazoo Ave', 'Kalamazoo', 'MI', 'USA', 42.2917, -85.5828, 'https://www.bellsbeer.com', '269-382-2338', 'Home of Two Hearted Ale, one of Americas most decorated IPAs, in a historic Kalamazoo origami-inspired space.', 'Micro'),
(18, 'Dogfish Head Craft Brewery', '6 Cannery Village Center', 'Milton', 'DE', 'USA', 38.7740, -75.3100, 'https://www.dogfish.com', '302-684-1000', 'Off-centered ales like 60 Minute IPA and World Wide Stout, brewed with unconventional ingredients.', 'Micro'),
(19, 'The Alchemist', '100 Cannery St', 'Stowe', 'VT', 'USA', 44.4659, -72.6810, 'https://www.alchemistbeer.com', '802-253-2911', 'Vermont brewery behind the legendary Heady Topper double IPA, served fresh from the can.', 'Micro'),
(20, 'Hill Farmstead Brewery', '403 Hill Rd', 'Greensboro Bend', 'VT', 'USA', 44.5532, -72.2647, 'https://www.hillfarmstead.com', '802-506-0012', 'Rural Vermont farmhouse brewery consistently ranked among the best in the world for saisons and pale ales.', 'Farmhouse'),
(21, 'Austin Beerworks', '3009 Industrial Terrace', 'Austin', 'TX', 'USA', 30.4120, -97.7250, 'https://www.austinbeerworks.com', '512-821-2499', 'Austin brewery behind Peacemaker Anytime Ale and a drive-thru can line beloved by locals.', 'Micro'),
(22, 'Jester King Brewery', '13187 Fitzhugh Rd', 'Austin', 'TX', 'USA', 30.2305, -97.9300, 'https://www.jesterkingbrewery.com', '512-537-5100', 'Hill Country farmhouse brewery making spontaneously fermented and mixed-culture wild ales.', 'Farmhouse'),
(23, 'Lagunitas Brewing Co.', '1280 N McDowell Blvd', 'Petaluma', 'CA', 'USA', 38.2710, -122.6410, 'https://www.lagunitas.com', '707-769-4490', 'Northern California brewery known for its IPA and a groovy, music-filled taproom experience.', 'Micro'),
(24, 'Brooklyn Brewery', '79 N 11th St', 'Brooklyn', 'NY', 'USA', 40.7225, -73.9555, 'https://www.brooklynbrewery.com', '718-486-7422', 'Williamsburg institution behind Brooklyn Lager, credited with helping spark the NYC craft beer revival.', 'Micro');

INSERT INTO breweries (id, name, address, city, state, country, lat, lng, website, phone, description, type) VALUES
(25, 'Pivovar Lvivske', 'vul. Kleparivska 1', 'Lviv', 'Lviv Oblast', 'Ukraine', 49.8419, 24.0315, 'https://www.lvivske.com', '+380 32 297 7700', 'Historic Lviv brewery dating back to 1715, famous for Lvivske 1715 lager and strong beer traditions in western Ukraine.', 'Micro'),
(26, 'Obolon Brewery', 'vul. Obolonska 1', 'Kyiv', 'Kyiv Oblast', 'Ukraine', 50.5161, 30.5083, 'https://www.obolon.com', '+380 44 494 0404', 'Ukraine largest brewery and beverage company, producing Obolon, Zlatopramen, and Hoff brands with a modern riverside facility in Kyiv.', 'Regional'),
(27, 'Chernihivske Brewery', 'vul. Zhabynskoho 1', 'Chernihiv', 'Chernihiv Oblast', 'Ukraine', 51.5050, 31.2847, 'https://www.chernihivske.com', '+380 462 690 040', 'Northern Ukraine brewery known for clean lagers and active community support, with roots tracing back to 1964.', 'Micro'),
(28, 'Slavutych Brewery', 'vul. Solomianska 3', 'Kyiv', 'Kyiv Oblast', 'Ukraine', 50.4350, 30.5200, 'https://www.slavutych.ua', '+380 44 492 8888', 'Kyiv-based brewery producing Slavutych and Tuborg under license, with strong distribution across central Ukraine.', 'Regional'),
(29, 'Yantar Brewery', 'vul. Kantakuzy 1', 'Mykolaiv', 'Mykolaiv Oblast', 'Ukraine', 46.9750, 31.9946, 'https://www.yantar.ua', '+380 512 58 7000', 'Southern Ukraine brewery with Baltic heritage, producing amber-hued lagers and seasonal beers.', 'Micro'),
(30, 'Zhiguli Brewery', 'vul. Metalurhiv 1', 'Zaporizhzhia', 'Zaporizhzhia Oblast', 'Ukraine', 47.8388, 35.1396, 'https://www.zhiguli.com.ua', '+380 612 65 8000', 'Eastern Ukraine brewery known for traditional Kvass and classic lager styles.', 'Micro'),
(31, 'Rogozhanska Bereza', 'vul. Shevchenka 12', 'Khmelnytskyi', 'Khmelnytskyi Oblast', 'Ukraine', 49.4200, 27.0000, 'https://www.berega.ua', '+380 382 270 300', 'Western Ukraine craft brewery focused on farmhouse and saison-style ales with local grain.', 'Micro'),
(32, 'Dnipro Beer', 'prosp. Slobozhanskyi 100', 'Dnipro', 'Dnipropetrovsk Oblast', 'Ukraine', 48.4647, 35.0462, 'https://www.dniprobeer.ua', '+380 56 790 0100', 'Industrial-scale brewery on the Dnipro River, producing golden lagers for eastern Ukraine markets.', 'Regional');

INSERT INTO breweries (id, name, address, city, state, country, lat, lng, website, phone, description, type) VALUES
(33, 'Pilsner Urquell', 'U Prazdroje 7', 'Plzeň', 'Plzeň Region', 'Czech Republic', 49.7384, 13.3736, 'https://www.pilsnerurquell.com', '+420 377 062 111', 'The birthplace of pilsner lager, brewing since 1842 with open fermentation and historic lagering caves in Plzeň.', 'Regional'),
(34, 'Budweiser Budvar', 'Karoliny Světlé 4', 'České Budějovice', 'South Bohemian Region', 'Czech Republic', 48.9747, 14.4806, 'https://www.budweiser-budvar.cz', '+420 387 705 111', 'State-owned brewery in the city of Budweis, producing the original Czechvar lager with dual-hopping and lagered beer.', 'Regional'),
(35, 'Staropramen Brewery', 'Nádražní 84', 'Prague', 'Prague Region', 'Czech Republic', 50.0755, 14.4378, 'https://www.staropramen.cz', '+420 224 107 111', 'Iconic Prague brewery dating to 1869, known for Staropramen lager and a popular riverfront brewery restaurant.', 'Regional'),
(36, 'Kozel Brewery', '9. Května 1', 'Velké Popovice', 'Central Bohemian Region', 'Czech Republic', 49.2833, 14.6333, 'https://www.velkopopovickykoz.cz', '+420 541 621 111', 'Famous for the goat mascot and smooth Velkopopovický Kozel lager, brewed since 1874 in a small Moravian town.', 'Regional'),
(37, 'Krušovice Brewery', 'Krušovice 1', 'Krušovice', 'Central Bohemian Region', 'Czech Republic', 50.1667, 14.0333, 'https://www.krusovice.cz', '+420 312 661 111', 'Royal brewery with a 500-year history, producing Krušovice lager and dark beers for the Czech and export markets.', 'Regional'),
(38, 'Radegast Brewery', 'Nošovice 1', 'Nošovice', 'Moravian-Silesian Region', 'Czech Republic', 49.7167, 18.3167, 'https://www.radegast.cz', '+420 558 621 111', 'Moravian powerhouse behind Radegast and Radegast Birell, with one of the most modern breweries in Central Europe.', 'Regional'),
(39, 'Starobrno Brewery', 'Vídeňská 12', 'Brno', 'South Moravian Region', 'Czech Republic', 49.1951, 16.6068, 'https://www.starobrno.cz', '+420 541 151 111', 'Brno landmark brewery founded in 1872, producing Starobrno Draught and seasonal specialty beers.', 'Regional'),
(40, 'Matuška Brewery', 'Horka 1', 'Horka nad Moravou', 'Olomouc Region', 'Czech Republic', 49.6333, 17.1500, 'https://www.matuska.cz', '+420 583 311 111', 'Small craft brewery in Olomouc known for hop-forward Czech ales and experimental barrel-aged releases.', 'Micro');

INSERT INTO beers (id, brewery_id, name, style, abv, ibu, description, image_url) VALUES
(1, 1, 'Fresh Squeezed IPA', 'IPA', 6.5, 65, 'Piney, citrusy IPA with a smooth malt backbone and a lingering dry-hop finish.', '/images/beer-ipa.jpg'),
(2, 1, 'Black Butte Porter', 'Porter', 5.5, 40, 'Rich chocolate and coffee notes with a hint of dark fruit and a creamy mouthfeel.', '/images/beer-porter.jpg'),
(3, 5, 'Yeti Imperial Stout', 'Stout', 9.5, 60, 'Massive dark stout with roasty malt, chocolate, and a warming alcohol presence.', '/images/beer-stout.jpg'),
(4, 5, 'Colette Saison', 'Saison', 7.2, 25, 'Farmhouse saison with peppery yeast, citrus peel, and a dry, crisp finish.', '/images/beer-saison.jpg'),
(5, 9, 'Stone IPA', 'IPA', 6.9, 70, 'Aggressively hopped west coast IPA with pine, resin, and tropical fruit aromatics.', '/images/beer-ipa.jpg'),
(6, 16, 'All Day IPA', 'IPA', 4.7, 50, 'Session IPA that delivers bold hop flavor without the heavy alcohol burden.', '/images/beer-ipa.jpg'),
(7, 16, 'Breakfast Stout', 'Stout', 8.3, 60, 'Oatmeal stout brewed with coffee and chocolate for a rich breakfast-in-a-glass experience.', '/images/beer-stout.jpg'),
(8, 20, 'Abner', 'Farmhouse Ale', 6.5, 30, 'Dry-hopped farmhouse ale with wild fermentation character and a hazy golden hue.', '/images/beer-farmhouse.jpg'),
(9, 33, 'Pilsner Urquell', 'Pilsner', 4.4, 35, 'The original pilsner. Crisp, golden lager with Saaz hop bitterness and a bready malt body.', '/images/beer-pilsner.jpg'),
(10, 34, 'Budvar Czechvar', 'Lager', 5.0, 35, 'Smooth, balanced Czech lager with dual-hopping for a refined bitter finish.', '/images/beer-lager.jpg'),
(11, 25, 'Lvivske 1715', 'Lager', 4.8, 28, 'Classic Ukrainian lager with a light golden color, gentle hop bitterness, and a clean finish.', '/images/beer-lager.jpg'),
(12, 26, 'Obolon Premium', 'Lager', 5.2, 32, 'Ukraine''s flagship lager. Light, refreshing, and easy-drinking with subtle malt sweetness.', '/images/beer-lager.jpg');

-- Expanded signature beers so every brewery detail page shows a beer list.
INSERT INTO beers (id, brewery_id, name, style, abv, ibu, description, image_url) VALUES
(13, 2, 'Rogue Dead Guy Ale', 'Maibock', 6.5, 40, 'Smooth, malty Maibock with a crisp finish and a cult following.', '/images/beer-lager.jpg'),
(14, 3, 'Cascade Sang Royale', 'Sour', 8.0, 10, 'Blended barrel-aged sour cherry ale, tart and complex.', '/images/beer-sour.jpg'),
(15, 4, 'Hair of the Dog Adam', 'Old Ale', 10.0, 50, 'Historic-style aged strong ale with deep malt and dark fruit.', '/images/beer-stout.jpg'),
(16, 6, 'New Belgium Fat Tire', 'Ale', 5.2, 22, 'Balanced amber ale with toasted malt and a hint of fruit.', '/images/beer-lager.jpg'),
(17, 7, 'Left Hand Milk Stout', 'Stout', 6.0, 25, 'Silky nitro milk stout with cocoa and coffee sweetness.', '/images/beer-stout.jpg'),
(18, 8, 'Avery White Rascal', 'Witbier', 5.6, 20, 'Belgian-style white ale with coriander and orange peel.', '/images/beer-lager.jpg'),
(19, 10, 'Ballast Point Sculpin', 'IPA', 7.0, 70, 'Bright, tropical IPA bursting with apricot and citrus.', '/images/beer-ipa.jpg'),
(20, 11, 'Modern Times Fortunate Islands', 'IPA', 6.0, 45, 'Hazy IPA with wheat and a juicy tropical character.', '/images/beer-ipa.jpg'),
(21, 12, 'Green Flash West Coast IPA', 'IPA', 7.3, 95, 'Resinous, bitter West Coast IPA with pine and grapefruit.', '/images/beer-ipa.jpg'),
(22, 13, 'Wicked Weed Pernicious', 'IPA', 7.2, 70, 'Dank, citrusy IPA that became an Asheville staple.', '/images/beer-ipa.jpg'),
(23, 14, 'Sierra Nevada Pale Ale', 'Pale Ale', 5.6, 38, 'The classic American pale ale with Cascade citrus-pine.', '/images/beer-ipa.jpg'),
(24, 15, 'Hi-Wire Zirkusfest', 'Lager', 5.3, 22, 'Munich-style festbier lager, malty and smooth.', '/images/beer-lager.jpg'),
(25, 17, 'Bell''s Two Hearted Ale', 'IPA', 7.0, 55, 'Celebrated Centennial IPA, piney and floral.', '/images/beer-ipa.jpg'),
(26, 18, 'Dogfish Head 60 Minute IPA', 'IPA', 6.0, 60, 'Continuously hopped IPA with balanced bitterness.', '/images/beer-ipa.jpg'),
(27, 19, 'The Alchemist Heady Topper', 'IPA', 8.0, 75, 'Legendary double IPA, best enjoyed fresh from the can.', '/images/beer-ipa.jpg'),
(28, 21, 'Austin Beerworks Peacemaker', 'Ale', 5.0, 30, 'Easy-drinking anytime ale, a local Austin favorite.', '/images/beer-lager.jpg'),
(29, 22, 'Jester King Atrial Rubicite', 'Sour', 7.0, 10, 'Barrel-aged sour ale with raspberry, funky and tart.', '/images/beer-sour.jpg'),
(30, 23, 'Lagunitas IPA', 'IPA', 6.2, 65, 'Floral, citrusy IPA from the NorCal pioneers.', '/images/beer-ipa.jpg'),
(31, 24, 'Brooklyn Lager', 'Lager', 5.2, 33, 'Vienna-style amber lager, malty with noble hops.', '/images/beer-lager.jpg'),
(32, 27, 'Chernihivske Svitle', 'Lager', 4.8, 25, 'Clean Ukrainian pale lager with a soft malt body.', '/images/beer-lager.jpg'),
(33, 28, 'Slavutych Pshenychne', 'Wheat', 5.0, 18, 'Crisp Ukrainian wheat beer with light citrus notes.', '/images/beer-lager.jpg'),
(34, 29, 'Yantar Yantarne', 'Lager', 4.7, 22, 'Amber-hued Baltic lager, gently sweet and smooth.', '/images/beer-lager.jpg'),
(35, 30, 'Zhiguli Svitle', 'Lager', 4.5, 20, 'Traditional golden lager with a clean, malty finish.', '/images/beer-lager.jpg'),
(36, 31, 'Rogozhanska Bereza Saison', 'Saison', 6.0, 28, 'Farmhouse saison brewed with local grain and yeast.', '/images/beer-saison.jpg'),
(37, 32, 'Dnipro Zolote', 'Lager', 4.6, 22, 'Golden river lager for eastern Ukraine markets.', '/images/beer-lager.jpg'),
(38, 35, 'Staropramen Lezákk', 'Lager', 5.0, 30, 'Prague''s clean, balanced draught lager.', '/images/beer-lager.jpg'),
(39, 36, 'Kozel Svetly', 'Lager', 4.0, 20, 'Smooth, malty Czech pale lager with a creamy head.', '/images/beer-lager.jpg'),
(40, 37, 'Krusovice Imperial', 'Lager', 4.8, 22, 'Royal brewery pale lager, crisp and approachable.', '/images/beer-lager.jpg'),
(41, 38, 'Radegast Original', 'Pilsner', 4.9, 38, 'Moravian pilsner with a firm noble-hop bite.', '/images/beer-pilsner.jpg'),
(42, 39, 'Starobrno Drak', 'Lager', 5.0, 28, 'Brno draught lager, malty and easy-going.', '/images/beer-lager.jpg'),
(43, 40, 'Matuška Raptor', 'IPA', 7.0, 65, 'Hop-forward Czech craft IPA, bold and resinous.', '/images/beer-ipa.jpg');

INSERT INTO challenges (id, title, description, difficulty, points, category, image_url) VALUES
(1, 'First Sip', 'Visit your first brewery and try a local beer', 'easy', 10, 'beginner', '/images/challenge-beginner.jpg'),
(2, 'IPA Explorer', 'Try an IPA at 3 different breweries', 'medium', 25, 'style', '/images/challenge-style.jpg'),
(3, 'Stout Connoisseur', 'Find and taste a stout or porter', 'medium', 20, 'style', '/images/challenge-style.jpg'),
(4, 'Saison Adventure', 'Try a farmhouse saison', 'medium', 20, 'style', '/images/challenge-style.jpg'),
(5, 'Pilsner Purist', 'Drink a classic Czech pilsner', 'easy', 15, 'style', '/images/challenge-style.jpg'),
(6, 'Sour Pioneer', 'Taste a sour or wild ale', 'medium', 25, 'style', '/images/challenge-style.jpg'),
(7, 'Barrel Aged Hunter', 'Find a barrel-aged beer', 'hard', 50, 'style', '/images/challenge-barrel.jpg'),
(8, 'Trip Planner', 'Create your first brewery road trip', 'easy', 10, 'social', '/images/challenge-social.jpg'),
(9, 'Social Butterfly', 'Leave a review at 5 different breweries', 'medium', 30, 'social', '/images/challenge-social.jpg'),
(10, 'Beer Photographer', 'Upload a photo of your beer', 'easy', 15, 'social', '/images/challenge-social.jpg'),
(11, 'Cross-Country Brewer', 'Visit breweries in 2 different countries', 'hard', 100, 'travel', '/images/challenge-travel.jpg'),
(12, 'Local Legend', 'Visit 5 breweries in your home city', 'medium', 40, 'travel', '/images/challenge-travel.jpg');

UPDATE beers SET image_url = '/images/beer-ipa.jpg' WHERE id = 1 AND image_url IS NULL;
UPDATE beers SET image_url = '/images/beer-porter.jpg' WHERE id = 2 AND image_url IS NULL;
UPDATE beers SET image_url = '/images/beer-stout.jpg' WHERE id = 3 AND image_url IS NULL;
UPDATE beers SET image_url = '/images/beer-saison.jpg' WHERE id = 4 AND image_url IS NULL;
UPDATE beers SET image_url = '/images/beer-ipa.jpg' WHERE id = 5 AND image_url IS NULL;
UPDATE beers SET image_url = '/images/beer-ipa.jpg' WHERE id = 6 AND image_url IS NULL;
UPDATE beers SET image_url = '/images/beer-stout.jpg' WHERE id = 7 AND image_url IS NULL;
UPDATE beers SET image_url = '/images/beer-farmhouse.jpg' WHERE id = 8 AND image_url IS NULL;
UPDATE beers SET image_url = '/images/beer-pilsner.jpg' WHERE id = 9 AND image_url IS NULL;
UPDATE beers SET image_url = '/images/beer-lager.jpg' WHERE id = 10 AND image_url IS NULL;
UPDATE beers SET image_url = '/images/beer-lager.jpg' WHERE id = 11 AND image_url IS NULL;
UPDATE beers SET image_url = '/images/beer-lager.jpg' WHERE id = 12 AND image_url IS NULL;

UPDATE challenges SET image_url = '/images/challenge-beginner.jpg' WHERE id = 1 AND image_url IS NULL;
UPDATE challenges SET image_url = '/images/challenge-style.jpg' WHERE id = 2 AND image_url IS NULL;
UPDATE challenges SET image_url = '/images/challenge-style.jpg' WHERE id = 3 AND image_url IS NULL;
UPDATE challenges SET image_url = '/images/challenge-style.jpg' WHERE id = 4 AND image_url IS NULL;
UPDATE challenges SET image_url = '/images/challenge-style.jpg' WHERE id = 5 AND image_url IS NULL;
UPDATE challenges SET image_url = '/images/challenge-style.jpg' WHERE id = 6 AND image_url IS NULL;
UPDATE challenges SET image_url = '/images/challenge-barrel.jpg' WHERE id = 7 AND image_url IS NULL;
UPDATE challenges SET image_url = '/images/challenge-social.jpg' WHERE id = 8 AND image_url IS NULL;
UPDATE challenges SET image_url = '/images/challenge-social.jpg' WHERE id = 9 AND image_url IS NULL;
UPDATE challenges SET image_url = '/images/challenge-social.jpg' WHERE id = 10 AND image_url IS NULL;
UPDATE challenges SET image_url = '/images/challenge-travel.jpg' WHERE id = 11 AND image_url IS NULL;
UPDATE challenges SET image_url = '/images/challenge-travel.jpg' WHERE id = 12 AND image_url IS NULL;


-- Ensure every brewery has a correct (brewery) photo. Runs idempotently.
UPDATE breweries SET image_url = '/images/brewery-08.jpg' WHERE id = 1 AND (image_url IS NULL OR image_url = '');
UPDATE breweries SET image_url = '/images/brewery-08.jpg' WHERE id = 2 AND (image_url IS NULL OR image_url = '');
UPDATE breweries SET image_url = '/images/brewery-08.jpg' WHERE id = 3 AND (image_url IS NULL OR image_url = '');
UPDATE breweries SET image_url = '/images/brewery-08.jpg' WHERE id = 4 AND (image_url IS NULL OR image_url = '');
UPDATE breweries SET image_url = '/images/brewery-08.jpg' WHERE id = 5 AND (image_url IS NULL OR image_url = '');
UPDATE breweries SET image_url = '/images/brewery-08.jpg' WHERE id = 6 AND (image_url IS NULL OR image_url = '');
UPDATE breweries SET image_url = '/images/brewery-08.jpg' WHERE id = 7 AND (image_url IS NULL OR image_url = '');
UPDATE breweries SET image_url = '/images/brewery-08.jpg' WHERE id = 8 AND (image_url IS NULL OR image_url = '');
UPDATE breweries SET image_url = '/images/brewery-08.jpg' WHERE id = 9 AND (image_url IS NULL OR image_url = '');
UPDATE breweries SET image_url = '/images/brewery-08.jpg' WHERE id = 10 AND (image_url IS NULL OR image_url = '');
UPDATE breweries SET image_url = '/images/brewery-08.jpg' WHERE id = 11 AND (image_url IS NULL OR image_url = '');
UPDATE breweries SET image_url = '/images/brewery-08.jpg' WHERE id = 12 AND (image_url IS NULL OR image_url = '');
UPDATE breweries SET image_url = '/images/brewery-08.jpg' WHERE id = 13 AND (image_url IS NULL OR image_url = '');
UPDATE breweries SET image_url = '/images/brewery-08.jpg' WHERE id = 14 AND (image_url IS NULL OR image_url = '');
UPDATE breweries SET image_url = '/images/brewery-08.jpg' WHERE id = 15 AND (image_url IS NULL OR image_url = '');
UPDATE breweries SET image_url = '/images/brewery-08.jpg' WHERE id = 16 AND (image_url IS NULL OR image_url = '');
UPDATE breweries SET image_url = '/images/brewery-08.jpg' WHERE id = 17 AND (image_url IS NULL OR image_url = '');
UPDATE breweries SET image_url = '/images/brewery-08.jpg' WHERE id = 18 AND (image_url IS NULL OR image_url = '');
UPDATE breweries SET image_url = '/images/brewery-08.jpg' WHERE id = 19 AND (image_url IS NULL OR image_url = '');
UPDATE breweries SET image_url = '/images/brewery-08.jpg' WHERE id = 20 AND (image_url IS NULL OR image_url = '');
UPDATE breweries SET image_url = '/images/brewery-08.jpg' WHERE id = 21 AND (image_url IS NULL OR image_url = '');
UPDATE breweries SET image_url = '/images/brewery-08.jpg' WHERE id = 22 AND (image_url IS NULL OR image_url = '');
UPDATE breweries SET image_url = '/images/brewery-08.jpg' WHERE id = 23 AND (image_url IS NULL OR image_url = '');
UPDATE breweries SET image_url = '/images/brewery-08.jpg' WHERE id = 24 AND (image_url IS NULL OR image_url = '');
UPDATE breweries SET image_url = '/images/brewery-08.jpg' WHERE id = 25 AND (image_url IS NULL OR image_url = '');
UPDATE breweries SET image_url = '/images/brewery-08.jpg' WHERE id = 26 AND (image_url IS NULL OR image_url = '');
UPDATE breweries SET image_url = '/images/brewery-08.jpg' WHERE id = 27 AND (image_url IS NULL OR image_url = '');
UPDATE breweries SET image_url = '/images/brewery-08.jpg' WHERE id = 28 AND (image_url IS NULL OR image_url = '');
UPDATE breweries SET image_url = '/images/brewery-08.jpg' WHERE id = 29 AND (image_url IS NULL OR image_url = '');
UPDATE breweries SET image_url = '/images/brewery-08.jpg' WHERE id = 30 AND (image_url IS NULL OR image_url = '');
UPDATE breweries SET image_url = '/images/brewery-08.jpg' WHERE id = 31 AND (image_url IS NULL OR image_url = '');
UPDATE breweries SET image_url = '/images/brewery-08.jpg' WHERE id = 32 AND (image_url IS NULL OR image_url = '');
UPDATE breweries SET image_url = '/images/brewery-01.jpg' WHERE id = 33 AND (image_url IS NULL OR image_url = '');
UPDATE breweries SET image_url = '/images/brewery-02.jpg' WHERE id = 34 AND (image_url IS NULL OR image_url = '');
UPDATE breweries SET image_url = '/images/brewery-08.jpg' WHERE id = 35 AND (image_url IS NULL OR image_url = '');
UPDATE breweries SET image_url = '/images/brewery-04.jpg' WHERE id = 36 AND (image_url IS NULL OR image_url = '');
UPDATE breweries SET image_url = '/images/brewery-05.jpg' WHERE id = 37 AND (image_url IS NULL OR image_url = '');
UPDATE breweries SET image_url = '/images/brewery-06.jpg' WHERE id = 38 AND (image_url IS NULL OR image_url = '');
UPDATE breweries SET image_url = '/images/brewery-07.jpg' WHERE id = 39 AND (image_url IS NULL OR image_url = '');
UPDATE breweries SET image_url = '/images/brewery-08.jpg' WHERE id = 40 AND (image_url IS NULL OR image_url = '');