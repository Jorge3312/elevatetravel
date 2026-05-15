# Elevate Travel Platform ✈️🌍

Bienvenido al repositorio oficial de la plataforma **Elevate Travel**, un sistema integral para agencias de viajes diseñado para ofrecer una experiencia visual premium (Dark Mode & Glassmorphism) tanto para los clientes como para los administradores.

## 🚀 Tecnologías Utilizadas

Este proyecto es una aplicación Full-Stack estructurada en un monorepo, dividida en dos partes principales:

### Frontend (Cliente y Backoffice)
*   **Angular 17+** (Standalone Components)
*   **TailwindCSS** (Estilos base y utilidades)
*   **PrimeNG** (Componentes de interfaz como tablas, dropdowns, etc.)
*   **RxJS** (Manejo reactivo del estado)

### Backend (API REST)
*   **NestJS** (Framework progresivo de Node.js)
*   **TypeORM** (ORM para manejo de base de datos)
*   **PostgreSQL** (Motor de base de datos relacional)
*   **JWT** (Autenticación y seguridad de rutas)

## 🌟 Características Principales

1.  **Vista Pública (Catálogo de Clientes):**
    *   **Destinos:** Galería de países y ciudades disponibles.
    *   **Paquetes:** Ofertas de viaje detalladas con itinerario y precios.
    *   **Eventos:** Giras y eventos especiales organizados por la agencia.
    *   **Visas:** Catálogo de asesorías para trámites de visado.
    *   **Integración WhatsApp:** Botones flotantes y llamadas a la acción directas para que los clientes inicien el trámite o la compra vía WhatsApp con mensajes pre-formateados.

2.  **Backoffice (Administración):**
    *   Gestión CRUD completa (Crear, Leer, Actualizar, Eliminar) para todas las entidades (Destinos, Ofertas, Paquetes, Eventos, Visas).
    *   Diseño Dark Mode editorial con componentes modernos.
    *   Sistema seguro de inicio de sesión.
    *   Autocompletado de países, manejo de URLs de imágenes y requerimientos en formato lista.

## ⚙️ Estructura del Proyecto

```text
Elevate_Agape/
├── frontend/       # Aplicación Angular (UI cliente y admin)
├── backend/        # API REST NestJS
└── .gitignore      # Archivos ignorados por Git
```

## 🛠️ Instalación y Ejecución Local

Para levantar el entorno de desarrollo localmente:

### 1. Requisitos Previos
*   [Node.js](https://nodejs.org/) (v18+)
*   [PostgreSQL](https://www.postgresql.org/) y [DBeaver](https://dbeaver.io/) (Opcional, para visualizar datos)

### 2. Levantar el Backend (NestJS)
```bash
cd backend
npm install
# Configura tu archivo .env con las credenciales de tu base de datos
npm run start:dev
```
La API estará corriendo en `http://localhost:3000`.

### 3. Levantar el Frontend (Angular)
En una nueva terminal:
```bash
cd frontend
npm install
npm run start
```
La aplicación estará disponible en `http://localhost:4200`.

## 🎨 Diseño y UI/UX
El frontend ha sido rediseñado meticulosamente para transmitir exclusividad:
*   Tipografías modernas (`Oswald` e `Inter`).
*   Paneles semi-transparentes (Efecto Glassmorphism).
*   Micro-interacciones y animaciones suaves para una navegación inmersiva.

---
*Desarrollado para Elevate Travel Agency.*
