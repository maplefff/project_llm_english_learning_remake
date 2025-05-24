<template>
  <div class="answer-input">
    <!-- 多選題選項 -->
    <div v-if="hasOptions" class="answer-options">
      <div
        v-for="option in question.options"
        :key="option.id"
        class="answer-option"
        :class="{ 
          selected: isSelected(option.text), 
          disabled: disabled,
          readonly: readonly 
        }"
        @click="!disabled && !readonly && selectOption(option.text)"
      >
        <div class="option-indicator">{{ option.id }}</div>
        <div class="option-text">{{ option.text }}</div>
      </div>
    </div>

    <!-- 文字輸入 -->
    <div v-else class="answer-text-input">
      <!-- 單行文字輸入 -->
      <div v-if="isShortText" class="text-input-group">
        <input
          :value="textValue"
          @input="handleTextInput"
          @keyup.enter="$emit('submit')"
          type="text"
          class="text-input"
          :placeholder="getPlaceholder()"
          :disabled="disabled"
          :readonly="readonly"
          :maxlength="getMaxLength()"
        />
        <div v-if="showCharCount" class="char-count">
          {{ textValue.length }}{{ getMaxLength() ? `/${getMaxLength()}` : '' }}
        </div>
      </div>

      <!-- 多行文字輸入 -->
      <div v-else class="textarea-input-group">
        <textarea
          :value="textValue"
          @input="handleTextInput"
          class="textarea-input"
          :placeholder="getPlaceholder()"
          :disabled="disabled"
          :readonly="readonly"
          :rows="getTextareaRows()"
          :maxlength="getMaxLength()"
        ></textarea>
        <div v-if="showCharCount" class="char-count">
          {{ textValue.length }}{{ getMaxLength() ? `/${getMaxLength()}` : '' }}
        </div>
      </div>

      <!-- 驗證錯誤訊息 -->
      <div v-if="validationError" class="validation-error">
        ⚠️ {{ validationError }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// 後端API實際返回的題目結構（根據測試結果修正）
interface BackendQuestion {
  id: string
  type: string  // 後端使用的是 'type' 而不是 'questionType'
  explanation_of_Question?: string
  instruction?: string
  passage?: string
  question?: string  // 有些題型沒有 question 欄位
  original_sentence?: string  // 1.2.1 句子改錯使用
  options?: Array<{ id: string; text: string }>  // 修正：實際是物件陣列
  standard_answer?: string
  standard_corrections?: string[]  // 1.2.1 句子改錯的標準答案
  targetWord?: string
  explanation?: string
  error_types?: string[]
}

interface Props {
  question: BackendQuestion
  modelValue: string | string[]
  disabled?: boolean
  readonly?: boolean
  showCharCount?: boolean
  validationError?: string
}

interface Emits {
  (e: 'update:modelValue', value: string | string[]): void
  (e: 'change', value: string | string[]): void
  (e: 'submit'): void
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  readonly: false,
  showCharCount: false
})

const emit = defineEmits<Emits>()

// 計算屬性
const hasOptions = computed(() => 
  props.question.options && props.question.options.length > 0
)

const textValue = computed(() => 
  Array.isArray(props.modelValue) ? props.modelValue.join('') : (props.modelValue || '')
)

const isShortText = computed(() => {
  const questionType = props.question.type
  // 短文字輸入的題型（單行輸入）
  const shortTextTypes = [
    '1.1.2',  // 詞彙填空
    '1.2.1',  // 句子改錯
    '2.2.1',  // 句子合併
    '2.2.2',  // 句子重組
    '2.4.1',  // 段落排序
    '2.6.1',  // 改寫句子
    '2.7.1',  // 中翻英句子
    '2.8.1'   // 英翻中句子
  ]
  return shortTextTypes.includes(questionType)
})

// 方法：檢查選項是否被選中
const isSelected = (optionText: string): boolean => {
  if (Array.isArray(props.modelValue)) {
    return props.modelValue.includes(optionText)
  }
  return props.modelValue === optionText
}

// 方法：選擇選項
const selectOption = (optionText: string) => {
  if (props.disabled || props.readonly) return

  console.log(`[DEBUG AnswerInput.vue] 選擇選項: ${optionText}`)
  
  // 目前假設都是單選，多選邏輯後續可以擴展
  emit('update:modelValue', optionText)
  emit('change', optionText)
}

// 方法：處理文字輸入
const handleTextInput = (event: Event) => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement
  const value = target.value
  
  console.log(`[DEBUG AnswerInput.vue] 文字輸入: ${value}`)
  
  emit('update:modelValue', value)
  emit('change', value)
}

// 方法：獲取佔位符文字
const getPlaceholder = (): string => {
  const questionType = props.question.type
  const placeholders: Record<string, string> = {
    // 1.x.x 閱讀理解系列 - 選擇題不需要佔位符
    '1.1.2': '請填入適當的詞彙...',
    '1.2.1': '請修正句子中的錯誤...',
    
    // 2.x.x 寫作與應用系列
    '2.1.1': '請根據主題進行寫作...',
    '2.1.2': '請找出並修正文中的錯誤...',
    '2.2.1': '請將句子合併成一個完整的句子...',
    '2.2.2': '請重新排列詞語組成正確的句子...',
    '2.3.1': '請撰寫段落...',
    '2.4.1': '請將段落按正確順序排列...',
    '2.4.2': '請撰寫短文...',
    '2.5.1': '請輸入您的答案...',
    '2.5.2': '請撰寫郵件/信函...',
    '2.6.1': '請改寫句子...',
    '2.7.1': '請翻譯為英文...',
    '2.7.2': '請翻譯為英文...',
    '2.8.1': '請翻譯為中文...',
    '2.8.2': '請翻譯為中文...'
  }
  
  return placeholders[questionType] || '請輸入您的答案...'
}

// 方法：獲取最大字數限制
const getMaxLength = (): number | undefined => {
  const questionType = props.question.type
  const maxLengths: Record<string, number> = {
    // 1.x.x 系列
    '1.1.2': 50,      // 詞彙填空
    '1.2.1': 200,     // 句子改錯
    
    // 2.x.x 系列
    '2.1.1': 1000,    // 看圖/主題寫作
    '2.1.2': 300,     // 改錯題
    '2.2.1': 300,     // 句子合併
    '2.2.2': 200,     // 句子重組
    '2.3.1': 500,     // 段落寫作
    '2.4.1': 100,     // 段落排序（數字序列）
    '2.4.2': 800,     // 短文寫作
    '2.5.1': 300,     // 簡答題
    '2.5.2': 600,     // 郵件/信函寫作
    '2.6.1': 200,     // 改寫句子
    '2.7.1': 300,     // 中翻英句子
    '2.7.2': 600,     // 中翻英短文
    '2.8.1': 300,     // 英翻中句子
    '2.8.2': 600      // 英翻中短文
  }
  
  return maxLengths[questionType]
}

// 方法：獲取文字區域行數
const getTextareaRows = (): number => {
  const questionType = props.question.type
  const rows: Record<string, number> = {
    // 2.x.x 系列需要多行輸入的題型
    '2.1.1': 12,      // 看圖/主題寫作
    '2.1.2': 6,       // 改錯題
    '2.3.1': 8,       // 段落寫作
    '2.4.2': 10,      // 短文寫作
    '2.5.1': 4,       // 簡答題
    '2.5.2': 8,       // 郵件/信函寫作
    '2.7.2': 8,       // 中翻英短文
    '2.8.2': 8        // 英翻中短文
  }
  
  return rows[questionType] || 4
}

console.log(`[DEBUG AnswerInput.vue] 答案輸入組件:`, props.question.type, props.question.options)
</script>

<style lang="scss" scoped>
.answer-input {
  margin-bottom: 16px;
}

// 選項樣式 - 簡化版本
.answer-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.answer-option {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 14px 16px;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover:not(.disabled):not(.readonly):not(.selected) {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.15);
  }

  &.selected {
    background: rgba(0, 122, 255, 0.15) !important;
    border-color: rgba(0, 122, 255, 0.4) !important;
    
    .option-indicator {
      background: #007aff;
      color: white;
    }

    // 確保selected狀態下hover不會覆蓋
    &:hover {
      background: rgba(0, 122, 255, 0.2) !important;
      border-color: rgba(0, 122, 255, 0.5) !important;
    }
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.readonly {
    cursor: default;
  }
}

.option-indicator {
  background: rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.8);
  font-family: 'SF Mono', Consolas, monospace;
  font-size: 13px;
  font-weight: 600;
  padding: 6px 8px;
  border-radius: 6px;
  min-width: 28px;
  text-align: center;
  transition: all 0.15s ease;
}

.option-text {
  color: rgba(255, 255, 255, 0.9);
  font-size: 15px;
  line-height: 1.5;
  flex: 1;
}

// 文字輸入樣式保持原有風格，稍作調整以配合方案A
.answer-text-input {
  .text-input-group,
  .textarea-input-group {
    position: relative;
  }

  .text-input,
  .textarea-input {
    width: 100%;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 12px;
    padding: 14px 16px;
    color: rgba(255, 255, 255, 0.9);
    font-size: 15px;
    line-height: 1.5;
    transition: all 0.15s ease;
    resize: vertical;

    &::placeholder {
      color: rgba(255, 255, 255, 0.4);
    }

    &:focus {
      outline: none;
      border-color: rgba(59, 130, 246, 0.6);
      background: rgba(255, 255, 255, 0.08);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &:read-only {
      background: rgba(255, 255, 255, 0.02);
      border-color: rgba(255, 255, 255, 0.06);
    }
  }

  .textarea-input {
    min-height: 100px;
    font-family: inherit;
  }

  .char-count {
    position: absolute;
    bottom: 8px;
    right: 12px;
    color: rgba(255, 255, 255, 0.5);
    font-size: 12px;
    font-family: 'SF Mono', Consolas, monospace;
    background: rgba(40, 40, 42, 0.8);
    padding: 2px 6px;
    border-radius: 4px;
  }
}

.validation-error {
  color: #ff453a;
  font-size: 13px;
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 4px;
}
</style> 