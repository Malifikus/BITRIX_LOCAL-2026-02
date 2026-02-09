FROM php:8.2-apache

# Установка системных зависимостей
RUN apt-get update && apt-get install -y \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libpng-dev \
    libzip-dev \
    zlib1g-dev \
    libonig-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install mysqli pdo_mysql gd zip opcache \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Включить mod_rewrite
RUN a2enmod rewrite
