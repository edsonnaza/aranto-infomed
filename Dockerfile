FROM php:8.2-fpm

# Set timezone and env vars
ENV TZ=America/Asuncion
ENV DEBIAN_FRONTEND=noninteractive

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    zip \
    unzip \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    libcurl4-openssl-dev \
    pkg-config \
    libssl-dev \
    libpq-dev \
    && docker-php-ext-install pdo pdo_mysql mbstring zip exif pcntl bcmath

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Permissions (optional, Laravel specific)
RUN chown -R www-data:www-data /var/www/html

# Expose PHP-FPM port (optional, not used directly when using Nginx)
EXPOSE 9000

CMD ["php-fpm"]
