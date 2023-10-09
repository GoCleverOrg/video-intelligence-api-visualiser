<template>
  <div
    class="nav-tab"
    :class="{ selected: current_view == title, disabled: !has_data }"
  >
    {{ title }}
    <span v-if="has_data" class="material-icons"> check_circle </span>
  </div>
</template>

<script>
export default {
  name: "AnnotationsNavTab",
  props: ["title", "current_view", "data_id", "detected_features"],
  computed: {
    has_data() {
      return this.detected_features.includes(this.data_id);
    },
  },
};
</script>

<!-- Add any component-specific styles here, if needed -->
<style scoped>
.material-icons {
  vertical-align: middle;
  font-size: 19px;
}

.nav-tab > .material-icons {
  color: #0f9d58;
}
</style>
