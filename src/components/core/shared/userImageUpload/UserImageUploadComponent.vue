<template>
  <div
    class="upload-container"
    @dragover.prevent
    @dragenter.prevent="dragging = true"
    @dragleave="dragging = false"
    @drop.prevent="handleDrop"
  >
    <input
      type="file"
      ref="fileInput"
      @change="handleFileChange"
      accept="image/*"
      class="hidden-file-input"
    />
    <div 
      class="upload-area" 
      :class="{ 
        dragging,
        'is-loading': isUploading || isGeneratingSignature 
      }" 
      @click="openFileDialog"
    >
      <div class="upload-content">
        <p v-if="!isUploading && !isGeneratingSignature">
          Click to upload or drag and drop an image
        </p>
        <p v-else-if="isGeneratingSignature" class="status-message">
          Preparing upload...
        </p>
        <p v-else class="status-message">
          Uploading...
        </p>
        <div v-if="error" class="error-message" role="alert">
          {{ error.message }}
        </div>
        <div v-if="previewUrl" class="preview-container">
          <img :src="previewUrl" alt="Image preview" class="preview-image" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onUnmounted } from 'vue'
import { useImageUpload } from '@/composables/useImageUpload'

interface EmitEvents {
  (e: 'upload-complete', url: string): void
  (e: 'upload-error', error: any): void
  (e: 'upload-start'): void
}

const emit = defineEmits<EmitEvents>()

const fileInput = ref<HTMLInputElement | null>(null)
const dragging = ref<boolean>(false)

const {
  uploadImage,
  createPreview,
  cleanup,
  isUploading,
  isGeneratingSignature,
  error,
  previewUrl
} = useImageUpload()

const openFileDialog = (): void => {
  fileInput.value?.click()
}

const handleFileChange = async (event: Event): Promise<void> => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    await handleImageUpload(input.files[0])
  }
}

const handleDrop = async (event: DragEvent): Promise<void> => {
  dragging.value = false
  if (event.dataTransfer?.files[0]) {
    await handleImageUpload(event.dataTransfer.files[0])
  }
}

const handleImageUpload = async (file: File): Promise<void> => {
  // Validate file type
  if (!file.type.startsWith('image/')) {
    error.value = { message: 'Please upload an image file' }
    emit('upload-error', error.value)
    return
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024 // 5MB in bytes
  if (file.size > maxSize) {
    error.value = { message: 'Image size should be less than 5MB' }
    emit('upload-error', error.value)
    return
  }

  emit('upload-start')
  createPreview(file)
  
  const uploadedUrl = await uploadImage(file)
  if (uploadedUrl) {
    console.log('upload is complete')
    emit('upload-complete', uploadedUrl)
  } else if (error.value) {
    emit('upload-error', error.value)
  }
}

// Cleanup preview URL when component is destroyed
onUnmounted(() => {
  cleanup()
})
</script>

<style scoped>
.upload-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 200px;
  border: 2px dashed #ccc;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.upload-area {
  width: 100%;
  height: 100%;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-content {
  max-width: 100%;
  max-height: 100%;
}

.upload-area.dragging {
  background-color: rgba(0, 0, 0, 0.05);
  border-color: #666;
}

.upload-area.is-loading {
  cursor: wait;
  opacity: 0.7;
}

.hidden-file-input {
  display: none;
}

.error-message {
  color: #dc3545;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  padding: 0.5rem;
  background-color: rgba(220, 53, 69, 0.1);
  border-radius: 4px;
}

.status-message {
  color: #666;
  font-style: italic;
}

.preview-container {
  margin-top: 1rem;
  max-width: 100%;
  max-height: 300px;
  overflow: hidden;
  border-radius: 4px;
}

.preview-image {
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
}

@media (hover: hover) {
  .upload-area:hover:not(.is-loading) {
    background-color: rgba(0, 0, 0, 0.02);
  }
}
</style>
