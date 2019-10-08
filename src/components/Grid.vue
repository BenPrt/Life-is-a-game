<template>
  <div id="grid-container">
      <table id="grid">
        <tr id="grid-row" v-for="(rows, rowIdx) in gridValue" :key="rowIdx">
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
      gridValue: [],
    };
  },
  methods: {
    generateGrid() {
      ipcRenderer.send('generate-grid');
    },
    initListeners() {
      const vm = this;
      ipcRenderer.on('update-grid', (event, arg) => {
        vm.gridValue = arg;
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
};
</script>

<style>
#grid-container {
    height: 536px;
    width: 536px;
    margin-left: calc((100% - 536px) / 2);
}

#grid-cell {
  height: 15px;
  width: 15px;
  border: 1px solid black;
  cursor: pointer;
  margin: none;
}

.alive {
  background-color: #e7a300;
}
.dead {
  background-color: white;
}
</style>
