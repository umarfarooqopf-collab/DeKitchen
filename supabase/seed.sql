-- =======================================================
-- De Kitchen Restaurant (Peshawar) - Supabase Seed Data
-- Cuisines: Chinese, Italian, Continental, BBQ
-- =======================================================

INSERT INTO menu_items (id, name, category, price, description, image, badge, in_stock, rating, reviews_count, prep_time, calories, variations, add_ons)
VALUES
-- Live Charcoal BBQ
('bbq-1', 'Charcoal Chicken Tikka Boti', 'bbq', 8.99,
 'Tender boneless chicken cubes marinated in house ground spices, skewered and roasted over live glowing charcoal embers. Served with mint raita and fresh tandoori naan.',
 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80',
 'Charcoal BBQ 🔥', true, 4.9, 380, '20-25 min', '520 kcal',
 '[{"name": "Portion", "options": [{"label": "Single Plate (8 pcs)", "priceDelta": 0}, {"label": "Family Platter (16 pcs)", "priceDelta": 7.50}]}]'::jsonb,
 '[{"id": "bbq_n1", "name": "Extra Roghani Naan", "price": 1.00}, {"id": "bbq_r1", "name": "Mint Coriander Raita", "price": 0.80}, {"id": "bbq_s1", "name": "Fresh Garden Salad", "price": 1.00}]'::jsonb),

('bbq-2', 'Smoky Beef Seekh Kebabs', 'bbq', 9.49,
 'Traditional spiced minced beef skewers blended with green chilies, coriander, and royal aromatic spices, char-grilled to juicy tenderness.',
 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80',
 'Chef Special', true, 4.9, 290, '18-22 min', '580 kcal',
 '[]'::jsonb,
 '[{"id": "k1", "name": "Garlic Butter Naan", "price": 1.20}, {"id": "k2", "name": "Spicy Tamarind Chutney", "price": 0.70}]'::jsonb),

-- Chinese
('chinese-1', 'Classic Chicken Chow Mein', 'chinese', 7.99,
 'Wok-tossed hand-pulled egg noodles with julienned chicken breast, bell peppers, crunchy cabbage, and dark soy garlic reduction.',
 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80',
 'Wok Fresh', true, 4.8, 310, '15-18 min', '490 kcal',
 '[{"name": "Spice Level", "options": [{"label": "Mild / Authentic", "priceDelta": 0}, {"label": "Extra Spicy Sichuan", "priceDelta": 0.50}]}]'::jsonb,
 '[{"id": "ch1", "name": "Extra Chicken Strips", "price": 2.00}, {"id": "ch2", "name": "Crispy Spring Rolls (2 pcs)", "price": 2.50}]'::jsonb),

('chinese-2', 'Kung Pao Chicken with Fried Rice', 'chinese', 9.99,
 'Tender diced chicken breast stir-fried with roasted peanuts, dried red chili peppers, zucchini, in a savory-sweet glaze served alongside fragrant egg fried rice.',
 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=600&q=80',
 'Signature Chinese', true, 4.9, 240, '18-20 min', '670 kcal',
 '[]'::jsonb,
 '[{"id": "kp1", "name": "Add Prawn Tempura (2 pcs)", "price": 3.50}, {"id": "kp2", "name": "Extra Steamed Jasmine Rice", "price": 1.50}]'::jsonb),

-- Continental
('continental-1', 'Grilled Chicken Steak in Mushroom Sauce', 'continental', 11.99,
 'Char-grilled butterfly chicken breast fillets smothered in a velvety wild mushroom and cracked black pepper cream sauce, served with buttery mashed potatoes and sauteed vegetables.',
 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
 'Continental Gourmet', true, 5.0, 350, '20-25 min', '710 kcal',
 '[{"name": "Side Choice", "options": [{"label": "Creamy Mashed Potatoes", "priceDelta": 0}, {"label": "Crispy Golden French Fries", "priceDelta": 0}, {"label": "Herb Rice Pilaf", "priceDelta": 0}]}]'::jsonb,
 '[{"id": "st1", "name": "Extra Creamy Mushroom Sauce", "price": 1.50}, {"id": "st2", "name": "Grilled Jumbo Prawn (1 pc)", "price": 3.00}]'::jsonb),

-- Italian
('italian-1', 'Creamy Fettuccine Alfredo', 'italian', 10.49,
 'Silky fettuccine ribbons tossed in a rich sauce of heavy cream, aged Parmigiano-Reggiano, and garlic butter, topped with grilled chicken strips.',
 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=600&q=80',
 'Artisan Italian', true, 4.8, 220, '18-20 min', '690 kcal',
 '[]'::jsonb,
 '[{"id": "it1", "name": "Extra Shaved Parmesan", "price": 1.50}, {"id": "it2", "name": "Garlic Bread Slices (2 pcs)", "price": 1.80}]'::jsonb),

('pizza-1', 'Cheesy Pepperoni Supreme', 'italian', 12.99,
 'Hand-stretched sourdough crust, San Marzano tomato sauce, double artisan pepperoni, and melted whole milk mozzarella.',
 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
 'Popular Italian', true, 4.9, 410, '20-25 min', '850 kcal',
 '[{"name": "Crust Style", "options": [{"label": "Classic Thin & Crispy (12 inch)", "priceDelta": 0}, {"label": "Stuffed Cheese Crust (12 inch)", "priceDelta": 2.50}, {"label": "Family Size (16 inch)", "priceDelta": 5.00}]}]'::jsonb,
 '[{"id": "p1", "name": "Extra Mozzarella", "price": 2.00}, {"id": "p2", "name": "Hot Honey Drizzle", "price": 1.50}]'::jsonb),

-- Burgers
('burger-1', 'De Classic Angus Burger', 'burgers', 8.99, 
 'Gourmet smashed beef patty, aged sharp cheddar, caramelized onions, house secret sauce, and crisp lettuce on toasted brioche.',
 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
 'Bestseller', true, 4.9, 320, '15-20 min', '680 kcal',
 '[{"name": "Patty", "options": [{"label": "Single Patty (180g)", "priceDelta": 0}, {"label": "Double Patty (360g)", "priceDelta": 3.00}]}]'::jsonb,
 '[{"id": "c1", "name": "Extra Aged Cheddar", "price": 1.20}, {"id": "c2", "name": "Crispy Beef Bacon", "price": 1.80}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    price = EXCLUDED.price,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    badge = EXCLUDED.badge,
    variations = EXCLUDED.variations,
    add_ons = EXCLUDED.add_ons;
