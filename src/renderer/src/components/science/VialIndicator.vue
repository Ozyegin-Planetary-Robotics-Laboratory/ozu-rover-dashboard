<template>
  <div class="vials">
    <div
      v-for="(vial, index) in vials"
      :key="index"
      :class="{ 'vial': true, 'filled': index < selected, 'yellow': index === 0 }"
    ></div>
  </div>
</template>

<script>
export default {
  props: {
    vials: Array,
    selected: Number,
  },
};
</script>

<style scoped>
.vials {
  display: flex;
  flex-direction: column;
}

.vial {
  width: 50px;
  height: 50px;
  border: 1px solid black;
  background-color: white;
}

.filled {
  background-color: green;
}

.yellow {
  background-color: yellow;
}
</style>
