<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { openExternal } from '@/renderer/utils'
import { useCounterStore } from '@/renderer/store/counter'
import { storeToRefs } from 'pinia'

defineProps<{ msg: string }>()

const input = ref('element-plus')
const appVersion = ref('Unknown')
const { counterIncrease } = useCounterStore()
const { counter } = storeToRefs(useCounterStore())

onMounted((): void => {
  // Get application version from package.json version string (Using IPC communication)
  window.mainApi.receive('msgReceivedVersion', (event: Event, version: string) => {
    appVersion.value = version
  })
  window.mainApi.send('msgRequestGetVersion')
})

const curDate = ref('')

const handleOpenOfficialSite = async (): Promise<void> => {
  await openExternal('https://element-plus.org')
}

const toast = () => {
  ElMessage.success('Hello')
}

const handleCountIncrease = (): void => {
  counterIncrease(1)
}
</script>

<template>
  <div>
    <h1 color="$ep-color-primary">{{ msg }}</h1>

    <p>
      See
      <a href="javascript:void(0);" @click="handleOpenOfficialSite">element-plus</a> for more
      information.
    </p>
    <p>
      <el-text class="mx-1" type="primary"
        >App Version: <strong>{{ appVersion }}</strong></el-text
      >
    </p>

    <!-- example components -->
    <div class="mb-4">
      <el-button size="large" @click="toast">El Message</el-button>
    </div>

    <div class="my-2 text-center flex flex-wrap justify-center items-center">
      <el-button id="btn-counter" @click="handleCountIncrease">{{ counter }}</el-button>
      <el-button type="primary" @click="handleCountIncrease">{{ counter }}</el-button>
      <el-button type="success" @click="handleCountIncrease">{{ counter }}</el-button>
      <el-button type="warning" @click="handleCountIncrease">{{ counter }}</el-button>
      <el-button type="danger" @click="handleCountIncrease">{{ counter }}</el-button>
      <el-button type="info" @click="handleCountIncrease">{{ counter }}</el-button>
    </div>

    <div>
      <el-tag type="success" class="m-1">Tag 1</el-tag>
      <el-tag type="warning" class="m-1">Tag 1</el-tag>
      <el-tag type="danger" class="m-1">Tag 1</el-tag>
      <el-tag type="info" class="m-1">Tag 1</el-tag>
    </div>

    <div class="my-2">
      <el-input v-model="input" class="m-2" style="width: 200px" />
      <el-date-picker
        v-model="curDate"
        class="m-2"
        type="date"
        placeholder="Pick a day"
      ></el-date-picker>
    </div>

    <p>For example, we can custom primary color to 'green'.</p>

    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test components.
    </p>
    <p>
      Edit
      <code>styles/element/var.scss</code> to test scss variables.
    </p>

    <p>
      Full Example:
      <a href="https://github.com/element-plus/element-plus-vite-starter" target="_blank"
        >element-plus-vite-starter</a
      >
      | On demand Example:
      <a href="https://github.com/element-plus/unplugin-element-plus" target="_blank"
        >unplugin-element-plus/examples/vite</a
      >
    </p>
  </div>
</template>

<style>
.ep-button {
  margin: 4px;
}

.ep-button + .ep-button {
  margin-left: 0;
  margin: 4px;
}
</style>
