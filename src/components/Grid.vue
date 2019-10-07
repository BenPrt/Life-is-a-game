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

export default {
  name: 'Grid',
  props: ['gridValue'],
  data() {
    return {
    };
  },
  methods: {
    toggleCell(x, y) {
      console.log(x, y);
      console.log(this.gridValue[x][y]);

      this.gridValue[x][y] = this.gridValue[x][y] === 0 ? 1 : 0;
      console.log(this.gridValue[x][y]);
    },
    isAlive(cell) {
      return cell !== 0;
    },
  },
  beforeMount() {
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
