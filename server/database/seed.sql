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

INSERT INTO beers (id, brewery_id, name, style, abv, ibu, description) VALUES
(1, 1, 'Fresh Squeezed IPA', 'IPA', 6.5, 65, 'Piney, citrusy IPA with a smooth malt backbone and a lingering dry-hop finish.'),
(2, 1, 'Black Butte Porter', 'Porter', 5.5, 40, 'Rich chocolate and coffee notes with a hint of dark fruit and a creamy mouthfeel.'),
(3, 5, 'Yeti Imperial Stout', 'Stout', 9.5, 60, 'Massive dark stout with roasty malt, chocolate, and a warming alcohol presence.'),
(4, 5, 'Colette Saison', 'Saison', 7.2, 25, 'Farmhouse saison with peppery yeast, citrus peel, and a dry, crisp finish.'),
(5, 9, 'Stone IPA', 'IPA', 6.9, 70, 'Aggressively hopped west coast IPA with pine, resin, and tropical fruit aromatics.'),
(6, 16, 'All Day IPA', 'IPA', 4.7, 50, 'Session IPA that delivers bold hop flavor without the heavy alcohol burden.'),
(7, 16, 'Breakfast Stout', 'Stout', 8.3, 60, 'Oatmeal stout brewed with coffee and chocolate for a rich breakfast-in-a-glass experience.'),
(8, 20, 'Abner', 'Farmhouse Ale', 6.5, 30, 'Dry-hopped farmhouse ale with wild fermentation character and a hazy golden hue.'),
(9, 33, 'Pilsner Urquell', 'Pilsner', 4.4, 35, 'The original pilsner. Crisp, golden lager with Saaz hop bitterness and a bready malt body.'),
(10, 34, 'Budvar Czechvar', 'Lager', 5.0, 35, 'Smooth, balanced Czech lager with dual-hopping for a refined bitter finish.'),
(11, 25, 'Lvivske 1715', 'Lager', 4.8, 28, 'Classic Ukrainian lager with a light golden color, gentle hop bitterness, and a clean finish.'),
(12, 26, 'Obolon Premium', 'Lager', 5.2, 32, 'Ukraine''s flagship lager. Light, refreshing, and easy-drinking with subtle malt sweetness.');

INSERT INTO challenges (id, title, description, difficulty, points, category) VALUES
(1, 'First Sip', 'Visit your first brewery and try a local beer', 'easy', 10, 'beginner'),
(2, 'IPA Explorer', 'Try an IPA at 3 different breweries', 'medium', 25, 'style'),
(3, 'Stout Connoisseur', 'Find and taste a stout or porter', 'medium', 20, 'style'),
(4, 'Saison Adventure', 'Try a farmhouse saison', 'medium', 20, 'style'),
(5, 'Pilsner Purist', 'Drink a classic Czech pilsner', 'easy', 15, 'style'),
(6, 'Sour Pioneer', 'Taste a sour or wild ale', 'medium', 25, 'style'),
(7, 'Barrel Aged Hunter', 'Find a barrel-aged beer', 'hard', 50, 'style'),
(8, 'Trip Planner', 'Create your first brewery road trip', 'easy', 10, 'social'),
(9, 'Social Butterfly', 'Leave a review at 5 different breweries', 'medium', 30, 'social'),
(10, 'Beer Photographer', 'Upload a photo of your beer', 'easy', 15, 'social'),
(11, 'Cross-Country Brewer', 'Visit breweries in 2 different countries', 'hard', 100, 'travel'),
(12, 'Local Legend', 'Visit 5 breweries in your home city', 'medium', 40, 'travel');
