/* eslint-disable vue/no-side-effects-in-computed-properties */
<template>
  <div>
    <multiselect
      ref="input"
      v-model="value"
      v-bind="field"
      :data-index="field_index"
      :options="ajax_return || []"
      :multiple="false"
      :close-on-select="true"
      :clear-on-select="false"
      :preserve-search="true"
      :preselect-first="false"
      :custom-label="customLabel"
      :placeholder="placeholder"
      :showLabels="false"
      @select="change_method"
      @remove="remove_method"
      @search-change="updateSearch"
      @tag="tag_method"
      @open="open_method"
      @close="close_method"
      :searchable="true"
      :loading="isLoading"
      :internal-search="false"
      :options-limit="300"
      :show-no-results="false"
      autocomplete="off"
      :class="`${helperToggle} ${placeholderSelected}`"
    >
      <span slot="noResult">Nenhum resultado</span>
      <span slot="noOptions">{{ helperText }}</span>
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
      type: Function,
      required: true
    },
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isLoading: false,
      searchQuery: '',
      debounce: null,
      selectedName: ''
    }
  },
  asyncComputed: {
    async ajax_return() {
      this.isLoading = true

      if (typeof this.field.empty !== 'undefined' && this.field.empty) {
        if (!this.searchQuery) {
          this.isLoading = false
          return []
        }
      }

      const result = await (this.field['search'] || this.field['options'])(
        this.searchQuery,
        this.$refs.input && this.$refs.input ? this.$refs.input : null,
        this.field_index
      )

      const new_options = []
      result.forEach(element => {
        new_options.push({ ...element })
      })

      this.isLoading = false
      return new_options
    }
  },
  computed: {
    placeholderSelected() {
      if (this.selectedName) return 'active'
      return ''
    },
    placeholder() {
      if (this.selectedName) return this.selectedName
      return this.field.placeholder || 'Digite para buscar'
    },
    helperText() {
      let hasData =
        this.ajax_return &&
        Array.isArray(this.ajax_return) &&
        this.ajax_return.length > 0

      if (!hasData && this.selectedName && !this.searchQuery)
        return 'Digite para buscar'

      return 'Nenhum resultado encontrado'
    },
    helperToggle() {
      let hide = 'hideHelper'
      let show = 'showHelper'
      let hasData =
        this.ajax_return &&
        Array.isArray(this.ajax_return) &&
        this.ajax_return.length > 0

      if (this.isLoading) return hide

      if (!hasData && this.selectedName) return show

      if (!this.field.empty && !hasData) return show

      if (this.field.empty && !hasData && !this.searchQuery) return hide

      if (this.searchQuery && hasData) return hide

      if (!hasData) return show

      return hide
    },
    value: {
      get() {
        let value = (this.ajax_return || []).filter(
          option => option.value == this.field_value
        )[0]

        let newName = value instanceof Object && value.name ? value.name : value
        let oldName = this.selectedName

        if(oldName != newName)
          this.setSelectedName(newName)
        return value
      },
      set(newSelectedOptions) {
        if (newSelectedOptions) {
          this.field_value = newSelectedOptions.value
          this.setSelectedName(newSelectedOptions.name)
          return
        }
        this.setSelectedName('')
        this.field_value = ''

      }
    }
  },
  methods: {
    setSelectedName(value) {
      this.selectedName = value
    },
    customLabel({ name }) {
      return name
    },
    updateSearch(searchQuery) {
      if (this.debounce) clearTimeout(this.debounce)
      this.debounce = setTimeout(() => {
        this.searchQuery = searchQuery
      }, 400)
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
