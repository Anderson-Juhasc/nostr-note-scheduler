<template>
  <div v-if="pubkey">
    <h2>Auto Publisher</h2>
    <p>Monitoring notes for publishing...</p>
  </div>
</template>

<script>
import { useNotesStore } from '../stores/notes';
import { onMounted, watch, computed } from 'vue';

export default {
  setup() {
    const notesStore = useNotesStore();

    const pubkey = computed(() => notesStore.pubkey);

    onMounted(() => {
      setInterval(() => {
        const now = new Date().toISOString();
        const dueNotes = notesStore.notes.filter((note) => note.publishDate <= now);

        dueNotes.forEach(async (note) => {
          await notesStore.publishNote(note);
        });
      }, 10000); // Check every 10 seconds
    });

    return { pubkey};
  },
};
</script>

