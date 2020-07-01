<template>
  <div>
    <multiselect
      ref="input"
      v-model="value"
      v-bind="field"
      :data-index="field_index"
      :options="options"
      :multiple="false"
      :close-on-select="true"
      :clear-on-select="false"
      :preserve-search="true"
      :preselect-first="false"
      :custom-label="customLabel"
      :placeholder="field.default || 'Selecione'"
      :showLabels="false"
      @select="change_method"
      @remove="remove_method"
      @tag="tag_method"
      @open="open_method"
      @close="close_method"
    >
      <span slot="noResult">Nenhum resultado encontrado.</span>
      <span slot="noOptions">Nenhuma opção</span>
    </multiselect>
  </div>
</template>

<script>
import field_index from '../field_index'
import field_value from '../field_value'

import Vue from 'vue'
import Multiselect from 'vue-multiselect'
Vue.component('multiselect', Multiselect)

export default {
  mixins: [field_index, field_value],
  components: { Multiselect },
  props: {
    field: {
      type: Object,
      required: true
    },
    options: {
      type: Array,
      required: true
    },
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {}
  },
  computed: {
    value: {
      get() {
        return this.options.filter(
          option => option.value == this.field_value
        )[0]
      },
      set(newSelectedOptions) {
        if (newSelectedOptions) {
          this.field_value = newSelectedOptions.value
          return
        }
        this.field_value = ''
      }
    }
  },
  methods: {
    customLabel({ name }) {
      return name
    },

    change_method(selected) {
      let event = ''
      if (this.field.input) event = 'input'
      if (this.field.select) event = 'select'
      if (this.field.change) event = 'change'

      if (event)
        this.field[event](selected.value, this.$refs.input, this.field_index)
    },
    remove_method(selected) {
      if (this.field.remove)
        this.field.remove(selected.value, this.$refs.input, this.field_index)
    },
    tag_method(selected) {
      if (this.field.tag)
        this.field.tag(selected.value, this.$refs.input, this.field_index)
    },
    open_method() {
      if (this.field.open) this.field.open(this.$refs.input, this.field_index)
    },
    close_method() {
      if (this.field.close) this.field.close(this.$refs.input, this.field_index)
    }
  }
}
</script>
