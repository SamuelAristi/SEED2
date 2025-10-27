-- Script para insertar una ubicación de ejemplo para el usuario actual
-- Ejecuta esto en Supabase SQL Editor para crear una ubicación que puedas usar

-- Primero, verifica tu user_id ejecutando:
-- SELECT id, email, name FROM users WHERE email = 'tu_email@ejemplo.com';

-- Luego reemplaza 'TU_USER_ID_AQUI' con tu ID real y ejecuta:

INSERT INTO locations (name, location_type, description, address, user_id)
VALUES 
  ('Invernadero Principal', 'greenhouse', 'Invernadero principal para cultivos de café', 'Zona A - Finca', 'TU_USER_ID_AQUI'),
  ('Campo Exterior', 'field', 'Campo abierto para cultivo extensivo', 'Zona B - Finca', 'TU_USER_ID_AQUI'),
  ('Vivero', 'nursery', 'Área de germinación y plántulas', 'Zona C - Finca', 'TU_USER_ID_AQUI')
RETURNING *;

-- Verifica que se crearon correctamente:
-- SELECT * FROM locations WHERE user_id = 'TU_USER_ID_AQUI';
