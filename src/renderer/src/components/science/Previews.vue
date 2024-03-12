<template>
  <div class="previews-container">
    <div class="panorama-preview">
      <h3>Low-Res Panorama:</h3>
      <img v-if="panoramaImage" :src="panoramaImage" alt="Panorama" />
    </div>
    <div class="high-def-preview">
      <h3>Low-Res Photograph:</h3>
      <img v-if="highDefImage" :src="highDefImage" alt="High-Def" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Previews',
  props: {
    panoramaImage: String,
    highDefImage: String
  }
}
</script>

<style scoped>
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
