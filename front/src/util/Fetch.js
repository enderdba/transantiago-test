import axios from 'axios';
// Modulo que se encarga de la conexión sencilla con el back


export default class Fetch {
    constructor(params) {
        this.url = params.url;
    }

    //obtiene todas las rutas y su nombre corto.
    getRoutes() {
        return new Promise((ok, error) => {
            axios.get(this.url + `/allRoutes`)
                .then(function (response) {
                    //console.log(response);
                    ok(response.data);
                })
                .catch(function (err) {
                    console.error(error);
                    error(error);
                })
        })
    }

    //obtiene todas los viajes para construir un path
    getTrip(routeId) {
        return new Promise((ok, error) => {
            axios.get(this.url + `/getTrip/${routeId}`)
                .then(function (response) {
                    ok(response.data);
                   // console.log(response);
                })
                .catch(function (err) {
                    console.error(err);
                    error(err);
                });
        });
    }

    //obtiene todos los paths (coordenadas) para construir el camino en el mapa. 
    getPathsFromTrip(shapeId) {
        return new Promise((ok, error) => {
            axios.get(this.url + `/getPath/${shapeId}`)
                .then(function (response) {
                    //console.log(response);
                    ok(response.data);
                })
                .catch(function (err) {
                    console.error(err);
                    error(err);
                });
        });
    }
}
