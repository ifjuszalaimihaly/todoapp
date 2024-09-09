# Alap Node.js képfájl
FROM node

# Munkakönyvtár beállítása
WORKDIR /usr/src/app

# Fájlok másolása a konténerbe
COPY . .

# Függőségek telepítése
RUN npm install

# Port kitettsége
EXPOSE 81

# Alkalmazás indítása
CMD ["npm", "run", "serve"]