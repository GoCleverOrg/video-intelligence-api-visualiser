<template>
  <div class="bar-chart">
    {{ label }} - {{ parseInt(percent) }}%
    <div class="bar" :style="bar_style"></div>
  </div>
</template>

<script>
export default {
  props: ["label", "percent"],
  computed: {
    bar_style() {
      return {
        color: "#4285F4",
        width: this.percent.toString() + "%",
      };
    },
  },
};
</script>

<style scoped>
.bar-chart > div {
  background-color: #4285f4;
  height: 1em;
}
</style>
