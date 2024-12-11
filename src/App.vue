<template>
  <div>
    <h1>Nostr Note Scheduler</h1>
    <Login />
    <NoteForm />
    <NoteList />
    <NotePublisher />
  </div>
</template>

<script>
import Login from './components/Login.vue';
import NoteForm from './components/NoteForm.vue';
import NoteList from './components/NoteList.vue';
import NotePublisher from './components/NotePublisher.vue';

export default {
  components: { Login, NoteForm, NoteList, NotePublisher },
};
</script>

