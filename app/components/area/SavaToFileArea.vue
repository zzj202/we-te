<template>
  <div class="container">
    <div class="card">
      <div class="card-header">
        <h1>LocalStorage 数据管理</h1>
        <p class="subtitle">导出浏览器本地存储数据为 JSON 文件</p>
      </div>
      
      <div class="card-body">
        <button 
          class="export-btn"
          @click="exportLocalStorage"
          :disabled="isExporting"
        >
          <span v-if="!isExporting">导出数据</span>
          <span v-else class="loading">
            <span class="spinner"></span>
            正在导出...
          </span>
        </button>
        
        <transition name="fade">
          <div v-if="exported" class="success-message">
            <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
              <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
              <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
            <p>数据导出成功！</p>
            <a 
              v-if="downloadUrl" 
              class="download-link"
              :href="downloadUrl" 
              download="localStorage_data.json"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
              </svg>
              点击下载 JSON 文件
            </a>
          </div>
        </transition>
      </div>
      
      <div class="card-footer">
        <p class="info-text">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
            <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
          </svg>
          导出的数据仅包含当前网站的 localStorage 内容
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const exported = ref(false);
const downloadUrl = ref('');
const isExporting = ref(false);

const exportLocalStorage = () => {
  isExporting.value = true;
  
  // 模拟加载效果
  setTimeout(() => {
    try {
      // 获取所有 localStorage 数据
      const localStorageData = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          localStorageData[key] = localStorage.getItem(key);
        }
      }

      // 转换为 JSON 字符串
      const jsonData = JSON.stringify(localStorageData, null, 2);
    
      console.log(jsonData)
      // 创建 Blob 对象
      const blob = new Blob([jsonData], { type: 'application/json' });
      
      // 创建下载链接
      downloadUrl.value = URL.createObjectURL(blob);
      exported.value = true;
      
      // 自动下载
      const a = document.createElement('a');
      a.href = downloadUrl.value;
      a.download = 'localStorage_data.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // 5秒后释放 URL 对象
      setTimeout(() => {
        URL.revokeObjectURL(downloadUrl.value);
        downloadUrl.value = '';
      }, 5000);
    } catch (error) {
      console.error('导出失败:', error);
    } finally {
      isExporting.value = false;
    }
  }, 800);
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 20px;
  background-color: #f5f7fa;
}

.card {
  width: 100%;
  max-width: 500px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
}

.card-header {
  padding: 24px;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  color: white;
}

.card-header h1 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 600;
}

.subtitle {
  margin: 8px 0 0;
  opacity: 0.9;
  font-size: 0.95rem;
}

.card-body {
  padding: 24px;
}

.export-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
}

.export-btn:hover {
  box-shadow: 0 5px 15px rgba(110, 142, 251, 0.4);
  transform: translateY(-2px);
}

.export-btn:disabled {
  background: #e0e0e0;
  transform: none;
  box-shadow: none;
  cursor: not-allowed;
}

.loading {
  display: flex;
  align-items: center;
  gap: 8px;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.success-message {
  margin-top: 20px;
  padding: 16px;
  background-color: #f0f8ff;
  border-radius: 8px;
  text-align: center;
}

.checkmark {
  width: 56px;
  height: 56px;
  margin: 0 auto 10px;
}

.checkmark__circle {
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  stroke-width: 2;
  stroke-miterlimit: 10;
  stroke: #4bb71b;
  fill: none;
  animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}

.checkmark__check {
  transform-origin: 50% 50%;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  stroke: #4bb71b;
  stroke-width: 3;
  stroke-linecap: round;
  animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
}

@keyframes stroke {
  100% {
    stroke-dashoffset: 0;
  }
}

.download-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 12px;
  padding: 8px 16px;
  background-color: #6e8efb;
  color: white;
  border-radius: 6px;
  text-decoration: none;
  font-size: 0.9rem;
  transition: background-color 0.3s;
}

.download-link:hover {
  background-color: #5a7df4;
}

.card-footer {
  padding: 16px 24px;
  background-color: #f9f9f9;
  border-top: 1px solid #eee;
}

.info-text {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  font-size: 0.85rem;
  color: #666;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>