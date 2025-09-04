<template>
    <div class="container">
        <div class="card">
            <div class="card-header">
                <h1>LocalStorage 数据管理</h1>
                <p class="subtitle">从 JSON 文件导入数据到浏览器本地存储</p>
            </div>

            <div class="card-body">
                <div class="file-upload">
                    <input type="file" id="fileInput" ref="fileInput" accept=".json" @change="handleFileChange"
                        class="file-input" />
                    <label for="fileInput" class="upload-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                            viewBox="0 0 16 16">
                            <path
                                d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                            <path
                                d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
                        </svg>
                        选择 JSON 文件
                    </label>
                    <span class="file-name" v-if="selectedFile">{{ selectedFile.name }}</span>
                </div>

                <button class="import-btn" @click="importLocalStorage" :disabled="!selectedFile || isImporting">
                    <span v-if="!isImporting">导入数据</span>
                    <span v-else class="loading">
                        <span class="spinner"></span>
                        正在导入...
                    </span>
                </button>

                <transition name="fade">
                    <div v-if="imported" class="success-message">
                        <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                            <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
                            <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                        </svg>
                        <p>数据导入成功！</p>
                        <p class="import-summary">
                            已导入 {{ importCount }} 条数据
                        </p>
                    </div>
                </transition>

                <transition name="fade">
                    <div v-if="importError" class="error-message">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                            viewBox="0 0 16 16">
                            <path
                                d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                        </svg>
                        <p>{{ importError }}</p>
                    </div>
                </transition>
            </div>

            <div class="card-footer">
                <p class="info-text warning">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        viewBox="0 0 16 16">
                        <path
                            d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                    </svg>
                    导入将覆盖现有 localStorage 数据，请谨慎操作
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { createDiscreteApi } from 'naive-ui'

const { dialog, message } = createDiscreteApi(['dialog', 'message'])

const gameStore = useGameStore()
const selectedFile = ref(null);
const imported = ref(false);
const isImporting = ref(false);
const importCount = ref(0);
const importError = ref('');
const fileInput = ref(null);

const handleFileChange = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
        selectedFile.value = files[0];
        imported.value = false;
        importError.value = '';
    }
};

const importLocalStorage = () => {
    if (!selectedFile.value) return;

    isImporting.value = true;
    imported.value = false;
    importError.value = '';

    const reader = new FileReader();

    reader.onload = (e) => {
        try {
            const jsonData = JSON.parse(e.target.result);
            // 清空现有 localStorage
            localStorage.clear();
            importCount.value = 0;
            // 导入新数据
            for (const key in jsonData) {
                if (Object.prototype.hasOwnProperty.call(jsonData, key)) {
                    localStorage.setItem(key, jsonData[key]);
                    importCount.value++;
                }
            }
            if (jsonData.game && JSON.parse(jsonData.game)) {
                const tmp = JSON.parse(jsonData.game)
                gameStore.currentSession = tmp.sessions[0]
                gameStore.sessions = tmp.sessions
                message.warning(`导入成功！共有${tmp.sessions.length}个场次。请覆盖到远程使用方能正常使用`)
            } else if (JSON.stringify(jsonData) == '{}') {
                message.warning(
                    '导入数据为空，即将清空所有数据。请斟酌后选择覆盖远程',
                    { duration: 5000 }
                )
                gameStore.reset()
            }
            imported.value = true;
        } catch (error) {
            console.error('导入失败:', error);
            importError.value = '文件格式错误，请上传有效的 JSON 文件';
        } finally {
            isImporting.value = false;
            // 重置文件输入
            if (fileInput.value) {
                fileInput.value.value = '';
            }
            selectedFile.value = null;
        }
    };

    reader.onerror = () => {
        importError.value = '读取文件失败';
        isImporting.value = false;
    };

    reader.readAsText(selectedFile.value);
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

.file-upload {
    margin-bottom: 20px;
}

.file-input {
    display: none;
}

.upload-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    background-color: #f0f4f8;
    color: #4a5568;
    border: 1px dashed #cbd5e0;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.upload-btn:hover {
    background-color: #e2e8f0;
    border-color: #a0aec0;
}

.file-name {
    display: inline-block;
    margin-left: 12px;
    font-size: 0.9rem;
    color: #4a5568;
}

.import-btn {
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

.import-btn:hover:not(:disabled) {
    box-shadow: 0 5px 15px rgba(110, 142, 251, 0.4);
    transform: translateY(-2px);
}

.import-btn:disabled {
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
    to {
        transform: rotate(360deg);
    }
}

.success-message {
    margin-top: 20px;
    padding: 16px;
    background-color: #f0f8ff;
    border-radius: 8px;
    text-align: center;
}

.import-summary {
    margin-top: 8px;
    font-size: 0.9rem;
    color: #4a5568;
}

.error-message {
    margin-top: 20px;
    padding: 16px;
    background-color: #fff5f5;
    border-radius: 8px;
    text-align: center;
    color: #e53e3e;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
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

.info-text.warning {
    color: #c05621;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>