<template>
  <div class="feature-tabs">
    <annotations-nav-tab
      v-for="(title, id) in title_ids_dict"
      :key="id"
      :title="title"
      :data_id="id"
      :detected_features="detected_features"
      :current_view="current_view"
      @click.native="nav_clicked(title)"
    >
    </annotations-nav-tab>
  </div>
</template>

<script>
import AnnotationsNavTab from "./AnnotationsNavTab.vue";

export default {
  components: {
    AnnotationsNavTab,
  },
  name: "AnnotationsNav",
  props: ["title_ids_dict", "current_view", "detected_features"],
  methods: {
    nav_clicked(title) {
      this.$emit("nav-clicked", title);
    },
  },
};
</script>

<style scoped>
.feature-tabs {
  margin: 30px;
  text-align: center;
}

.feature-tabs > div {
  display: inline-block;
  font-size: 1.2em;
  padding: 12px;
  cursor: pointer;
  color: #777777;
  font-weight: 300;

  border: solid #4285f4 1px;
  border-radius: 5px;
  margin: 5px;
}

.feature-tabs > div:hover {
  background-color: #4285f41a;
}

.feature-tabs > .selected {
  border-bottom: 2px solid #4285f4;
}

.feature-tabs > .disabled {
  color: #cdcdcd;
}
</style>
