<template>
  <div class="scene" id="scene"></div>
</template>

<script lang="ts" setup>
  import Base3d from '@/utils/base3d.ts'
  import { reactive, onMounted } from 'vue'
  const data = reactive({
    base3d: {}
  })

  onMounted(() => {
    data.base3d = new Base3d('#scene')
  })
</script>
