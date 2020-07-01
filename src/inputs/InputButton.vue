<template>
  <input
    ref="input"
    type="button"
    class="btn btn-primary"
    :value="field.value || ''"
    v-bind="field"
    :data-index="field_index"
    v-on="auto_events"
    @click="
      field.click
        ? field.click($refs.input.value, $event, field_index)
        : () => {}
    "
    @keyup="
      field.keyup
        ? field.keyup($refs.input.value, $event, field_index)
        : () => {}
    "
    @keydown="
      field.keydown
        ? field.keydown($refs.input.value, $event, field_index)
        : () => {}
    "
    @keypress="
      field.keypress
        ? field.keypress($refs.input.value, $event, field_index)
        : () => {}
    "
  />
</template>

<script>
import auto_events from '../auto_events'
import field_index from '../field_index'

export default {
  mixins: [auto_events, field_index],
  props: {
    field: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      custom_events: ['click', 'keyup', 'keydown', 'keypress']
    }
  },
  computed: {}
}
</script>
