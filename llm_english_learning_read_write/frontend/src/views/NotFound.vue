<template>
  <div class="not-found">
    <el-result icon="warning" title="404" sub-title="抱歉，您訪問的頁面不存在">
      <template #extra>
        <el-button type="primary" @click="goHome">回到首頁</el-button>
      </template>
    </el-result>
  </div>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router'

  const router = useRouter()

  const goHome = () => {
    router.push('/')
  }
</script>

<style scoped>
  .not-found {
    padding: 40px;
    text-align: center;
  }
</style>
