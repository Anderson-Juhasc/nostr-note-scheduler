<template>
  <div>
    <button v-if="!pubkey" @click="handleLogin">Connect with extension</button>
    <div v-else>
      <div v-if="userProfile">
        <h3>Your Profile</h3>
        <p>Logged in as: <strong>{{ pubkey }}</strong></p>
        <p><strong>Name:</strong> {{ userProfile.name || 'N/A' }}</p>
        <!--p><strong>About:</strong> {{ userProfile.about || 'N/A' }}</p-->
        <p v-if="userProfile.picture">
          <img :src="userProfile.picture" alt="Profile Picture" width="100" />
        </p>
        <button @click="handleLogout">Logout</button>
      </div>
      <p v-else>No profile found.</p>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useNotesStore } from '../stores/notes';

export default {
  setup() {
    const notesStore = useNotesStore();

    const pubkey = computed(() => notesStore.pubkey);
    const userProfile = computed(() => notesStore.userProfile);

    const handleLogin = async () => {
      await notesStore.login(notesStore.relays); // Pass relays from store
    };

    const handleLogout = () => {
      notesStore.logout();
    };

    return { handleLogin, pubkey, userProfile, handleLogout };
  },
};
</script>

