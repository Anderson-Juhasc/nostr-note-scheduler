<template>
  <div>
    <a @click="handleAmberLogin" v-if="isAndroidBrowser()">Connect with Amber</a>
    <p>{{ pubkeyClipboard }}</p>

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
import { ref, computed } from 'vue';
import { useNotesStore } from '../stores/notes';
import nip55 from '../utils/nip55';
import { isAndroidBrowser } from '../utils/isAndroidBrowser.js';

export default {
  setup() {
    const notesStore = useNotesStore();
    const signer = new nip55('https://andersonjuhasc.com/nostr-note-scheduler/?event=');

    const pubkey = computed(() => notesStore.pubkey);
    const pubkeyClipboard = ref('');
    const userProfile = computed(() => notesStore.userProfile);

    const handleLogin = async () => {
      await notesStore.login(notesStore.relays); // Pass relays from store
    };

    async function accessClipboard() {
      return navigator.clipboard.readText();
      //return new Promise(resolve => {
      //  setTimeout(async () => {
      //    let clipcopied = await navigator.clipboard.readText();
      //    //console.log(clipcopied)
      //    resolve(clipcopied)
      //  }, 500);
      //});
    }

    const handleAmberLogin = async () => {
      //const permissions = [
      //  { type: 'sign_event', kind: 22242 },
      //  { type: 'nip44_decrypt' }
      //];
      //

      const amberSignerUrl = signer.getPublicKeyUrl();
      console.log(amberSignerUrl)
      //await navigator.clipboard.writeText("");
      //window.open(amberSignerUrl, "_blank");
      window.location.href = amberSignerUrl

      const checkClipboard = async () => {
        const clipboardContent = await navigator.clipboard.readText()

        try {
          if (!document.hasFocus()) {
            console.log("Document not focused, waiting for focus...");
            return;
          }

          const clipboardContent = await navigator.clipboard.readText();

          if (
            clipboardContent &&
            clipboardContent !== "" &&
            clipboardContent.startsWith("npub")
          ) {
            const pk = clipboardContent;

            pubkeyClipboard.value = clipboardContent
            //alert(pubkeyClipboard.value)
            
            await notesStore.amberLogin(notesStore.relays, pubkeyClipboard.value); // Pass relays from store

            //window.alert(pk)

            if (pk) {

              await navigator.clipboard.writeText("");

              clearInterval(intervalId);
            }
          }
        } catch (error) {
          console.error("Error reading clipboard:", error);
        }
      };

      checkClipboard();
      const intervalId = setInterval(checkClipboard, 1000);

      setTimeout(() => {
        clearInterval(intervalId);
        console.log("Amber sign in timeout");
        //window.alert("Amber sign in timeout");
      }, 60000);
    };

    const handleLogout = () => {
      notesStore.logout();
    };

    return { 
      handleLogin,
      handleAmberLogin,
      pubkey,
      userProfile,
      handleLogout,
      pubkeyClipboard,
      isAndroidBrowser
    };
  },
};
</script>

