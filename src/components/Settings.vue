<template>
  <div id="settings-container">
    <h1 id="settings-title">Settings</h1>
    <div class="inline-field">
      <label class="settings-label" for="height-input">Height :</label>
      <input id="height-input" type="number" name="height" v-model="height"
      placeholder="Height" min="1" max="34" @change="updateHeight()">
    </div>
    <div class="inline-field">
      <label class="settings-label" for="width-input">Width :</label>
      <input id="width-input" type="number" name="width" v-model="width"
      placeholder="Width" min="1" max="50" @change="updateWidth()">
    </div>
    <div class="stacked-field">
      <label class="settings-label" for="speed-input">Speed :</label>
      <input id="speed-input" type="range" name="speed" v-model="speed"
      min="0" max="10" @change="updateSpeed()">
    </div>
  </div>
</template>

<script>
const ipcRenderer = window.require('electron').ipcRenderer;

export default {
  name: 'Settings',
  components: {
  },
  data() {
    return {
      width: 30,
      height: 30,
      speed: 1,
    };
  },
  methods: {
    updateHeight() {
      if (this.height < 1) {
        this.height = 1;
      }
      if (this.height > 34) {
        this.height = 34;
      }
      ipcRenderer.send('update-height', this.height);
    },
    updateWidth() {
      if (this.width < 1) {
        this.width = 1;
      }
      if (this.width > 50) {
        this.width = 50;
      }
      ipcRenderer.send('update-width', this.width);
    },
    updateSpeed() {
      ipcRenderer.send('update-speed', this.speed);
    },
  },
  mounted() {
    this.updateHeight();
    this.updateWidth();
    this.updateSpeed();
  },
};
</script>

<style>
#settings-container {
  height : calc(-16px + 613px - 16px);
  width : calc(-16px + ((100% - 536px) / 2) - 16px);
  padding : 16px;
}

#settings-title {
    font-family: 'Indie Flower', cursive;
    color : #888888;
}

.inline-field {
  margin-top: 16px;
  display: flex;
}
.settings-label {
  width: 85px;
}
#height-input, #width-input {
  width: 50px;
  text-align: center;
}

.stacked-field {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
}
#speed-input {
  margin-top: 16px;
  width: 150px;
}
</style>
