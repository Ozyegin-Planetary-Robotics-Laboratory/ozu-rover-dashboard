<script>
import ArchiveNavigator from './science/ArchiveNavigator.vue';
import Previews from './science/Previews.vue';
import VialIndicator from './science/VialIndicator.vue'

export default {
  name: 'ScienceWindow',
  components: {
    ArchiveNavigator,
    Previews,
    VialIndicator
  },
  data() {
    return {
      vials: Array(8).fill(false),
      selected: 0,
      archives: [
        { id: 1, name: 'Archive 1' },
        { id: 2, name: 'Archive 2' },
        { id: 3, name: 'Archive 3' },
        { id: 4, name: 'Archive 4' },
        { id: 5, name: 'Archive 5' }
      ],
      selectedArchiveName: '',
      panoramaImage: '',
      highDefImage: '',
    };
  },
  methods: {
    handleNewLog() {
      const newArchiveId = this.archives.length + 1;
      const newArchiveName = `Archive ${newArchiveId}`;
      const newArchive = { id: newArchiveId, name: newArchiveName };
      this.archives.push(newArchive);
    },
    handleCapturePanaroma() {
      console.log('Capture Panaroma');
    },
    handleCaptureHighDef() {
      console.log('Capture High-Def');
    },
    handleArchiveSelected(archive) {
      this.selectedArchiveName = archive.name;
    },
    handleSample() {
      console.log("handleSample in ScienceWindow called");
      
    }

  }
};
</script>

<template>    
  
  <div class="split left">
      <div>
        <VialIndicator :vials="vials" :selected="selected" @sample="handleSample" />
        <button @click="handleSample">Sample</button>
      </div>
  </div>
  
  <div class="split right">
    
      <div class="space-between"></div>
    <ArchiveNavigator :archives="archives" @archive-selected="handleArchiveSelected" />

    <div class="space-between"></div>

    <div class="button-container">
      <button style="background-color: red; margin-right: 100px; margin-left: 20px" @click="handleNewLog">
        Create New Log
      </button>
      <button style="background-color: red; margin-right: 100px" @click="handleCapturePanaroma">
        Capture Panaroma
      </button>
      <button style="background-color: red" @click="handleCaptureHighDef">Capture High-Def</button>
    </div>

    <div class="space-between"></div>

    <Previews :panorama-image="panoramaImage" :high-def-image="highDefImage" />

    <div class="space-between"></div>

    <div v-if="selectedArchiveName">Selected Archive: {{ selectedArchiveName }}</div>
        
  </div>

</template>

<style scoped>

.split{
  height: 100%;
  width: 50%;
  position: fixed;
  z-index: 1;
  top: 0;
  overflow-x: hidden;
  padding-top: 50px;
}

.left {
  left: 0;
  background-color: #ff0303a8;
}

.right{
  background-color: rgb(80, 219, 25) !important;
  right: 0;
}

.space-between {
  margin-bottom: 20px;
}

.button-container {
  display: flex;
  justify-content: space-between;
}

.previews-container {
  display: flex;
  justify-content: space-between;
}

.panorama-preview,
.high-def-preview {
  border: 1px solid #ccc;
  padding: 10px;
  width: 45%;
}
</style>

