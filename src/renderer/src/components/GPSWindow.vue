<template id="body">
  <div class="interface">
    <div class="left"></div>
    <div class="center"></div>
    <div class="right">
      <MarkerSidebar @addMarker="addMarkerAtMap" @deleteMarker="deleteMarkerAtMap"></MarkerSidebar>
    </div>
  </div>
  <div id="map" ref="map"></div>
</template>

<script>
import MarkerSidebar from './autonomy/MarkerSidebar.vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'
import axios from 'axios';

export default {
  name: "GPSWindow",
  components: {
    MarkerSidebar
  },
  data() {
    return {
      map: null,
      interval: null,
      allMarkers: [],
      roverMarker: {
        marker: null,
        lat: 0.0,
        lon: 0.0
      },
      tempMarker: null
    }
  },
  unmounted() {
    clearInterval(this.interval)
  },
  mounted() {
    this.map = L.map("map", {
      zoomControl: false,
      attributionControl: false,
      center: L.latLng(0.0, 0.0),
      center: L.latLng(38.4063641, -110.7916091),
      zoom: 20,
    });
    this.map.on('click', (e) => {
      let lat = e.latlng.lat;
      let lon = e.latlng.lng;
      if (this.tempMarker) {
        this.tempMarker.remove();
      }
      this.tempMarker = new L.marker([lat, lon]).addTo(this.map);
      this.tempMarker.bindPopup("<b style='color:black'>" + "Lat: " + lat + "<br>" + "Lon: " + lon + "</b>").openPopup();
      let latInput = document.getElementById("inputLatitude");
      let lonInput = document.getElementById("inputLongitude");
      latInput.value = lat
      lonInput.value = lon
    });
    var layer = L.tileLayer("http://localhost:3000/?z={z}&x={x}&y={y}.png", {}).addTo(this.map);

    /* Add the rover icon to the map */
    var greenIcon = L.icon({
      iconUrl: '../../src/assets/icons/Ozu-Rover-Logo.svg',
      iconSize: [80, 80], // size of the icon,  
    });
    
    let newMarker = new L.marker([this.roverMarker.lat, this.roverMarker.lon], {
      icon: greenIcon
    }).addTo(this.map);

    this.roverMarker.marker = newMarker;

    this.interval = setInterval(() => {
      this.fetchData();
    }, 100);
  },
  methods: {
    addMarkerAtMap(latitude, longitude, _mType, _mID, id) {
      let lat = parseFloat(latitude);
      let lon = parseFloat(longitude);
      let url = "../../src/assets/imgs/"+_mType+".svg";
      var icon = L.icon({
          iconUrl: url,
          iconSize: [55, 55], // size of the icon,
        })
      var newMarker = new L.marker([lat, lon], { icon: icon }).addTo(this.map);
      this.allMarkers.push({
        latitude: lat,
        longitude: lon,
        markerObject: newMarker,
        id: id
      });
    },
    deleteMarkerAtMap(id) {
      for (let i = 0; i < this.allMarkers.length; i++) {
        if (this.allMarkers[i].id === id) {
          this.allMarkers[i].markerObject.remove();
          this.allMarkers.splice(i, 1);
          break;
        }
      }
    },
    fetchData() {
      axios
        .get('http://localhost:4000/data/gps/rover')
        .then(response => {
          let res = response.data;
          console.log(res);
          this.roverMarker.marker.setLatLng(L.latLng(res[0], res[1]));
        })
        .catch(error => {
          console.log(error);
        });
    },
  },
}
</script>


<style scoped>
#body {
  overflow: hidden;
}

#map {
  position: absolute;
  z-index: 1;
  top: 0;
  bottom: 0;
  width: 100vw;
  filter: sepia(100%) hue-rotate(90deg) saturate(100%) brightness(70%) contrast(200%);
}

.interface {
  position: absolute;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  color: white;
  z-index: 100;
  pointer-events: none;
  overflow: hidden;
}

.center {
  width: 100%;
  height: 100%;
  z-index: 100;
}

.right {
  margin: 20px;
  padding-left:1rem;
  height: 60%;
  border-radius: 10px;
  background-color: rgba(50, 117, 53, 0.349);
  background-color: rgba(50,117,53,0.75);
  opacity: 0;
  transition: 1.5s linear;
}
.right:hover {
  opacity: 1;
  transition: 1.5s linear; 
}

.gridContainer {
  padding: none;
  margin: none;
  position: absolute;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
}

.css-ccs {
  --c: 10;
  --cx: 5;
  --cy: 5;
  --dsize: 10;
  --dcolor: #369;
  --size: 100%;
  position: relative;
  width: var(--size);
  height: 0;
  padding-top: var(--size);
  box-sizing: border-box;
  aspect-ratio: 1/1;
  pointer-events: none;
  background-image:
    linear-gradient(#00000000 calc(var(--cy) * 100% / var(--c) - 1px), #00000000 0 calc(var(--cy) * 100% / var(--c) + 1px), transparent 0),
    linear-gradient(to right, #0000 calc(var(--cx) * 100% / var(--c) - 1px), #00000000 0 calc(var(--cx) * 100% / var(--c) + 1px), transparent 0),
    repeating-linear-gradient(rgba(0, 0, 0, 0) 0 0.5px, #0000 0 calc(100% / var(--c) - 2.0px), rgba(0, 0, 0, 0.384) 0 calc(100% / var(--c))),
    repeating-linear-gradient(to right, #0002 0 0.5px, #0000 0 calc(100% / var(--c) - 2.0px), rgba(0, 0, 0, 0.384) 0 calc(100% / var(--c)));
}

.css-ccs.no-overflow {
  overflow: hidden;
}

.css-css .dot {
  --translationUnit: 100% / var(--c);
  --translationX: var(--translationUnit) * var(--cx);
  --translationY: var(--translationUnit) * var(--cy);
  /* Vertical is "flipped" in CSS: higher values go down! Do negative! */
  --y: calc(var(--translationY) - var(--translationUnit) * var(--function));
  width: calc(var(--dsize) * 1px);
  height: calc(var(--dsize) * 1px);
  background: var(--dcolor);
  border-radius: 50%;
  position: absolute;
  transform: translate(-50%, -50%);
  left: calc(var(--translationX) + var(--x) * var(--translationUnit));
  top: var(--y);
}

.marker {
  background-image: url('../assets/cekic.jpeg');
  background-size: cover;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
}
</style>
