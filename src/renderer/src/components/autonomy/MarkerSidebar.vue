<script>
import MarkerDictionary from './Types.js';
import MarkerIcon from './MarkerIcon.vue';

export default {
  data() {
    return {
      flaskBackendUrl: "http://127.0.0.1:4000/goal/", // URI for Back-end
      dictionary: new MarkerDictionary(),
      markerTypes: [
        { type: "Hammer" },
        { type: "Bottle" },
        { type: "ArUCO" }
      ],
      selected: "Hammer",
      markers: [],
      marker: {
        type: undefined,
        latitude: undefined,
        longitude: undefined,
        markerID: undefined,
        id: undefined
      },
      center: [-110.7916091, 38.4063641],
      markerURL: null,
    }
  },
  components: {
    MarkerIcon
  },
  methods: {
    check(type){
      if (type == "ArUCO") {
        return true;
      } else {
        return false;
      }
    },
    addMarker() {
      let latitude = document.getElementById("inputLatitude").value;
      let longitude = document.getElementById("inputLongitude").value;
      let markerType = document.getElementById("markerType").value;
      let markerID = undefined;
      let id = this.generateID();
      let idDisplay=this.check(markerType);
      if (this.hasAdditionalOptions()) {
        markerID = document.getElementById("markerID").value;
      }
      let marker = {
        latitude: latitude,
        longitude: longitude,
        markerType: markerType,
        markerID: markerID,
        markerURL: "../../../src/assets/imgs/" + markerType + ".svg",
        idDisplay:idDisplay,
        id: id
      };

      this.markers.push(marker);
      this.$emit("addMarker", latitude, longitude, markerType, markerID, id);
    },
    deleteMarker(marker) {
      this.markers.splice(this.markers.indexOf(marker), 1);
      this.$emit("deleteMarker", marker.id);
    },
    sendMarker(mark) {
      this.marker.gps[0] = mark.latitude;
      this.marker.gps[1] = mark.longitude;
      this.marker.type = this.dictionary.getID(mark.markerType);
      axios.post(this.flaskBackendUrl + "enqueue", this.marker).then((response) => {
        console.log("Successful", response);
      }).catch((error) => {
        console.log("Error :", error);
      });
    },
    abortButton() {
      this.marker.gps[0] = mark.latitude;
      this.marker.gps[1] = mark.longitude;
      this.marker.type = mark.markerType;
      console.log(this.marker);
      axios.post(this.flaskBackendUrl + "abort", this.marker).then((response) => {
        console.log("Successful", response);
      }).catch((error) => {
        console.log("Error: :", error);
      });
    },
    hasAdditionalOptions() {
      if (this.selected == "ArUCO") {
        return true;
      } else {
        return false;
      }
    },
    generateID() {
      var id = 0;
      return function () {
        return id++;
      }
    },
    
  }
}
</script>

<template id="bodyMarkerSideBar">
  <div class="containerMarkerSidebar">
    <header class="header">
      <ul>
        <li v-for="task in markers">
          <div id="markerTypeImg"><img :src="task.markerURL" alt="Icon"></div>
          <div id="coordinateLatitudeLongitude">
            <div>
              Latitude : {{ task.latitude }}
            </div>
            <div>
              Longitude : {{ task.longitude }}
            </div>
            
            <div v-if="task.idDisplay" id="markerIDOutput">
              ID : {{ task.markerID }}
            </div>
          </div>
          
          <div id="greenRedButtons">
            <button id="greenButton" @click="sendMarker(task)"></button>
            <button id="redButton" @click="deleteMarker(task)"></button>
          </div>
        </li>
      </ul>
    </header>
    <div class="section">
      <div class="addButton">
        <button @click="this.addMarker()" class="buttons" id="addButton">
          <!-- Add --> +
        </button>
      </div>
      <div class="inputs">

        <div class="coordinate">
          <input class="input" id="inputLatitude" type="text" placeholder="LAT" maxlength="10">
          <input class="input" id="inputLongitude" type="text" placeholder="LON" maxlength="10">
        </div>

        <!-- Marker Types -->
        <!-- <img :src="Hammer" alt="Hammer"> -->
        <!-- <Hammer /> -->
        <div class="markerTypes">
          <select v-model="selected" id="markerType">
            <option v-for="marker in markerTypes">
              <span id="optionSelector">
                {{ marker.type }}
              </span>
            </option>
          </select>
          <div class="containerIconAndID">
            <MarkerIcon class="optionIcon" :id="this.dictionary.getID(this.selected)" />
            <input v-if="hasAdditionalOptions()" id="markerID" type="text" maxlength="4">
          </div>
        </div>


      </div>
      <div class="abortAndPauseButton">
        <button class="buttons" id="abortButton">
          <!-- Abort -->
          
          Abort
        </button>
        <!-- <button class="buttons" id="pauseButton">
                Pause
            </button> -->
      </div>

    </div>


  </div>
</template>

<style scoped>
.containerMarkerSidebar {
  pointer-events: all;
}

.header {
  height: 35vh;
  overflow: auto;
}

.header ul li {
  list-style: none;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: .4rem;
  margin-left: -2.5rem;

}

.header ul li:hover{
  background-color: rgba(191, 243, 223, 0.274);
  border-radius: 1rem;

}

#markerTypeImg {
  display: inline-block;
 /* margin-left: -2rem;*/

  border: 1px dashed black;
  border-radius: 11rem;
  background-color: rgba(191, 243, 223, 0.274);
}

#markerTypeImg img {
  width: 3rem;
  height: 100%;
  padding: .4rem;
  display: flex;
  flex-direction: column; /* Öğelerin dikey olarak hizalanmasını sağlar */
  justify-content: center; /* Dikeyde ortalama */
  align-items: center;
  margin-top: -.5rem;

}

#coordinateLatitudeLongitude {
  display: inline-block;
  margin: .4rem;
  width: 16rem;
  border:1px dashed black;
  border-radius: 1rem;
  padding: .5rem;
  background-color: rgba(191, 243, 223, 0.274);
}

#markerIDOutput {
  display: inline-block;
  margin: .4rem;
}

#greenRedButtons {
  float: right;
  margin-right: .5rem;
}

#greenButton {
  background-color: rgb(63, 248, 63);
  border-radius: 50%;
  height: 1rem;
}

#redButton {
  background-color: red;
  border-radius: 50%;
  height: 1rem;
}

.section {
  height: 20vh;
  display: flex;
  flex-direction: column;
}

.addButton {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

#addButton{
  color:black;
  background-color: rgba(191, 243, 223, 0.836);
  border:3px solid rgba(191, 243, 223, 0.836);
  border-radius: 100px;
  font-size: 2rem;
  padding-left: 1.2rem;
  padding-right: 1.2rem;
}

#addButton:hover{
  background-color: rgba(191, 243, 223, 0.836);
  border: 3px dashed black;
  outline: none;
  cursor: pointer;
  transition: 1s;
}


.inputs {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
  height: 100%;
}

.coordinate {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 30%;
  height: 100%;
  color: black;
}

#inputLatitude,
#inputLongitude {
  background-color:rgba(191, 243, 223, 0.836);
}

.input{
  color:black;
  text-align: center;
  border: 1px solid rgba(191, 243, 223);
  border-radius: 5rem;
  font-size: 1.2rem;
}

.input:focus{
  outline: none;
  border: 1px dashed black;

}

.inputs select,

.inputs select option {
  color: black;
  height: 35%;
  display: flex;
  flex-direction: row;
  text-align: center;
}

#markerType{
  border:none;
  background-color: rgba();
  border-radius:50%;
  background-color: rgba(191, 243, 223, 0.836);
  color:black;
  font-weight: bold;
  margin-left: -2rem;
}

#markerType:focus{
  outline: none;
}

#markerType option {
  border-radius: 50%;
  outline:none;
  background-color: rgba(191, 243, 223, 0.836);
}


.markerTypes {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 33%;
  background-color: rgba();
}

#markerID {
  width: 3rem;
  margin-left: 2rem;
  color: black;
  font-size: 1rem;
  padding: .2rem;
  background-color: rgba(191, 243, 223, 0.836);
  border:1px solid rgba(191, 243, 223, 0.836);
  border-radius:5rem;
  text-align: center;
}
#markerID:focus{
  border:1px dashed black;
  outline: none;
}


.containerIconAndID{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.abortAndPauseButton {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  font-size: 5rem;
}

#abortButton {
  background-color: rgba(191, 243, 223, 0.836);
  border:3px solid rgba(191, 243, 223, 0.836);
  border-radius: 100px;
  font-size: 1.8rem;
  padding-left: 1.2rem;
  padding-right: 1.2rem;
}

.buttons {
  color: black;
}
</style>