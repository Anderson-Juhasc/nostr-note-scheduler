<template>
  <div v-if="pubkey">
    <h2>Add a Note</h2>
    <form @submit.prevent="addNote">
      <input type="datetime-local" v-model="publishDate" required />
      <br>
      <br>
      <textarea v-model="content" placeholder="Write your note here..." required></textarea>
      <br>
      <br>
      <button type="submit">Add Note</button>
    </form>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useNotesStore } from '../stores/notes';

export default {
  setup() {
    const notesStore = useNotesStore();
    const content = ref('');
    const publishDate = ref('');
    const pubkey = computed(() => notesStore.pubkey);

    async function addNote() {
      if (!content.value || !publishDate.value) {
        alert('Please fill in all fields.');
        return;
      }

      await notesStore.addNote(content.value, new Date(publishDate.value).toISOString());
      content.value = '';
      publishDate.value = '';
    }

    return { pubkey, content, publishDate, addNote };
  },
};
</script>

