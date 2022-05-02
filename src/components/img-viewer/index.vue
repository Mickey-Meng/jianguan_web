<template>
  <div class="preview-container">
    <svg-icon class="preview-btn" :class-name="imgList && imgList.length > 0 ? 'preview-btn__default' : 'preview-btn__empty'" icon-class="photo"
             @click="clickPreview"></svg-icon>
    <div ref="viewer" v-viewer="{movable: false}" style="display: none">
      <template v-for="src in imgList">
        <img v-if="src" :src="src" :key="src" />
      </template>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'ImgViewer',
    components: {},
    props: {
      imgList: {
        type: Array,
        required: true
      }
    },
    methods: {
      clickPreview() {
        this.$refs.viewer.$viewer.show();
      }
    }
  };
</script>

<style lang="scss" scoped>
  .preview-container {
    width: 100%;
    height: 100%;

    .preview-btn {
      cursor: pointer;
      font-size: 16px;
    }

    .preview-btn__default {
      color: #00FFFA;
    }

    .preview-btn__empty {
      color: #ffffff;
    }
  }
</style>
