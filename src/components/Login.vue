<template>
  <div>
    <button v-if="!pubkey" @click="handleLogin">Connect with extension</button>
    <a v-if="!pubkey" @click="handleAmberLogin">Connect with Amber</a>
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
import NostrSigner from '../utils/NostrSigner';

export default {
  setup() {
    const notesStore = useNotesStore();
    const signer = new NostrSigner('https://andersonjuhasc.com/nostr-note-scheduler/?event=');

    const pubkey = computed(() => notesStore.pubkey);
    const userProfile = computed(() => notesStore.userProfile);

    const handleLogin = async () => {
      await notesStore.login(notesStore.relays); // Pass relays from store
    };

    async function accessClipboard() {
      return new Promise(resolve => {
        setTimeout(async () => {
          let clipcopied = await navigator.clipboard.readText();
          //console.log(clipcopied)
          resolve(clipcopied)
        }, 500);
      });
    }

    const handleAmberLogin = async () => {
      //const permissions = [
      //  { type: 'sign_event', kind: 22242 },
      //  { type: 'nip44_decrypt' }
      //];
      //

      const amberSignerUrl = signer.getPublicKeyUrl();
      await navigator.clipboard.writeText("");
      window.open(amberSignerUrl, "_blank");

      let eventSignature = await accessClipboard()
      alert(eventSignature)

      //const clipboardContent = await navigator.clipboard.readText()

      //const checkClipboard = async () => {
      //  try {
      //    if (!document.hasFocus()) {
      //      console.log("Document not focused, waiting for focus...");
      //      return;
      //    }

      //    const clipboardContent = await navigator.clipboard.readText();

      //    if (
      //      clipboardContent &&
      //      clipboardContent !== "" &&
      //      clipboardContent.startsWith("npub")
      //    ) {
      //      const pk = clipboardContent;

      //      window.alert(pk)

      //      if (pk) {

      //        await navigator.clipboard.writeText("");

      //        clearInterval(intervalId);
      //      }
      //    }
      //  } catch (error) {
      //    console.error("Error reading clipboard:", error);
      //  }
      //};

      //checkClipboard();
      //const intervalId = setInterval(checkClipboard, 1000);

      //setTimeout(() => {
      //  clearInterval(intervalId);
      //  console.log("Amber sign in timeout");
      //  window.alert("Amber sign in timeout");
      //}, 60000);
    };

    const handleLogout = () => {
      notesStore.logout();
    };

    return { handleLogin, handleAmberLogin, pubkey, userProfile, handleLogout };
  },
};
</script>

