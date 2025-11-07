FROM php:8.4-cli-alpine

WORKDIR /app

# Install bash, curl, and network tools
RUN apk add --no-cache bash curl iputils

# Copy composer files
COPY composer.json composer.lock ./

# Install composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Install dependencies
RUN composer install --no-dev --optimize-autoloader

# Copy application code
COPY src/ ./src/

EXPOSE 8080

CMD ["php", "-S", "0.0.0.0:8080", "-t", "src"]
