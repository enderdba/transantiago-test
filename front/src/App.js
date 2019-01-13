import React, { Component } from 'react';
import { Icon, Row, Col, Preloader, CollectionItem, Input, Tab, Tabs } from "react-materialize";
import './App.css';
import { Polyline, GoogleMap, LoadScript } from "react-google-maps-api";
import Fetch from './util/Fetch';

class App extends Component {
  constructor(props) {
    super(props);
    this.fetch = new Fetch({ url: "http://localhost:8080/api" });
    this.state = {
      routes: [],
      selectedRoute: 101,
      center: { lat: -30.897, lng: 151.144 },
      scrollPos: 1,
      isLoading: true,
      activeTab: 1,
      favRoutes: [],
      searchQuery: ""
    };
    //inserta el api key aqui
    this.API_KEY = "INSERTE EL API KEY AQUI";
    this.renderRoutes = this.renderRoutes.bind(this);
    this.renderPolylines = this.renderPolylines.bind(this);
    this.setActiveRoute = this.setActiveRoute.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.tabs = React.createRef();
  }


  //renderiza las rutas en la lista, creando componentes dinamicos para la colección despues de obtenerlas del backend
  async renderRoutes() {
    var routes = await this.fetch.getRoutes();
    routes = routes.map(routes => {
      return {
        route_id: routes.route_id,
        component: <CollectionItem className={"left-align " + "route-" + (routes.route_id.toString().replace(" ", "-"))} onClick={() => { this.renderPolylines(routes.route_id) }}>
          {routes.route_short_name}
          <a onClick={() => {
            this.favRoute(routes)
          }} className="secondary-content">
            <Icon>star</Icon>
          </a>
        </CollectionItem>
      }
    });
    this.setState({
      routes: routes,
    });
    this.renderPolylines(this.state.selectedRoute);
  }

  //un dom manipulation para poder mantener seleccionada ambas rutas en ambas listas
  setActiveRoute(elementid) {
    const routeClass = "route-" + this.state.selectedRoute.toString().replace(" ", "-");
    var els = document.getElementsByClassName(routeClass);
    for (let i = 0; i < els.length; i++) {
      const el = els[i];
      el.classList.remove('active')
    }

    var els2 = document.getElementsByClassName("route-" + elementid.toString().replace(" ", "-"));
    for (let i = 0; i < els2.length; i++) {
      const el = els2[i];
      el.classList.add('active')
    }
    document.getElementsByClassName("routeList")[0].scrollTop = this.state.scrollPos;
  }

  //reemplaza las rutas en las listas para re-renderizar la ruta favorita seleccionada. cambiando la clase y el color de la estrella.
  //ademas agrega y remueve segun sea necesario las rutas favoritas dentro del estado
  favRoute(routes) {
    var favRoutes = this.state.favRoutes;
    const routeExists = this.state.favRoutes.filter(fav => fav.route_id === routes.route_id);

    if (routeExists.length > 0) {
      //existe, se remueve
      const spl = favRoutes.findIndex(fav => fav.route_id === routes.route_id);
      const comp = <CollectionItem className={"left-align " + "route-" + (routes.route_id.toString().replace(" ", "-"))} onClick={() => { this.renderPolylines(routes.route_id) }}>
        {routes.route_short_name}
        <a onClick={() => {
          this.favRoute(routes);
        }} className="secondary-content">
          <Icon>star</Icon>
        </a>
      </CollectionItem>
      const item = { route_id: routes.route_id, component: comp };
      var routeList = this.state.routes;
      routeList[routeList.findIndex(i => i.route_id == routes.route_id)] = item;

      favRoutes.splice(spl, 1);
      this.setState({ favRoutes: favRoutes, routes: routeList });
    } else {
      const comp = <CollectionItem className={"faved left-align " + "route-" + (routes.route_id.toString().replace(" ", "-"))} onClick={() => { this.renderPolylines(routes.route_id) }}>
        {routes.route_short_name}
        <a onClick={() => {
          this.favRoute(routes);
        }} className="secondary-content">
          <Icon>star</Icon>
        </a>
      </CollectionItem>
      const item = { route_id: routes.route_id, component: comp };
      favRoutes.push(item);
      var routeList = this.state.routes;
      routeList[routeList.findIndex(i => i.route_id == routes.route_id)] = item;
      this.setState({ favRoutes: favRoutes, routes: routeList });
    }

  }

  //renderiza las lineas default de GoogleMaps dentro del mapa al seleccionar una ruta.
  async renderPolylines(route) {
    this.setState({ selectedRoute: route, isLoading: true, scrollPos: document.getElementsByClassName("routeList")[0].scrollTop });
    const trips = await this.fetch.getTrip(route);
    const shape = trips.map((trip) => {
      const shapes = this.fetch.getPathsFromTrip(trip.shape_id);
      return shapes;
    });
    Promise.all(shape).then(values => {
      var mergedArrays = [];
      values.map(shapeArray => {
        shapeArray.map(sa => {
          mergedArrays.push({ lat: sa.shape_pt_lat, lng: sa.shape_pt_lon })
          return true;
        });
        return true;
      });
      this.setState({
        path: mergedArrays,
        center: mergedArrays[0],
        isLoading: false
      }, () => { this.setActiveRoute(route); })
    });
  }

  //al montar el componente principal, se renderiza la ruta
  componentDidMount() {
    this.renderRoutes();
  }

  //al cambiar la tab, lo hago persistente debido a un bug con el framework visual
  changeActiveTab() {
    this.setState({
      activeTab: this.state.activeTab === 1 ? 2 : 1
    }, () => {
      this.setActiveRoute(this.state.selectedRoute)
    });
  }

  //evento que maneja el cambio de filtro de rutas
  handleChange(e, val) {
    this.setState({
      searchQuery: val
    });
  }

  render() {
    return (
      <div className="container">
        <Row className="center">
          <Col m={4} className='grid-example'>
            <h4>Recorrido <br /> {this.state.selectedRoute}</h4>
            <Row>
              <Input onChange={this.handleChange} placeholder="E.j: 101, 102..." s={12} label="Ruta" />
            </Row>
            <Tabs onChange={() => { this.changeActiveTab() }} className='tabs z-depth-1'>
              <Tab active={this.state.activeTab === 1} ref={this.tabs} title={<Icon>directions_subway</Icon>}>
                <ul className={"routeList collection " + (this.state.isLoading ? "isLoading" : "")}>
                  {this.state.isLoading ? <div className="loading"><div><Preloader size='big' /></div></div> : ""}
                  {this.state.routes.filter(r => r.route_id.toString().includes(this.state.searchQuery)).map(fav => fav.component)}
                </ul>
              </Tab>
              <Tab active={this.state.activeTab === 2} title={<Icon>star</Icon>}>
                <ul className={"routeList collection " + (this.state.isLoading ? "isLoading" : "")}>
                  {this.state.isLoading ? <div className="loading"><div><Preloader size='big' /></div></div> : ""}
                  {this.state.favRoutes.filter(r => r.route_id.toString().includes(this.state.searchQuery)).map(fav => fav.component)}
                </ul>
              </Tab>
            </Tabs>

          </Col>
          <Col m={8} className='grid-example'>
            <LoadScript
              id="script-loader"
              googleMapsApiKey={this.API_KEY}
              language={"en"}
              region={"EN"}
              version={"weekly"}
              loadingElement={<div>Loading...</div>}>

              <GoogleMap
                id="basic-map-example"
                mapContainerStyle={{
                  height: "88vh",
                }}
                zoom={12}
                center={this.state.center}
              >
                <Polyline
                  path={this.state.path}
                />
              </GoogleMap>
            </LoadScript>
          </Col>
        </Row>
      </div>
    );
  }
}

export default App;
