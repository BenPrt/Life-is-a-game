<template>
  <div id="grid-container">
      <table id="grid">
        <tr v-for="(rows, rowIdx) in gridValue" :key="rowIdx">
          <td id="grid-cell" v-for="(cell, colIdx) in rows" :key="colIdx"
          @click="toggleCell(rowIdx, colIdx)"
          v-bind:class="{ alive : isAlive(cell), dead: !isAlive(cell) }">
            </td>
        </tr>
      </table>
  </div>
</template>

<script>
const ipcRenderer = window.require('electron').ipcRenderer;

export default {
  name: 'Grid',
  data() {
    return {
      gridValue : [],
    };
  },
  methods: {
    generateGrid() {
      console.log('calling generate grid...');
      ipcRenderer.send('generate-grid');
    },
    initListeners(){
      let vm = this;
      ipcRenderer.on('update-grid', function (event, arg) {
        vm.gridValue = arg;
        console.log('updating grid...', vm.gridValue);
      });
    },
    toggleCell(x, y) {
      ipcRenderer.send('toggle-cell', [x, y]);
    },
    isAlive(cell) {
      return cell !== 0;
    },
  },
  beforeMount() {
    this.initListeners();
    this.generateGrid();
  },
  mounted() {
  },
};
</script>

<style>
#grid-container {
    height : 536px;
    width : 536px;
    margin-left : calc((100% - 536px) / 2);
}

#grid-cell{
  height : 15px;
  width : 15px;
  border: 1px solid black;
  cursor : pointer;
}

.alive {
  background-color : #e7a300;
}
.dead {
  background-color : white;
}
</style>
