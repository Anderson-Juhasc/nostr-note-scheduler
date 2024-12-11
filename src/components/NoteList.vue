<template>
  <div v-if="pubkey">
    <h2>Scheduled Notes</h2>

    <ul v-if="notes.length && userProfile">
      <li v-for="note in sortedNotes" :key="note.id">
        <div class="nostr-note">
          <div class="profile-section">
            <img class="profile-image" :src="userProfile.picture" alt="User Profile" />
            <div class="user-info">
              <span class="user-name">{{ userProfile.name }}</span>
              <span class="note-date">Scheduled for: {{ new Date(note.publishDate).toLocaleString() }}</span>
            </div>
          </div>
          <div class="content-section">
            <p class="content-note">
              {{ note.content }}
            </p>
          </div>
          <div class="action-buttons">
            <!--button class="btn edit-btn">Edit</button-->
            <button @click="deleteNote(note.id)" class="btn delete-btn">Delete</button>
          </div>

          <Countdown :createDate="new Date(note.createDate).toLocaleString()" :targetDate="new Date(note.publishDate).toLocaleString()" />
        </div>
        <p></p>
        <!--pre><strong>Signed Note:</strong> {{ note.signedNote }}</pre-->
      </li>
    </ul>
    <p v-else>No notes scheduled.</p>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useNotesStore } from '../stores/notes';
import Countdown from './Countdown.vue';

export default {
  components: { Countdown },
  setup() {
    const notesStore = useNotesStore();
    const pubkey = computed(() => notesStore.pubkey);
    const userProfile = computed(() => notesStore.userProfile);
    const notes = computed(() => notesStore.notes);
    const sortedNotes = computed(() => notesStore.sortedNotes());

    function deleteNote(id) {
      const isConfirmed = window.confirm('Are you sure you want to delete this note?');
      if (isConfirmed) {
        notesStore.deleteNote(id);
      }
    }
    return { pubkey, notes, sortedNotes, userProfile, deleteNote };
  },
};
</script>

<style lang="css">
.nostr-note {
  background-color: #f9f9f9; /* Light background */
  border: 1px solid #ddd; /* Subtle border */
  border-radius: 8px; /* Rounded corners */
  padding: 16px;
  max-width: 500px;
  margin: 16px auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Soft shadow */
  font-family: Arial, sans-serif;
  text-align: left;
  position: relative;
}

.profile-section {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.profile-image {
  width: 48px;
  height: 48px;
  border-radius: 50%; /* Circle image */
  margin-right: 12px;
  object-fit: cover; /* Crop image to fit */
  border: 2px solid #ccc;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 1rem;
  font-weight: bold;
  color: #333; /* Darker text for name */
}

.note-date {
  font-size: 0.85rem;
  color: #888; /* Lighter text for date */
}

.content-section {
  margin-top: 8px;
}

.content-note {
  font-size: 0.95rem;
  line-height: 1.5;
  color: #444; /* Neutral text color */
  word-wrap: break-word; /* Ensure text breaks on small screens */
}

.action-buttons {
  display: flex;
  gap: 8px; /* Space between buttons */
  position: absolute;
  right: 16px;
  top: 16px;
}

.btn {
  padding: 8px 12px;
  font-size: 0.9rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.edit-btn {
  background-color: #4caf50; /* Green background */
  color: white;
}

.edit-btn:hover {
  background-color: #45a049; /* Slightly darker green */
}

.delete-btn {
  background-color: #f44336; /* Red background */
  color: white;
}

.delete-btn:hover {
  background-color: #e53935; /* Slightly darker red */
}

.progress-section {
  margin-top: 16px;
  text-align: center;
  position: relative;
}

.progress-bar-container {
  width: 100%;
  background-color: #ddd;
  border-radius: 4px;
  overflow: hidden;
  height: 8px;
}

.progress-bar {
  height: 8px;
  background-color: #4caf50;
  transition: width 0.1s linear;
}

.countdown-text {
  margin-top: 8px;
  font-size: 0.85rem;
  color: #555;
}
</style>
