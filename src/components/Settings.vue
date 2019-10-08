<template>
  <div id="settings-container">
    <h1 id="settings-title">Settings</h1>
    <div class="inline-field">
      <label class="settings-label" for="height-input">Height :</label>
      <input id="height-input" type="number" name="height" v-model="height"
      placeholder="Height" v-bind:min="minHeight" v-bind:max="maxHeight" @change="updateHeight()">
    </div>
    <div class="inline-field">
      <label class="settings-label" for="width-input">Width :</label>
      <input id="width-input" type="number" name="width" v-model="width"
      placeholder="Width" v-bind:min="minWidth" v-bind:max="maxWidth" @change="updateWidth()">
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
      height: 30,
      minHeight: 3,
      maxHeight: 34,
      width: 30,
      minWidth: 3,
      maxWidth: 50,
      speed: 1,
    };
  },
  methods: {
    initListeners() {
      const vm = this;
      ipcRenderer.on('reseted-game', () => {
        vm.height = 30;
        vm.width = 30;
        vm.speed = 1;
        this.updateHeight();
        this.updateWidth();
        This.updateSpeed();
      });
    },
    updateHeight() {
      if (this.height < this.minHeight) {
        this.height = this.minHeight;
      }
      if (this.height > this.maxHeight) {
        this.height = this.maxHeight;
      }
      ipcRenderer.send('update-height', this.height);
    },
    updateWidth() {
      if (this.width < this.minWidth) {
        this.width = this.minWidth;
      }
      if (this.width > this.maxWidth) {
        this.width = this.maxWidth;
      }
      ipcRenderer.send('update-width', this.width);
    },
    updateSpeed() {
      ipcRenderer.send('update-speed', this.speed);
    },
  },
  mounted() {
    this.initListeners();
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
