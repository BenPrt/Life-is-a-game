<template>
  <div id="app">
    <Header/>
    <Content v-bind:gridValue="this.gridValue"/>
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
  data() {
    return {
      gridValue: [],
    };
  },
  methods: {
    generateGrid() {
      for (let row = 0; row < 30; row += 1) {
        const rowValues = [];
        for (let col = 0; col < 30; col += 1) {
          rowValues.push(0);
        }
        this.gridValue.push(rowValues);
      }
    },
  },
  beforeMount() {
    this.generateGrid();
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
