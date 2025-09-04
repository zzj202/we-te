<template>
    <div class="error-message">
        <div class="error-header">
            <span class="error-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                        stroke="#F97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </span>
            <strong class="error-title">无效提示</strong>
        </div>
        <p class="error-description">{{ message }}</p>
        <div class="error-footer">
            <span class="error-tip">请修改后继续</span>
        </div>
    </div>
</template>

<script setup>
defineProps({
    message: {
        type: String,
        default: ''
    }
});
</script>

<style scoped>
.error-message {
    padding: 12px;
    margin-top: 12px;
    border-radius: 8px;
    background-color: #FFF5F5;
    border: 1px solid #FEE2E2;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    animation: fadeIn 0.3s ease-out;
}

.error-header {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    gap: 6px;
}

.error-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
}

.error-title {
    color: #DC2626;
    font-size: 0.875rem;
    font-weight: 600;
}

.error-description {
    margin: 0 0 8px 0;
    color: #57534E;
    font-size: 0.8125rem;
    line-height: 1.4;
}

.error-footer {
    display: flex;
    align-items: center;
    gap: 4px;
}

.error-tip {
    color: #78716C;
    font-size: 0.6875rem;
    line-height: 1.4;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-3px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (max-width: 600px) {
    .error-message {
        padding: 10px;
    }
}
</style>