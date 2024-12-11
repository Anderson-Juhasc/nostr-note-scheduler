import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';
import { getEventHash } from 'nostr-tools';
import { SimplePool } from 'nostr-tools/pool'

export const useNotesStore = defineStore('notes', () => {
  const notes = ref([]);
  const userProfile = ref(null);
  const pubkey = ref(null);
  const relays = ['wss://relay.damus.io', 'wss://nos.lol']; // Relay URLs

  function saveToLocalStorage() {
    localStorage.setItem(`${pubkey.value}-notes`, JSON.stringify(notes.value));
  }

  async function addNote(content, publishDate) {
    if (!window.nostr) {
      alert('No NIP-07 wallet detected. Please install a Nostr extension like Alby.');
      return;
    }

    try {
      const userPubkey = await window.nostr.getPublicKey();

      // Create the event for the note
      let noteEvent = {
        kind: 1, // Text note
        pubkey: userPubkey,
        created_at: Math.floor(new Date(publishDate) / 1000),
        tags: [],
        content,
      };
      //noteEvent.id = getEventHash(noteEvent); // Generate event hash
      noteEvent = await window.nostr.signEvent(noteEvent); // Sign the event

      console.log(noteEvent)

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
    } finally {
      //pool.close();
    }
  }

  return { notes, sortedNotes, relays, addNote, publishNote, deleteNote, clearAllNotes, login, logout, userProfile, pubkey };
});

