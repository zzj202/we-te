<template>
    <div class="dialog-overlay" v-if="visible" @click.self="close">
        <div class="session-dialog">
            <div class="dialog-header">
                <h3>{{ isEdit ? '编辑场次' : '创建新场次' }}</h3>
                <button class="close-btn" @click="close">×</button>
            </div>

            <div class="dialog-body">
                <form @submit.prevent="save">
                    <div class="form-group">
                        <label for="session-name">场次名称</label>
                        <input id="session-name" type="text" v-model="formData.name" required placeholder="请输入场次名称" />
                    </div>

                    <div class="form-group">
                        <label>中奖号码</label>
                        <QuickTePingInput v-model:flat-codes="formData.flatCodes"
                            v-model:special-code="formData.specialCode" />
                    </div>

                    <!-- 新增的赔率输入部分 -->
                    <div class="odds-input-group">
                        <div class="form-group">
                            <label for="flat-code-odds">平码赔率</label>
                            <input id="flat-code-odds" type="number" v-model.number="formData.flatCodeOdds" min="1"
                                step="1" required placeholder="请输入平码赔率" />
                        </div>
                        <div class="form-group">
                            <label for="special-code-odds">特码赔率</label>
                            <input id="special-code-odds" type="number" v-model.number="formData.specialCodeOdds"
                                min="1" step="1" required placeholder="请输入特码赔率" />
                        </div>
                    </div>
                </form>
            </div>

            <div class="dialog-footer">
                <button class="btn-cancel" @click="close">取消</button>
                <button class="btn-save" @click="save">{{ isEdit ? '更新' : '创建' }}</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import QuickTePingInput from '@/components/input/QuickTePingInput.vue'
import { createDiscreteApi } from 'naive-ui'

const { dialog, message } = createDiscreteApi(
    ['dialog', 'message']
)
const props = defineProps({
    session: {
        type: Object,
        required: true,
        default: () => ({
            name: '',
            flatCodes: [],
            specialCode: '',
            flatCodeOdds: 1,
            specialCodeOdds: 1
        })
    },
    isEdit: {
        type: Boolean,
        default: false
    },
    visible: {
        type: Boolean,
        required: true
    }
})

const emit = defineEmits(['close', 'save'])

const formData = ref(JSON.parse(JSON.stringify(props.session)))

watch(
    () => props.session,
    (newSession) => {
        formData.value = JSON.parse(JSON.stringify(newSession))
    },
    { deep: true }
)

const close = () => {
    emit('close')
}

const save = () => {
    if (!formData.value.name) {
        message.error('场次名称不能为空')
        return
    }
    if (formData.value.flatCodes.length !== 0) {
        if (new Set(formData.value.flatCodes).size !== formData.value.flatCodes.length) {
            message.error('存在重复数字')
            return
        }
        if (formData.value.flatCodes.includes(formData.value.specialCode)) {
            message.error('平码不能和特码相同')
            return
        }
        if (formData.value.flatCodes.length != 6 || !formData.value.specialCode) {
            message.error('请输入完整的中奖号码（6个平码和1个特码）')
            return
        }
    }
    if (formData.value.flatCodeOdds <= 0 || formData.value.specialCodeOdds <= 0) {
        message.error('赔率必须大于0')
        return
    }
    //修改中奖号码
    if (formData.value.flatCodes.length == 6 && formData.value.specialCode) {
        formData.value.status = 'inactive'
    }

    emit('save', formData.value)
    close()
}
</script>

<style scoped>
.dialog-overlay {
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

.session-dialog {
    background-color: white;
    border-radius: 8px;
    width: 90%;
    max-width: 600px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    overflow: hidden;
}

.dialog-header {
    padding: 16px 24px;
    background-color: #f5f5f5;
    border-bottom: 1px solid #e0e0e0;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.dialog-header h3 {
    margin: 0;
    font-size: 18px;
    color: #333;
}

.close-btn {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #666;
    padding: 0;
    line-height: 1;
}

.close-btn:hover {
    color: #333;
}

.dialog-body {
    padding: 20px 24px;
    overflow-y: auto;
    overflow-x: hidden;
    flex-grow: 1;
}

.form-group {
    margin-bottom: 24px;
    padding: 0 50px 0 0;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #444;
    font-size: 15px;
}

input[type="text"],
input[type="number"] {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
}

input[type="text"]:focus,
input[type="number"]:focus {
    border-color: #4a90e2;
    outline: none;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
}

.dialog-footer {
    padding: 16px 24px;
    background-color: #f5f5f5;
    border-top: 1px solid #e0e0e0;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
}

.btn-cancel,
.btn-save {
    padding: 10px 20px;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
    min-width: 80px;
}

.btn-cancel {
    background-color: #f0f0f0;
    border: 1px solid #ddd;
    color: #555;
}

.btn-cancel:hover {
    background-color: #e0e0e0;
}

.btn-save {
    background-color: #2196F3;
    border: none;
    color: white;
}

.btn-save:hover {
    background-color: #0b7dda;
}

/* 新增的赔率输入组样式 */
.odds-input-group {
    display: flex;
    gap: 20px;
}

.odds-input-group .form-group {
    flex: 1;
    margin-bottom: 0;
}

@media (max-width: 768px) {
    .session-dialog {
        width: 95%;
    }

    .dialog-body {
        padding: 16px;
    }

    .odds-input-group {
        flex-direction: column;
        gap: 16px;
    }
}
</style>