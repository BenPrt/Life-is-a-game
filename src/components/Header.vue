<template>
  <div id="header-container">
    <h1 id="app-title">Life is a game..</h1>
    <div id="controls-container">
      <button class="main-button" id="play-button" v-if="!isPlaying" @click="play()">
        <i class="far fa-play-circle"></i> Play
      </button>
      <button class="main-button" id="pause-button" v-else @click="stop()">
        <i class="far fa-pause-circle"></i> Pause
      </button>
      <button class="main-button" id="next-button" v-bind:disabled="isPlaying" @click="playNext()">
        <i class="fas fa-arrow-circle-right"></i> Next
      </button>
      <button class="main-button" id="reset-button" @click="reset()">
        <i class="fas fa-redo-alt"></i> Reset
      </button>
    </div>
  </div>
</template>

<script>
const ipcRenderer = window.require('electron').ipcRenderer;

export default {
  name: 'Header',
  data() {
    return {
      isPlaying: false,
    };
  },
  methods: {
    initListeners() {
      // Keeping the current context (viewmodel) in memory
      const vm = this;
      ipcRenderer.on('played-game', () => {
        vm.isPlaying = true;
      });
      ipcRenderer.on('paused-game', () => {
        vm.isPlaying = false;
      });
      ipcRenderer.on('reseted-game', () => {
        vm.isPlaying = false;
      });
    },
    play() {
      ipcRenderer.send('play-game');
    },
    stop() {
      ipcRenderer.send('pause-game');
    },
    playNext() {
      ipcRenderer.send('play-next');
    },
    reset() {
      ipcRenderer.send('reset-game');
    },
  },
  beforeMount() {
    this.initListeners();
  },
};
</script>

<style>
#header-container {
  height: calc(153px - 16px);
  width: 100%;
  padding-top: 16px;
}
#app-title {
  width: 100%;
  text-align: center;
  font-family: 'Indie Flower', cursive;
  color: #da911b;
  font-size: 40px;
}
#controls-container{
  margin-top: 24px;
  width : 350px;
  margin-left : calc((100% - 350px) / 2);
  display : flex;
  justify-content: space-between;
}
.main-button {
  height: 40px;
  width: 100px;
  border: none;
  border-radius: 3px;
  font-size: 20px;
  cursor: pointer;
  outline: none;
}
.main-button:hover{
  color: #EEEEEE;
}

#play-button{
  background-color: #e7a300;
  color: white;
}
.fa-play-circle{
  color: white;
}
.main-button:hover .fa-play-circle{
  color: #EEEEEE;
}

#pause-button{
  color: #e7a300;
  background-color: white;
  border: 1px solid #e7a300;
}
.fa-pause-circle {
  color: #e7a300;
}

#next-button{
  background-color: #e7a300;
  color: white;
}
#next-button:disabled{
  background-color: grey;
  cursor: default;
}
#next-button:disabled:hover{
  color : white;
}
.fa-arrow-circle-right{
  color: white;
}
.main-button:hover .fa-arrow-circle-right{
  color: #EEEEEE;
}
.main-button:disabled:hover .fa-arrow-circle-right{
  color: white;
}

#reset-button{
  border: 1px solid grey;
}
#reset-button:hover{
  color: #444444;
}
</style>
