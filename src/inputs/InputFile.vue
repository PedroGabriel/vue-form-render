<template>
  <input
    ref="input"
    :placeholder="field.placeholder"
    type="file"
    class="form-control"
    v-bind="field"
    :data-index="field_index"
    v-on="auto_events"
    @input="
      field.input
        ? field.input($refs.input.files, $event, field_index)
        : () => {}
    "
    @change="
      field.change ? changeEvent(field, $event, field_index) : changeEvent()
    "
    @click="
      field.click
        ? field.click($refs.input.files, $event, field_index)
        : () => {}
    "
    @keyup="
      field.keyup
        ? field.keyup($refs.input.files, $event, field_index)
        : () => {}
    "
    @keydown="
      field.keydown
        ? field.keydown($refs.input.files, $event, field_index)
        : () => {}
    "
    @keypress="
      field.keypress
        ? field.keypress($refs.input.files, $event, field_index)
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
    },
    data: {
      type: Object,
      required: true
    },
    fileLabel: {
      type: Object
    },
    id: {
      type: String
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
  methods: {
    changeEvent(field, event = null, field_index = null) {
      const names = []

      Object.keys(this.$refs.input.files).forEach(k => {
        let file = this.$refs.input.files[k]
        names.push(file.name)
      })

      this.$set(this.fileLabel, this.id, names.join(', '))

      if (field && field.change)
        field.change(this.$refs.input.files, event, field_index)
    }
  }
}
</script>
