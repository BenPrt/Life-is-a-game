<template>
  <div id="content-container">
    <Grid v-bind:gridValue="this.gridValue"/>
    <Settings/>
  </div>
</template>

<script>
import Grid from './Grid';
import Settings from './Settings';


export default {
  name: 'Content',
  components: {
    Grid,
    Settings,
  },
  props: ['gridValue'],
};
</script>

<style>
#content-container {
    display: flex;
height : 613px;
width : 100%;
}
</style>
