# ConectaPro

ConectaPro es una Progressive Web App (PWA) de tipo marketplace de servicios (inspirada en Workana y Uber) diseñada especialmente para Venezuela. Conecta de forma rápida, segura y confiable a personas que necesitan un servicio con profesionales calificados, mediante un sistema de créditos prepago, chat interno y reputación.

## Stack Tecnológico

- **Frontend:** Next.js 14 (App Router) + React 18 + TypeScript (modo estricto)
- **Estilos:** Tailwind CSS
- **BaaS (Backend):** Supabase (Auth, PostgreSQL, Storage, Realtime)
- **Estado Global:** Zustand (estado de UI global)
- **Componentes / Iconos:** Lucide React

## Estructura del Proyecto

```
conectapro/
├── src/
│   ├── app/             # Rutas de Next.js App Router (grupos de rutas por rol)
│   ├── features/        # Módulos funcionales independientes (auth, ordenes, chat, wallet, etc.)
│   ├── components/      # Componentes UI compartidos y atómicos
│   ├── lib/             # Cliente de Supabase y constantes
│   ├── types/           # Definiciones de tipo globales de TypeScript
│   └── hooks/           # Hooks personalizados de React globales
├── docs/                # Documentación del proyecto (bitácora de cambios, decisiones)
├── supabase/            # Migraciones de base de datos
├── public/              # Assets estáticos y PWA manifest
└── .env.local.example   # Plantilla de variables de entorno
```

## Configuración y Ejecución Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/luiggiberaldi/CONECTAPRO.git
   cd conectapro
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   Copia el archivo de plantilla a tu entorno local:
   ```bash
   cp .env.local.example .env.local
   ```
   Abre `.env.local` y rellena las credenciales con tu instancia de Supabase.

4. **Levantar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

5. **Compilar y validar tipos:**
   ```bash
   npm run build
   npx tsc --noEmit
   ```
