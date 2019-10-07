<template>
  <div id="app">
    <Header/>
    <Content/>
  </div>
</template>

<script>
import Header from './components/Header';
import Content from './components/Content';

export default {
  name: 'App',
  components: {
    Header,
    Content,
  },
};
</script>

<style>
#app {
  width: 1266px;
  height: 766px;
  background: rgb(207,207,207);
background: radial-gradient(circle,
rgba(207,207,207,1) 0%,
rgba(245,245,245,1) 13%,
rgba(219,219,219,1) 53%,
rgba(230,230,230,1) 72%,
rgba(255,255,255,1) 100%);
}
</style>
