<template>
  <div
    ref="input"
    v-html="parse_value(field.html || field.text || field.value)"
    v-bind="field"
    :data-index="field_index"
    v-on="auto_events"
    @click="
      field.click
        ? field.click($refs.input.value, $event, field_index)
        : () => {}
    "
  ></div>
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
    },
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      custom_events: ['click']
    }
  },
  methods: {
    parse_value(value) {
      if (typeof value === 'function')
        return value(this.data, this.field, this.field_index)

      return value
    }
  },
  computed: {}
}
</script>
