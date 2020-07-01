/* eslint-disable vue/no-side-effects-in-computed-properties */
<template>
  <div style="position:relative;">
    <span
      @click="clear()"
      class="select-close-caret"
      v-if="selectedValue.value && !field.readonly && !field.disabled"
    >X</span>
    <multiselect
      ref="input"
      v-model="value"
      v-bind="field"
      :data-index="field_index"
      :options="selectOptions"
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
      <span slot="caret"></span>
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
      selectedName: '',
      changed: false,
      selectOptions: []
    }
  },
  computed: {
    selectedValue() {
      let selectedValue = { name: '', value: '' }

      let value = ''
      let name = ''
      try {
        value = this.field.name
          .replace(/^data\./, '')
          .split('.')
          .reduce((o, i) => o[i], this.data)
        if (!this.changed) name = this.field.value(this.data)
      } catch (e) {
        /* try to get unset variables because ajax could not be done yet */
      }

      if (!name && this.selectedName) name = this.selectedName
      if (name && value && name.toString().length && value.toString().length) selectedValue = { name, value }

      return selectedValue
    },
    placeholderSelected() {
      if (this.selectedName) return 'active'
      return ''
    },
    placeholder() {
      if (this.selectedName) return this.selectedName
      return this.field.placeholder || 'Digite para buscar'
    },
    helperText() {
      let hasData = this.selectOptions.length

      if (!hasData && this.selectedValue.value && !this.searchQuery) return 'Digite para buscar'

      return 'Nenhum resultado encontrado'
    },
    helperToggle() {
      let hide = 'hideHelper'
      let show = 'showHelper'
      let hasData = this.selectOptions.length

      if (this.isLoading) return hide

      if (!hasData && this.selectedValue.value && this.field.preload) return show

      if (this.field.preload && !hasData) return show

      if (!this.field.preload && !hasData && !this.searchQuery) return hide

      if (this.searchQuery && hasData) return hide

      if (!hasData) return show

      return hide
    },
    value: {
      get() {
        return this.selectedValue
      },
      set(newSelectedOptions) {
        if (newSelectedOptions) {
          this.field_value = newSelectedOptions.value
          this.setSelectedName(newSelectedOptions.name)
          this.selectedValue.name = newSelectedOptions.name
          this.selectedValue.value = newSelectedOptions.value
          this.changed = true
          return
        }
        this.setSelectedName('')
        this.field_value = ''
      }
    }
  },
  methods: {
    async ajax_return() {
      this.isLoading = true

      if (typeof this.field.preload == 'undefined' && !this.field.preload) {
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
    },
    setSelectedName(value) {
      this.selectedName = value
    },
    customLabel({ name }) {
      return name
    },
    updateSearch(searchQuery) {
      if (this.debounce) clearTimeout(this.debounce)
      this.debounce = setTimeout(async () => {
        this.searchQuery = searchQuery
        this.selectOptions = await this.ajax_return()
      }, 400)
    },
    change_method(selected) {
      let event = ''
      if (this.field.input) event = 'input'
      if (this.field.select) event = 'select'
      if (this.field.change) event = 'change'

      if (event) this.field[event](selected.value, this.$refs.input, this.field_index)
    },
    remove_method(selected) {
      if (this.field.remove) this.field.remove(selected.value, this.$refs.input, this.field_index)
    },
    tag_method(selected) {
      if (this.field.tag) this.field.tag(selected.value, this.$refs.input, this.field_index)
    },
    async open_method() {
      if (!this.selectOptions.length) {
        if (this.field.preload) this.selectOptions = await this.ajax_return()
      }
      if (this.field.open) this.field.open(this.$refs.input, this.field_index)
    },
    close_method() {
      if (this.field.close) this.field.close(this.$refs.input, this.field_index)
    },
    clear() {
      this.selectedValue.name = ''
      this.selectedValue.value = ''
      // this.selectOptions = []
      this.searchQuery = ''
      this.value = { name: '', value: '' }
    }
  }
}
</script>
