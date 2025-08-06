# Aranto Infomed Project

Este repositorio contiene el sistema **Aranto Infomed**, una plataforma basada en Laravel 12, preparada para funcionar en un entorno Dockerizado con MySQL, Redis y PhpMyAdmin, además de estar configurada para CI/CD con GitHub Actions.

---

## 📦 Estructura del Proyecto
```
aranto_infomed_project/
├── aranto_infomed/ # Proyecto Laravel 12
│ ├── app/
│ ├── config/
│ ├── database/
│ ├── public/
│ ├── .env.example
│ └── .github/ # GitHub Actions (CI/CD)
├── docker-compose.yml # Orquestación de servicios
├── Dockerfile # Imagen personalizada (opcional)
├── .gitignore # Ignora archivos sensibles y compilados
└── README.md
```

---

## 🚀 Requisitos

- Docker
- Docker Compose
- Node.js (si vas a usar frontend con Vite)
- Composer

---

## ⚙️ Variables de Entorno

Crear un archivo `.env` en la raíz (para Docker) con las siguientes variables:

MYSQL_DATABASE=aranto-infomed
MYSQL_ROOT_PASSWORD=
MYSQL_PASSWORD=
MYSQL_USER=


Y dentro de `aranto_infomed/.env` usá:

DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=${MYSQL_DATABASE}
DB_USERNAME=${MYSQL_USER}
DB_PASSWORD=${MYSQL_PASSWORD}


> ⚠️ Asegurate de **no subir archivos `.env`** al repositorio. Ya están ignorados en `.gitignore`.

---

## 🐳 Comandos Docker

```bash
# Construir y levantar servicios
docker-compose up --build -d

# Ver logs de un contenedor
docker-compose logs -f web

# Ejecutar comandos dentro del contenedor Laravel
docker-compose exec web bash

⚡ CI/CD con GitHub Actions
Las acciones se encuentran en aranto_infomed/.github/workflows/

Puedes personalizar el flujo de despliegue o pruebas desde allí.

🧪 Seeders
Este proyecto incluye migración de usuarios legacy desde JSON. Para ejecutarlo:

bash
Copiar
Editar
docker-compose exec web php artisan migrate:fresh --seed
👤 Autor
Edson Sánchez
📧 edsonnaza@gmail.com

