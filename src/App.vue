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
  margin-left : calc((100vw - 1266px) / 2);
}
</style>
