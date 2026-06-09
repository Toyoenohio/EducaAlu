# 🎓 EDUCA - Portal Estudiantil

El **Portal Estudiantil EDUCA** es una plataforma moderna construida para los estudiantes de la academia, diseñada para ofrecer una experiencia rápida, intuitiva y responsive. Permite a los alumnos gestionar y revisar toda su actividad académica y administrativa desde un solo lugar.

Este proyecto fue generado con Vite y React, estilizado con Tailwind CSS bajo el *Design System oficial de EDUCA*, y conectado a Supabase para la base de datos y autenticación.

---

## ✨ Características Principales

*   **Dashboard Resumen**: Vista general inmediata con estadísticas (cursos activos, pagos pendientes, % de asistencia) y agenda del día actual.
*   **Mi Perfil**: Visualización de los datos personales del estudiante.
*   **Mis Cursos**:
    *   **Cursos Activos**: Información detallada de las secciones en curso (horarios, profesores, sedes).
    *   **Historial**: Registro de cursos completados, retirados o suspendidos.
    *   **Certificados**: Descarga de certificados para cursos completados (bloqueados mientras estén en progreso).
*   **Mis Pagos**: 
    *   **Pendientes**: Alertas de cuotas por vencer o vencidas, con cálculo del total adeudado.
    *   **Historial**: Registro detallado de los pagos procesados y sus métodos de pago.
*   **Asistencia y Notas**: 
    *   Resumen porcentual de asistencia por curso mediante barras de progreso dinámicas.
    *   Registro detallado (presente, ausente, tardanza, justificada).

---

## 🛠️ Stack Tecnológico

*   **Frontend**: React 18, Vite
*   **Enrutamiento**: React Router v6
*   **Estilos**: Tailwind CSS v3 (Design System personalizado)
*   **Iconografía**: Lucide React
*   **Backend / Auth / BD**: Supabase (PostgreSQL, Row Level Security, Triggers, Edge Functions)

---

## 🚀 Instalación y Desarrollo Local

### 1. Clonar el repositorio
```bash
git clone https://github.com/Toyoenohio/EducaAlu.git
cd EducaAlu
```

### 2. Instalar dependencias
Asegúrate de tener Node.js instalado, luego ejecuta:
```bash
npm install
```

### 3. Configurar Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto basándote en el archivo de ejemplo o usando las siguientes variables:
```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
```

### 4. Iniciar el Servidor de Desarrollo
```bash
npm run dev
```
El proyecto estará disponible localmente en `http://localhost:5173/` (o en el puerto indicado en la consola).

---

## 🔐 Autenticación y Base de Datos

El sistema utiliza **Supabase Auth** en combinación con una tabla de `alumnos`. 

1.  El Administrador registra al alumno desde el panel de control (`educa-admin`).
2.  Un Trigger en PostgreSQL captura el alta y hace uso de `pg_net` (Edge HTTP) para crear de forma automatizada un usuario en *Supabase Auth*.
3.  El usuario Auth se genera con la contraseña por defecto (Cédula de Identidad del alumno) y se enlaza mediante `alumno_id` en sus metadatos.
4.  El estudiante inicia sesión con su Email y su Cédula, accediendo únicamente a su información personal gracias a las políticas de seguridad (RLS).

---

## 🏗️ Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables clasificados por módulo
│   ├── Cursos/          # Cards de cursos, historial y certificados
│   ├── Dashboard/       # Widgets del dashboard principal
│   ├── Layout/          # Estructura principal: Sidebar, Navbar
│   ├── Pagos/           # Listas de deudas y pagos completados
│   └── Perfil/          # Ficha de estudiante
├── contexts/            # Contextos globales (AuthContext)
├── hooks/               # Custom hooks (Queries a Supabase)
├── lib/                 # Configuración de librerías de terceros (Supabase Client)
├── pages/               # Vistas principales de la aplicación
└── index.css            # Archivo CSS global (Directivas Tailwind)
```

---

## 🎨 Diseño y UI/UX

El frontend implementa el **Design System EDUCA** usando la directiva de colores y tipografías personalizadas en `tailwind.config.js`:
*   **Tipografía**: *Montserrat* para encabezados y cuerpo; *Plus Jakarta Sans* para etiquetas y botones.
*   **Componentes UI**: Botones responsivos con *glassmorphism*, micro-animaciones (fade-in, transiciones) y colores semánticos para los diferentes estados del alumno (activos, deudas, certificados).

---

*Desarrollado para el sistema educativo EDUCA.*
