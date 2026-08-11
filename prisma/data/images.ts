/**
 * Curated product image URLs keyed by slugified product name.
 * Replaces random placeholder images with product-relevant photos.
 *
 * `lock` makes LoremFlickr return a deterministic photo per product, so images
 * never silently swap or collapse to the service's generic fallback.
 */
export const productImages: Record<string, string> = {
  bananas: "https://loremflickr.com/600/600/banana?lock=1",
  "gala-apples-3-lb-bag": "https://loremflickr.com/600/600/gala-apples?lock=2",
  "hass-avocados": "https://loremflickr.com/600/600/avocado?lock=3",
  "baby-spinach-5-oz": "https://loremflickr.com/600/600/baby-spinach?lock=4",
  "roma-tomatoes": "https://loremflickr.com/600/600/roma-tomatoes?lock=5",
  "carrots-2-lb-bag": "https://loremflickr.com/600/600/carrots?lock=6",
  "red-onions": "https://loremflickr.com/600/600/red-onions?lock=7",
  "strawberries-1-lb": "https://loremflickr.com/600/600/strawberry?lock=8",
  "broccoli-crowns": "https://loremflickr.com/600/600/broccoli?lock=9",
  lemons: "https://loremflickr.com/600/600/lemons?lock=10",
  "russet-potatoes-5-lb":
    "https://loremflickr.com/600/600/russet-potatoes?lock=11",
  "red-bell-peppers":
    "https://loremflickr.com/600/600/red-bell-peppers?lock=12",
  "large-brown-eggs-dozen":
    "https://loremflickr.com/600/600/brown-eggs?lock=13",
  "whole-milk-1-gal": "https://loremflickr.com/600/600/whole-milk?lock=14",
  "plain-greek-yogurt-32-oz":
    "https://loremflickr.com/600/600/greek-yogurt?lock=15",
  "unsalted-butter-1-lb":
    "https://loremflickr.com/600/600/unsalted-butter?lock=16",
  "sharp-cheddar-8-oz": "https://loremflickr.com/600/600/sharp-cheddar?lock=17",
  "shredded-mozzarella-8-oz":
    "https://loremflickr.com/600/600/shredded-mozzarella?lock=18",
  "cream-cheese-8-oz": "https://loremflickr.com/600/600/cream-cheese?lock=19",
  "half-and-half-1-pt": "https://loremflickr.com/600/600/cream-milk?lock=20",
  "cottage-cheese-24-oz":
    "https://loremflickr.com/600/600/cottage-cheese?lock=21",
  "unsweetened-almond-milk-1-2-gal":
    "https://loremflickr.com/600/600/almond-milk?lock=22",
  "heavy-whipping-cream-1-pt":
    "https://loremflickr.com/600/600/heavy-whipping-cream?lock=23",
  "sourdough-loaf": "https://loremflickr.com/600/600/sourdough-loaf?lock=24",
  "whole-wheat-bread":
    "https://loremflickr.com/600/600/whole-wheat-bread?lock=25",
  "butter-croissants-4-pack":
    "https://loremflickr.com/600/600/butter-croissants?lock=26",
  "bagels-6-pack": "https://loremflickr.com/600/600/bagels?lock=27",
  "flour-tortillas-10":
    "https://loremflickr.com/600/600/flour-tortillas?lock=28",
  "hamburger-buns-8-pack":
    "https://loremflickr.com/600/600/hamburger-buns?lock=29",
  "ciabatta-loaf": "https://loremflickr.com/600/600/ciabatta?lock=30",
  "english-muffins-6-pack":
    "https://loremflickr.com/600/600/english-muffins?lock=31",
  "cinnamon-raisin-bread":
    "https://loremflickr.com/600/600/cinnamon-raisin-bread?lock=32",
  "pita-bread-6-pack": "https://loremflickr.com/600/600/pita-bread?lock=33",
  "boneless-chicken-breast":
    "https://loremflickr.com/600/600/boneless-chicken-breast?lock=34",
  "93-lean-ground-turkey":
    "https://loremflickr.com/600/600/turkey-meat?lock=35",
  "atlantic-salmon-fillets":
    "https://loremflickr.com/600/600/salmon-fish?lock=36",
  "80-20-ground-beef": "https://loremflickr.com/600/600/ground-beef?lock=37",
  "smoked-bacon-12-oz": "https://loremflickr.com/600/600/smoked-bacon?lock=38",
  "jumbo-shrimp-raw": "https://loremflickr.com/600/600/jumbo-shrimp?lock=39",
  "boneless-pork-chops": "https://loremflickr.com/600/600/pork-chop?lock=40",
  "whole-chicken": "https://loremflickr.com/600/600/whole-chicken?lock=41",
  "italian-sausage-19-oz":
    "https://loremflickr.com/600/600/italian-sausage?lock=42",
  "atlantic-cod-fillets": "https://loremflickr.com/600/600/cod-fish?lock=43",
  "oven-roasted-turkey-deli-slices":
    "https://loremflickr.com/600/600/roasted-turkey?lock=44",
  "long-grain-white-rice-2-lb":
    "https://loremflickr.com/600/600/long-grain-white-rice?lock=45",
  "penne-pasta-16-oz": "https://loremflickr.com/600/600/penne-pasta?lock=46",
  "extra-virgin-olive-oil-500-ml":
    "https://loremflickr.com/600/600/extra-virgin-olive-oil?lock=47",
  "quinoa-16-oz": "https://loremflickr.com/600/600/quinoa-seeds?lock=48",
  "creamy-peanut-butter-16-oz":
    "https://loremflickr.com/600/600/creamy-peanut-butter?lock=49",
  "diced-fire-roasted-tomatoes":
    "https://loremflickr.com/600/600/fire-roasted-tomatoes?lock=50",
  "black-beans-15-oz": "https://loremflickr.com/600/600/black-beans?lock=51",
  "chicken-broth-32-oz":
    "https://loremflickr.com/600/600/chicken-broth?lock=52",
  "rolled-oats-18-oz": "https://loremflickr.com/600/600/rolled-oats?lock=53",
  "raw-honey-12-oz": "https://loremflickr.com/600/600/honey?lock=54",
  "roasted-salsa-roja-16-oz":
    "https://loremflickr.com/600/600/salsa-verde?lock=55",
  "cold-brew-coffee-32-oz":
    "https://loremflickr.com/600/600/cold-brew-coffee?lock=56",
  "orange-juice-52-oz":
    "https://loremflickr.com/600/600/fresh-orange-juice?lock=57",
  "sparkling-water-lime-12-pack":
    "https://loremflickr.com/600/600/mineral-water?lock=58",
  "green-tea-12-pack": "https://loremflickr.com/600/600/green-tea?lock=59",
  "organic-apple-juice-64-oz":
    "https://loremflickr.com/600/600/apple-juice?lock=60",
  "coconut-water-33-8-oz":
    "https://loremflickr.com/600/600/coconut-water?lock=61",
  "ginger-kombucha-16-oz": "https://loremflickr.com/600/600/ginger-tea?lock=62",
  "whole-milk-kefir-32-oz":
    "https://loremflickr.com/600/600/fermented-milk?lock=63",
  "ceremonial-matcha-1-oz":
    "https://loremflickr.com/600/600/matcha-powder?lock=64",
  "whole-bean-coffee-12-oz":
    "https://loremflickr.com/600/600/whole-bean-coffee?lock=65",
  "salted-almonds-16-oz":
    "https://loremflickr.com/600/600/roasted-almonds?lock=66",
  "dark-chocolate-70-3-5-oz":
    "https://loremflickr.com/600/600/chocolate?lock=67",
  "sea-salt-potato-chips-8-oz":
    "https://loremflickr.com/600/600/potato-crisps?lock=68",
  "granola-bars-variety-12-pack":
    "https://loremflickr.com/600/600/granola-bar?lock=69",
  "trail-mix-14-oz": "https://loremflickr.com/600/600/trail-mix?lock=70",
  "classic-hummus-10-oz":
    "https://loremflickr.com/600/600/chickpea-hummus?lock=71",
  "sourdough-pretzel-sticks-12-oz":
    "https://loremflickr.com/600/600/pretzel-sticks?lock=72",
  "veggie-straws-6-oz": "https://loremflickr.com/600/600/veggie-straws?lock=73",
  "greek-yogurt-covered-pretzels-6-oz":
    "https://loremflickr.com/600/600/yogurt-pretzels?lock=74",
  "cinnamon-rice-cakes-10-pack":
    "https://loremflickr.com/600/600/rice-cake?lock=75",
  "frozen-mixed-berries-2-lb":
    "https://loremflickr.com/600/600/mixed-berries?lock=76",
  "frozen-peas-1-lb": "https://loremflickr.com/600/600/frozen-peas?lock=77",
  "frozen-shelled-edamame-16-oz":
    "https://loremflickr.com/600/600/edamame?lock=78",
  "vanilla-bean-ice-cream-1-5-qt":
    "https://loremflickr.com/600/600/vanilla-bean-ice-cream?lock=79",
  "frozen-chopped-spinach-10-oz":
    "https://loremflickr.com/600/600/frozen-spinach?lock=80",
  "four-cheese-pizza-24-oz":
    "https://loremflickr.com/600/600/four-cheese-pizza?lock=81",
  "frozen-sweet-corn-1-lb":
    "https://loremflickr.com/600/600/sweet-corn?lock=82",
  "crispy-chicken-nuggets-32-oz":
    "https://loremflickr.com/600/600/chicken-nugget?lock=83",
  "buttermilk-waffles-10-pack":
    "https://loremflickr.com/600/600/buttermilk-waffles?lock=84",
  "frozen-broccoli-florets-12-oz":
    "https://loremflickr.com/600/600/green-vegetables?lock=85",
}
