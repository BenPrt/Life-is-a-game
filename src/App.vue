<template>
  <div id="app">
    <Header/>
    <Content/>
  </div>
</template>

<script>
const ipcRenderer = window.require('electron').ipcRenderer;
import Header from './components/Header';
import Content from './components/Content';

export default {
  name: 'App',
  components: {
    Header,
    Content,
  },
  data() {
    return {
    };
  },
  methods: {

  },
  beforeMount() {
  },
};
</script>

<style>
#app {
  width: 1266px;
  height: 766px;
  margin-left : calc((100vw - 1266px) / 2);
}
</style>
