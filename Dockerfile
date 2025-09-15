FROM node:22-alpine

WORKDIR /usr/src/app

# Copiar package.json y package-lock.json
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependencias
RUN npm install

# Generar cliente de Prisma
RUN npx prisma generate

# Copiar el resto del código
COPY . .

# Construir la app
RUN npm run build

# Aplicar migraciones en producción
#RUN npx prisma migrate deploy

EXPOSE 3000

CMD ["npm", "run", "start:prod"]