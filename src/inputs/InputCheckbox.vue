<template>
  <input
    ref="input"
    v-model="field_value"
    type="checkbox"
    :value="field.value || ''"
    v-bind="field"
    :data-index="field_index"
    v-on="auto_events"
    @input="
      field.input
        ? field.input($refs.input.value, $event, field_index)
        : () => {}
    "
    @change="
      field.change
        ? field.change($refs.input.value, $event, field_index)
        : () => {}
    "
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
import field_value from '../field_value'
import field_index from '../field_index'

export default {
  mixins: [field_value, auto_events, field_index],
  props: {
    field: {
      type: Object,
      required: true
    },
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      custom_events: [
        'input',
        'change',
        'click',
        'keyup',
        'keydown',
        'keypress'
      ]
    }
  },
  computed: {}
}
</script>
