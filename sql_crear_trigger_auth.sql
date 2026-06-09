-- ==========================================
-- TRIGGER: Auto-crear usuario Auth al insertar alumno
-- Ejecuta este SQL en el SQL Editor de Supabase
-- ==========================================

-- PASO 1: Habilitar la extensión pg_net (permite hacer HTTP requests desde SQL)
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- PASO 2: Crear la función que el trigger llamará
-- IMPORTANTE: Reemplaza 'TU_SERVICE_ROLE_KEY_AQUI' con tu service_role key real
-- La encuentras en: Dashboard > Project Settings > API > service_role (key roja)

CREATE OR REPLACE FUNCTION public.crear_auth_user_para_alumno()
RETURNS TRIGGER AS $$
DECLARE
  project_url TEXT := 'https://ibvcuaagaihogadfhhdt.supabase.co';
  service_role_key TEXT := 'TU_SERVICE_ROLE_KEY_AQUI'; -- ⚠️ REEMPLAZAR CON TU KEY REAL
  request_id BIGINT;
BEGIN
  -- Solo ejecutar si el alumno tiene email
  IF NEW.email IS NOT NULL AND NEW.email != '' THEN
    -- Llamada HTTP a la Auth Admin API para crear el usuario
    SELECT net.http_post(
      url := project_url || '/auth/v1/admin/users',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'apikey', service_role_key,
        'Authorization', 'Bearer ' || service_role_key
      ),
      body := jsonb_build_object(
        'email', NEW.email,
        'password', COALESCE(NEW.cedula, 'educa2026'), -- Password inicial = cédula del alumno
        'email_confirm', true, -- Confirmar email automáticamente
        'user_metadata', jsonb_build_object(
          'role', 'estudiante',
          'alumno_id', NEW.id,
          'nombre', COALESCE(NEW.nombre, '') || ' ' || COALESCE(NEW.apellido, '')
        )
      )
    ) INTO request_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PASO 3: Crear el trigger en la tabla alumnos
DROP TRIGGER IF EXISTS on_alumno_created ON public.alumnos;

CREATE TRIGGER on_alumno_created
  AFTER INSERT ON public.alumnos
  FOR EACH ROW
  EXECUTE FUNCTION public.crear_auth_user_para_alumno();

-- ==========================================
-- NOTAS IMPORTANTES:
-- ==========================================
-- 
-- 1. CONTRASEÑA INICIAL: 
--    Se usa la CÉDULA del alumno como contraseña inicial.
--    El alumno debe cambiarla al primer login (puedes agregar esa lógica después).
--    Si prefieres otro password por defecto, modifica la línea:
--    'password', COALESCE(NEW.cedula, 'educa2026')
--
-- 2. FLUJO:
--    Admin crea alumno (nombre, email, cédula, etc.)
--    → Trigger se dispara automáticamente
--    → Se crea usuario en Supabase Auth con:
--       - Email: el email del alumno
--       - Password: la cédula del alumno
--       - Metadata: { role: "estudiante", alumno_id: "uuid", nombre: "..." }
--    → El estudiante puede iniciar sesión en el portal con su email + cédula
--
-- 3. SEGURIDAD:
--    - La function usa SECURITY DEFINER para ejecutar con permisos elevados
--    - La service_role_key está en la función (solo accesible desde el servidor)
--    - pg_net ejecuta las requests de forma asíncrona (no bloquea el INSERT)
--
-- 4. PARA PROBAR:
--    Inserta un alumno de prueba desde el admin o desde SQL:
--
--    INSERT INTO alumnos (cedula, nombre, apellido, email, telefono)
--    VALUES ('V-99999999', 'Test', 'Estudiante', 'test@ejemplo.com', '0412-0000000');
--
--    Luego intenta hacer login en el portal estudiantil con:
--    Email: test@ejemplo.com
--    Password: V-99999999
--
-- 5. VERIFICAR QUE FUNCIONÓ:
--    SELECT * FROM auth.users WHERE email = 'test@ejemplo.com';
--    Deberías ver el usuario con raw_user_meta_data conteniendo alumno_id y role.
