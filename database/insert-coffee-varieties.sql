-- Script para insertar variedades de café en la base de datos
-- Ejecuta este script en el SQL Editor de Supabase

-- Primero, elimina las variedades no relacionadas con café si existen
DELETE FROM crop_varieties 
WHERE variety_type NOT ILIKE '%café%' 
AND variety_type NOT ILIKE '%coffee%'
AND name NOT ILIKE '%café%' 
AND name NOT ILIKE '%coffee%';

-- Inserta variedades de café comunes
INSERT INTO crop_varieties (name, variety_type, description, optimal_temperature_min, optimal_temperature_max, optimal_humidity_min, optimal_humidity_max, optimal_ph_min, optimal_ph_max, growth_days)
VALUES 
  ('Café Arábica', 'Coffea arabica', 'Variedad de café arábica de alta calidad, ideal para altitudes medias y altas', 18.0, 24.0, 60.0, 80.0, 6.0, 6.5, 270),
  ('Café Robusta', 'Coffea canephora', 'Variedad resistente con mayor contenido de cafeína, ideal para climas cálidos', 22.0, 30.0, 70.0, 90.0, 6.0, 6.5, 240),
  ('Café Caturra', 'Coffea arabica var. caturra', 'Variedad compacta de arábica, productiva y de buen sabor', 18.0, 24.0, 60.0, 80.0, 6.0, 6.5, 270),
  ('Café Bourbon', 'Coffea arabica var. bourbon', 'Variedad tradicional de excelente calidad y sabor', 18.0, 24.0, 60.0, 80.0, 6.0, 6.5, 270),
  ('Café Castillo', 'Coffea arabica var. castillo', 'Variedad colombiana resistente a la roya del café', 18.0, 24.0, 60.0, 80.0, 6.0, 6.5, 270),
  ('Café Typica', 'Coffea arabica var. typica', 'Variedad clásica de alta calidad, base de muchas otras variedades', 18.0, 24.0, 60.0, 80.0, 6.0, 6.5, 270),
  ('Café Colombia', 'Coffea arabica var. colombia', 'Variedad colombiana resistente a enfermedades', 18.0, 24.0, 60.0, 80.0, 6.0, 6.5, 270),
  ('Café Geisha', 'Coffea arabica var. geisha', 'Variedad premium de sabor excepcional y alta calidad', 18.0, 24.0, 60.0, 80.0, 6.0, 6.5, 270)
ON CONFLICT DO NOTHING;

-- Verifica las variedades insertadas
SELECT * FROM crop_varieties WHERE variety_type ILIKE '%café%' OR variety_type ILIKE '%coffee%' OR name ILIKE '%café%' OR name ILIKE '%coffee%' ORDER BY name;
