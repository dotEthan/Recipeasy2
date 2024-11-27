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
    <div class="upload-area" :class="{ dragging }" @click="openFileDialog">
      <p v-if="!uploading">Click to upload or drag and drop an image</p>
      <p v-else>Uploading...</p>
      <img v-if="previewUrl" :src="previewUrl" alt="Image preview" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const fileInput = ref<HTMLInputElement | null>(null)
const dragging = ref<boolean>(false)
const uploading = ref<boolean>(false)
const previewUrl = ref<string | null>(null)

const openFileDialog = (): void => {
  fileInput.value?.click()
}

const handleFileChange = async (event: Event): Promise<void> => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    await uploadImageToCloudinary(input.files[0])
  }
}

const handleDrop = async (event: DragEvent): Promise<void> => {
  dragging.value = false
  if (event.dataTransfer && event.dataTransfer.files[0]) {
    await uploadImageToCloudinary(event.dataTransfer.files[0])
  }
}

const uploadImageToCloudinary = async (file: File): Promise<void> => {
  uploading.value = true
  previewUrl.value = URL.createObjectURL(file)

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)
  try {
    const response = await fetch('https://api.cloudinary.com/v1_1/dotethan/image/upload', {
      method: 'POST',
      body: formData
    })
    const data = await response.json()
    console.log('uploading returned data: ', data)
    console.log('Uploaded image URL:', data.secure_url)
  } catch (error) {
    console.error('Error uploading image:', error)
  } finally {
    uploading.value = false
  }
}
</script>

<style scoped>
.upload-container {
  position: relative;
  width: 100%;
  height: 100%;
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
  transition: background-color 0.3s;
}

.upload-area.dragging {
  background-color: #e0e0e0;
}

.hidden-file-input {
  display: none;
}

img {
  max-width: 100%;
  max-height: 100%;
  margin-top: 10px;
}
</style>
