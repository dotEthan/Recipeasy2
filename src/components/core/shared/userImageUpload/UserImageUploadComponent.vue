<script lang="ts" setup>
import { ref } from "vue";

import { MAX_FILE_SIZE } from "@/constants";

/**
 * User Image Upload Component
 * @todo - 'errorMessage', emit('upload-error') - still needed here?
 * @returns - signIn, registerUser, logOut, verifyUser, passwordReset, setNewPassword, validatePasswordToken
 * @example
 * <UserImageUploadComponent @file-selected="handleImageSelected" />
 */

const emit = defineEmits<{
  (e: "file-selected", file: File): void;
}>();

const fileInput = ref<HTMLInputElement | null>(null);
const dragging = ref<boolean>(false);
const errorMessage = ref<string>("");
const selectedFile = ref<File | null>(null);

const openFileDialog = (): void => {
  fileInput.value?.click();
};

const handleFileChange = (event: Event): void => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    setNewImageFile(file);
  }
};

const handleDrop = async (event: DragEvent): Promise<void> => {
  event.preventDefault();
  dragging.value = false;
  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
    const file = event.dataTransfer.files[0];
    setNewImageFile(file);
  }
};

const setNewImageFile = (file: File) => {
  if (file.size > MAX_FILE_SIZE) {
    // TODO validation goign through error handler or right here right now?
    errorMessage.value = "File size must be less than 5MB";
    return;
  }

  if (!file.type.match("image.*")) {
    errorMessage.value = "Please select an image file";
    return;
  }

  selectedFile.value = file;
  emit("file-selected", file);
};
</script>

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
        dragging
      }"
      @click="openFileDialog"
    >
      <div class="upload-content">
        <p>Click to upload or drag and drop an image</p>
        <div v-if="errorMessage" class="error-message" role="alert">
          {{ errorMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

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

@media (hover: hover) {
  .upload-area:hover:not(.is-loading) {
    background-color: rgba(0, 0, 0, 0.02);
  }
}
</style>
