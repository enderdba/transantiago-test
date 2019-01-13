## Prueba Ender Bohórquez para Transit

Se utilizó como base para el front Create React App (como boilerplate).

### Cómo ejecutar el programa? 

Debes montar el back antes de correr el front, para ello, debes ir a la carpeta "back", instalar dependencias y correr el programa:

```
cd back
npm install
npm run start
```

Verás un mensaje en consola que te permitirá saber el enlace donde está corriendo el sencillo backend.

Luego, montar el front para ejecutar el programa y visualizarlo en el navegador:

```
cd front
npm install
npm run start
```

<h1>IMPORTANTE<h1>
Debe cambiar el API KEY del Google Map para que funcione correctamente dentro del componente App.js, en la linea 22:

```javascript
    this.API_KEY = "INSERTE EL API KEY AQUI";
```

### Algunas dependencias

Se utilizo CORS para las Cross Origins Requests (incluso en localhost puede llegar a suceder) en el server de Node.
Se utilizó un boilerplate para configurar un servidor de Node de manera rápida y sencilla.
Se utilizó react-materialize como dependencia para el uso del framework de CSS y algunos de sus útiles componentes.
Se utilizó una versión especial de react-google-maps que permitía la carga correcta del mapa sin mayor problema alguno.
Se utilizó axios para la conexión con el backend.
<b>NOTA:<b> En el caso de que el backend esté configurado en otro puerto, cambiarlo en la linea 10 de App.js

```javascript
    this.fetch = new Fetch({ url: "http://localhost:8080/api" });
```
