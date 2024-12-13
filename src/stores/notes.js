import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';
import { getEventHash } from 'nostr-tools';
import { SimplePool } from 'nostr-tools/pool'
import { nip19 } from 'nostr-tools';
import NostrSigner from '../utils/NostrSigner';

export const useNotesStore = defineStore('notes', () => {
  const notes = ref([]);
  const userProfile = ref(null);
  const pubkey = ref(null);
  const wallet = ref(null);
  const relays = ['wss://relay.damus.io', 'wss://nos.lol']; // Relay URLs

  function saveToLocalStorage() {
    localStorage.setItem(`${pubkey.value}-notes`, JSON.stringify(notes.value));
  }

  async function addNote(content, publishDate) {
    //if (!window.nostr) {
    //  alert('No NIP-07 wallet detected. Please install a Nostr extension like Alby.');
    //  return;
    //}

    try {
      let userPubkey = pubkey.value;

      console.log(userPubkey)

      // Create the event for the note
      let noteEvent = {
        kind: 1, // Text note
        pubkey: userPubkey,
        created_at: Math.floor(new Date(publishDate) / 1000),
        tags: [],
        content,
      };

      if (wallet.value === 'extension') {
        //noteEvent.id = getEventHash(noteEvent); // Generate event hash
        noteEvent = await window.nostr.signEvent(noteEvent); // Sign the event
      }

      if (wallet.value === 'app') {
        const amberSignerUrl = signer.getSignEventUrl(noteEvent);
        window.location.href = amberSignerUrl
        alert('Sign Event URL:', amberSignerUrl);
        console.log('Sign Event URL:', amberSignerUrl);

        const clipboardContent = await navigator.clipboard.readText();

        alert(clipboardContent)

        //const checkClipboard = async () => {
        //  const clipboardContent = await navigator.clipboard.readText()

        //  try {
        //    if (!document.hasFocus()) {
        //      console.log("Document not focused, waiting for focus...");
        //      return;
        //    }

        //    const clipboardContent = await navigator.clipboard.readText();

        //    alert(clipboardContent)
        //    

        //    if (clipboardContent) {

        //      await navigator.clipboard.writeText("");

        //      clearInterval(intervalId);
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
        //  //window.alert("Amber sign in timeout");
        //}, 60000);
      }

      const createDate = new Date().toISOString();

      // Add the signed note to the list
      notes.value.push({
        id: Date.now(),
        createDate,
        publishDate,
        content,
        signedNote: noteEvent, // Store the signed note
      });

      saveToLocalStorage();
      console.log('Note added and signed:', noteEvent);
    } catch (error) {
      console.error('Error signing or adding note:', error);
    }
  }

  function deleteNote(id) {
    const index = notes.value.findIndex(note => note.id === id);
    if (index !== -1) {
      notes.value.splice(index, 1);
      saveToLocalStorage();
    }
  }

  function clearAllNotes() {
    notes.value.length = 0;
    saveToLocalStorage();
  }

  function sortedNotes() {
    return [...notes.value].sort((a, b) => {
      const dateA = new Date(a.createDate);
      const dateB = new Date(b.createDate);
      return dateB - dateA; // Ascending order
    })
  }

  async function login(relays) {
    if (!window.nostr) {
      alert('No NIP-07 wallet detected. Please install a Nostr extension like Alby.');
      return;
    }

    try {
      const userPubkey = await window.nostr.getPublicKey();
      pubkey.value = userPubkey;
      wallet.value = 'extension';

      notes.value = JSON.parse(localStorage.getItem(`${userPubkey}-notes`) || '[]');

      // Fetch profile from relays
      const pool = new SimplePool();
      const events = await pool.querySync(relays, { kinds: [0], authors: [userPubkey] });
      if (events.length > 0) {
        userProfile.value = JSON.parse(events[0].content);
        console.log('Profile loaded:', userProfile.value);
      } else {
        console.log('No profile found.');
        userProfile.value = null;
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  }

  async function amberLogin(relays, userPubkey) {
    //if (!window.nostr) {
    //  alert('No NIP-55 wallet detected. Please install a Nostr extension like Alby.');
    //  return;
    //}

    try {
      userPubkey = (nip19.decode(userPubkey)).data

      pubkey.value = userPubkey;
      wallet.value = 'app';

      notes.value = JSON.parse(localStorage.getItem(`${userPubkey}-notes`) || '[]');

      // Fetch profile from relays
      const pool = new SimplePool();
      const events = await pool.querySync(relays, { kinds: [0], authors: [userPubkey] });
      if (events.length > 0) {
        userProfile.value = JSON.parse(events[0].content);
        console.log('Profile loaded:', userProfile.value);
      } else {
        console.log('No profile found.');
        userProfile.value = null;
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  }

  function logout() {
    console.log('User logged out');
    window.location.reload()
  }

  async function publishNote(note) {
    const pool = new SimplePool();

    try {
      await pool.publish(relays, note.signedNote);

      // Remove note from the list after publishing
      const index = notes.value.findIndex((n) => n.id === note.id);
      if (index !== -1) {
        notes.value.splice(index, 1);
        saveToLocalStorage();
      }
    } catch (error) {
      console.error('Error publishing note:', error);
    }
  }

  return { notes, sortedNotes, relays, addNote, publishNote, deleteNote, clearAllNotes, login, amberLogin, logout, userProfile, pubkey };
});

