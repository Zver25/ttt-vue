<template>
  <img
    class="cell"
    alt="Cross"
    :class="{ expiring: type === 'x' }"
    :src="crossSrc"
    v-if="type.toLocaleUpperCase() === 'X'"
  />
  <img
    class="cell"
    alt="Circle"
    :class="{ expiring: type === 'o' }"
    :src="circleSrc"
    v-else-if="type.toLocaleUpperCase() === 'O'"
  />
  <div
    class="cell empty"
    v-else
    @click="handleClick"
  ></div>
</template>

<script>
export default {
  name: 'TableCell',
  props: {
    type: {
      type: String,
      required: true,
      default: ' '
    },
  },
  methods: {
    handleClick() {
      this.$emit('click');
    }
  },
  computed: {
    crossSrc() {
      return require('@/assets/cross.svg');
    },
    circleSrc() {
      return require('@/assets/circle.svg');
    }
  }
}
</script>

<style scoped>
img.cell {
  margin-bottom: -6px;
}
.cell {
  width: 64px;
  height: 64px;
}
.cell.expiring {
  opacity: .25;
}
.cell.empty {
  cursor: pointer;
}
</style>
