<template>
    <div class="management-container">
        <div class="header">
            <h1>LocalStorage 数据管理</h1>
            <p class="subtitle">轻松管理您的浏览器本地存储数据</p>
            <div class="header-divider"></div>
        </div>

        <div class="content-area">
            <div class="area-card export-card">
                <div class="card-header">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                        viewBox="0 0 16 16">
                        <path
                            d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                        <path
                            d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
                    </svg>
                    <h2 class="area-title">导出数据</h2>
                </div>
                <div class="card-content">
                    <area-sava-to-file-area></area-sava-to-file-area>

                </div>
            </div>

            <div class="area-card import-card">
                <div class="card-header">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                        viewBox="0 0 16 16">
                        <path
                            d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                        <path
                            d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z" />
                    </svg>
                    <h2 class="area-title">导入数据</h2>
                </div>
                <div class="card-content">
                    <area-read-file-area></area-read-file-area>
                </div>
            </div>

        </div>
        <div class="sync-section">
            <button class="sync-button" @click="confirmRedisSync">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm0 14.5a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13z" />
                    <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                </svg>
                覆盖到远程Redis数据库
            </button>
        </div>
        <div class="footer">
            <p class="info-text">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                    <path
                        d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                </svg>
                数据管理仅针对当前网站的 localStorage 内容
            </p>
        </div>

        <!-- 确认对话框 -->
        <div v-if="showConfirmDialog" class="confirm-dialog-overlay">
            <div class="confirm-dialog">
                <h3>确认覆盖远程Redis数据库</h3>
                <p>此操作将会用当前本地数据覆盖远程Redis数据库中的所有数据，是否继续？</p>
                <div class="dialog-buttons">
                    <button class="cancel-button" @click="cancelRedisSync">取消</button>
                    <button class="confirm-button" @click="syncToRedis">确认覆盖</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { createDiscreteApi } from 'naive-ui'
import { error } from 'naive-ui/es/_utils/naive/warn';

const { dialog, message, loadingBar } = createDiscreteApi(
    ['dialog', 'message', 'loadingBar']
)
const gameStore = useGameStore()
const showConfirmDialog = ref(false);

const confirmRedisSync = () => {
    showConfirmDialog.value = true;
};

const cancelRedisSync = () => {
    showConfirmDialog.value = false;
};

const isSyncing = ref(false);

async function syncToRedis() {
    gameStore.reset()
    isSyncing.value = true;
    try {
        await gameStore.saveTokvAPI();
        showConfirmDialog.value = false;
        message.success('数据内容已经同步覆盖到远程数据库');
        await gameStore.reset()
        await gameStore.loadSessions()
    } catch (error) {
        console.error('同步失败:', error);
        message.error(`同步覆盖失败: ${errorMsg}`);
    } finally {
        isSyncing.value = false;
    }
}
</script>

<style scoped>
.management-container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 2rem;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    color: #2d3748;
}

.header {
    text-align: center;
    margin-bottom: 3rem;
    position: relative;
}

.header h1 {
    color: #1a365d;
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    background: linear-gradient(90deg, #4f46e5, #2563eb);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
}

.subtitle {
    color: #4a5568;
    font-size: 1.1rem;
    font-weight: 400;
    margin-top: 0;
}

.header-divider {
    height: 4px;
    width: 80px;
    background: linear-gradient(90deg, #4f46e5, #2563eb);
    margin: 1.5rem auto;
    border-radius: 2px;
}

.content-area {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin-bottom: 2rem;
}

.area-card {
    background: white;
    border-radius: 16px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02);
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid #e2e8f0;
}

.area-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.card-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1.5rem 1.5rem 1rem;
    background-color: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
}

.area-title {
    color: #1e293b;
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0;
}

.card-content {
    padding: 1.5rem;
}

.export-card .card-header svg {
    color: #10b981;
}

.import-card .card-header svg {
    color: #3b82f6;
}

.footer {
    text-align: center;
    padding: 1.5rem;
    background-color: #f8fafc;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
}

.info-text {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0;
    color: #64748b;
    font-size: 0.9rem;
    font-weight: 500;
}

.info-text svg {
    color: #4f46e5;
}

/* 新增的同步按钮样式 */
.sync-section {
    margin: 1.5rem 0;
    padding-top: 1.5rem;
    border-top: 1px dashed #e2e8f0;
}

.sync-button {
    display: flex;
    align-items: center;
    justify-content: center;
    /* 新增这一行使内容水平居中 */
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background-color: #ef4444;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    width: 100%;
}

.sync-button:hover {
    background-color: #dc2626;
    transform: translateY(-1px);
}

.sync-button svg {
    color: white;
}

/* 确认对话框样式 */
.confirm-dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.confirm-dialog {
    background-color: white;
    padding: 2rem;
    border-radius: 12px;
    width: 90%;
    max-width: 400px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.confirm-dialog h3 {
    margin-top: 0;
    color: #1e293b;
    font-size: 1.25rem;
}

.confirm-dialog p {
    color: #64748b;
    margin: 1rem 0 1.5rem;
}

.dialog-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
}

.cancel-button,
.confirm-button {
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

.cancel-button {
    background-color: #e2e8f0;
    color: #64748b;
    border: none;
}

.cancel-button:hover {
    background-color: #cbd5e1;
}

.confirm-button {
    background-color: #ef4444;
    color: white;
    border: none;
}

.confirm-button:hover {
    background-color: #dc2626;
}

@media (max-width: 768px) {
    .content-area {
        grid-template-columns: 1fr;
    }

    .header h1 {
        font-size: 2rem;
    }
}
</style>