<template>
  <div id="header-container">
    <h1 id="app-title">Life is a game..</h1>
    <button class="main-button" id="play-button" v-if="!isPlaying" @click="play()">
      <i class="far fa-play-circle"></i> Play
    </button>
    <button class="main-button" id="pause-button" v-else @click="stop()">
      <i class="far fa-pause-circle"></i> Pause
    </button>
  </div>
</template>

<script>
export default {
  name: 'Header',
  data() {
    return {
      isPlaying: false,
    };
  },
  methods: {
    play() {
      this.isPlaying = true;
    },
    stop() {
      this.isPlaying = false;
    },
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
.main-button {
  margin-top: 24px;
  margin-left: calc((100% - 100px) / 2);
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
</style>
