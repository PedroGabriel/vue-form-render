<template>
  <form ref="form" :class="[view ? 'view-mode' : 'edit-mode']" novalidate @submit.prevent="submit">
    <template v-if="init_masks"></template>
    <template v-for="(row, row_index) in schema">
      <div v-if="row.fields" v-bind="row" :key="row_index" :class="row_class(row)">
        <template v-for="(field, field_index) in row.fields">
          <div
            v-bind="field.parent"
            v-if="(field.type || field.view) && !field.hide"
            :class="group_class(field)"
            :key="row_index + '-' + field_index"
            :style="In(field.type, ['hidden']) ? 'display:none;' : ''"
          >
            <!-- LABEL BEFORE INPUT -->
            <label
              v-if="field.label && notIn(field.type, ['submit', 'button', 'checkbox', 'radio'])"
              :for="field.name + '-' + row_index + '-' + field_index"
              >{{ field.label }}{{ required[field.name] ? ' *' : '' }}</label
            >

            <!-- BEFORE HTML -->
            <div v-if="field.before" v-html="field.before"></div>

            <template v-if="!view">
              <!-- INPUTS -->
              <component
                v-if="field.type && notIn(field.type, ['button', 'submit', 'file'])"
                :is="'input-' + final_field_type_parsed(field)"
                :field="field"
                :options="field.options || []"
                :data.sync="data"
                :id="field.name + '-' + row_index + '-' + field_index"
                :mask="field.mask"
                :class="get_by_name(errors, field.name) ? 'is-invalid' : ''"
              ></component>

              <!-- INPUT + LABEL FILE -->
              <template v-if="In(field.type, ['file'])">
                <div v-if="field.label" class="custom-file">
                  <component
                    v-if="field.type"
                    :is="'input-' + final_field_type_parsed(field)"
                    :field="field"
                    :options="field.options || []"
                    :data.sync="data"
                    :id="field.name + '-' + row_index + '-' + field_index"
                    :mask="field.mask"
                    :class="get_by_name(errors, field.name) ? 'is-invalid' : ''"
                    :fileLabel="file_labels"
                  ></component>

                  <label
                    v-if="field.label"
                    :for="field.name + '-' + row_index + '-' + field_index"
                    :class="'custom-file-label ' + (get_by_name(errors, field.name) ? 'is-invalid-label' : '')"
                  >
                    {{ file_labels[field.name + '-' + row_index + '-' + field_index] || 'Escolher arquivo' }}
                  </label>
                </div>
              </template>
              <!-- END INPUT + LABEL FILE -->

              <div
                ref="feedback"
                class="invalid-feedback"
                :style="'display:' + (get_by_name(errors, field.name) ? 'block' : 'none') + ';'"
                v-if="!view && notIn(field.type, ['button', 'submit', 'checkbox', 'radio'])"
              >
                {{
                  Array.isArray(get_by_name(errors, field.name))
                    ? get_by_name(errors, field.name).join(', ')
                    : get_by_name(errors, field.name)
                }}
              </div>
            </template>

            <!-- \/ VIEW MODE -->
            <template v-if="view">
              <div
                v-if="field.view"
                v-html="
                  typeof field.view === 'string'
                    ? field.view
                    : field.view(data || {}, data[field.name] || '', field.index || 0)
                "
              ></div>
              <div
                v-else-if="
                  notIn(final_field_type_parsed(field), [
                    'select',
                    'select-ajax',
                    'select-complete',
                    'submit',
                    'button',
                    'password',
                    'checkbox',
                    'radio',
                    'hidden'
                  ])
                "
                :class="'form-view form-control input-'+final_field_type_parsed(field)"
              >
                <div
                  v-if="In(final_field_type_parsed(field), ['html'])"
                  v-html="typeof field.html === 'string' ? field.html : field.html(data, data[field.name], field.index)"
                ></div>
                <template v-else>
                  <div v-if="field.mask" v-mask="field.mask" v-text="data[field.name]"></div>
                  <div v-else-if="In(field.type, ['html', 'file'])" v-html="data[field.name]"></div>
                  <div v-else v-text="data[field.name]"></div>
                </template>
              </div>

              <div v-if="In(final_field_type_parsed(field), ['checkbox', 'radio'])" :class="'form-view form-control input-'+final_field_type_parsed(field)">
                <div
                  v-if="field.mask"
                  v-mask="field.mask"
                  v-html="data[field.name] && In(field.value, data[field.name]) ? field.value : ''"
                ></div>
                <div v-else v-html="data[field.name] && In(field.value, data[field.name]) ? field.value : ''"></div>
              </div>

              <div v-if="In(final_field_type_parsed(field), ['select'])" :class="'form-view form-control input-'+final_field_type_parsed(field)">
                <div
                  v-if="field.mask"
                  v-mask="field.mask"
                  v-html="select_options_parsed(field.options, data[field.name])"
                ></div>
                <div v-else v-html="select_options_parsed(field.options, data[field.name])"></div>
              </div>

              <div v-if="In(final_field_type_parsed(field), ['select-ajax'])" :class="'form-view form-control input-'+final_field_type_parsed(field)">
                <div
                  v-if="field.mask"
                  v-mask="field.mask"
                  v-html="promises[field.name + '-' + row_index + '-' + field_index] || ''"
                ></div>
                <div v-else v-html="promises[field.name + '-' + row_index + '-' + field_index] || ''"></div>
              </div>

              <div
                v-if="In(final_field_type_parsed(field), ['select-complete']) && field.value"
                :class="'form-view form-control input-'+final_field_type_parsed(field)"
              >
                <div v-if="field.mask" v-mask="field.mask" v-html="getSelectCompleteFieldValue(field, data)"></div>
                <div v-else v-html="getSelectCompleteFieldValue(field, data)"></div>
              </div>
            </template>
            <!-- /\ VIEW MODE -->

            <!-- LABEL AFTER INPUT -->
            <label
              v-if="!view && field.label && In(field.type, ['checkbox', 'radio'])"
              :for="field.name + '-' + row_index + '-' + field_index"
              class="form-check-label"
              >{{ field.label }}{{ required[field.name] ? ' *' : '' }}</label
            >
            <div ref="feedback" v-if="!view && In(field.type, ['checkbox', 'radio'])" class="invalid-feedback">
              {{
                Array.isArray(get_by_name(errors, field.name))
                  ? get_by_name(errors, field.name).join(', ')
                  : get_by_name(errors, field.name)
              }}
            </div>

            <!-- HELP TEXT -->
            <small v-if="field.help" class="form-text text-muted" v-text="field.help"></small>

            <!-- AFTER HTML -->
            <div v-if="field.after" v-html="field.after"></div>

            <!-- BUTTONS -->
            <component
              v-if="field.type && In(field.type, ['button', 'submit'])"
              :key="row_index + '-' + field_index"
              :is="'input-' + field.type"
              :field="field"
              :id="field.type + '-' + row_index + '-' + field_index"
              v-bind="field"
            ></component>
          </div>
        </template>
      </div>
    </template>

    <div class="form-group metadata" v-if="metadata && (data.creation_date || data.modification_date)">
      <p v-if="data.creation_date" class="text-sm text-grey">
        {{ `Criado em ${creationDate}` }}
        <template
          v-if="data && data.created_by && data.created_by.first_name"
        >
          por
          {{ data.created_by.first_name }}
          {{ data.created_by.last_name }}
        </template>
      </p>
      <p v-if="data.modification_date" class="text-sm text-grey">
        {{ `Modificado em ${modificationDate}` }}
        <template
          v-if="data && data.modified_by && data.modified_by.first_name"
        >
          por
          {{ data.modified_by.first_name }}
          {{ data.modified_by.last_name }}
        </template>
      </p>
    </div>
  </form>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
import { mask } from './masker'
import mask_object from './masker/predefined'
import Helpers from './Helpers'
import Validators from './Validators'
import get_by_name from './get_by_name'

import InputButton from './inputs/InputButton.vue'
import InputCheckbox from './inputs/InputCheckbox.vue'
import InputFile from './inputs/InputFile.vue'
import InputHtml from './inputs/InputHtml.vue'
import InputRadio from './inputs/InputRadio.vue'
import InputSelect from './inputs/InputSelect.vue'
import InputSelectAjax from './inputs/InputSelectAjax.vue'
import InputSelectComplete from './inputs/InputSelectComplete.vue'
import InputSubmit from './inputs/InputSubmit.vue'
import InputText from './inputs/InputText.vue'
import InputPassword from './inputs/InputPassword.vue'
import InputEmail from './inputs/InputEmail.vue'
import InputTextarea from './inputs/InputTextarea.vue'
import InputHidden from './inputs/InputHidden.vue'

export default {
  directives: { mask },
  mixins: [Helpers, Validators, get_by_name],

  components: {
    InputButton,
    InputCheckbox,
    InputFile,
    InputHtml,
    InputRadio,
    InputSelect,
    InputSelectAjax,
    InputSelectComplete,
    InputSubmit,
    InputText,
    InputPassword,
    InputEmail,
    InputTextarea,
    InputHidden
  },

  props: {
    schema: { type: Array, required: true },
    data: { type: Object, required: true },
    view: { type: Boolean, required: false },
    metadata: { type: Boolean, required: false, default: true },
    validate: { type: Function, required: false, function() {} }
  },

  data() {
    return {
      file_labels: {},
      inited_masks: {},
      promises: {},
      errors: {},
      required: {},
      rejects: {}, // errors created by the dev instead of auto generated
      field_set: {
        value: {}, // the dynamic object to push data into
        schema: {}, // the schema of the object that gonna be pushed
        data: {}, // the schema of the data object that gonna be pushed into the this.data[name] array
        index: {} // the current index of inserted objects
      }
    }
  },

  computed: {
    creationDate() {
      let datetime = this.data.creation_date.split(' ')
      let date = datetime[0].split('-')
      return `${date[2]}/${date[1]}/${date[0]} ${datetime[1]}`
    },

    modificationDate() {
      let datetime = this.data.modification_date.split(' ')
      let date = datetime[0].split('-')
      return `${date[2]}/${date[1]}/${date[0]} ${datetime[1]}`
    },
    init_masks() {
      this.schema.forEach(row => {
        if (!row.fields) return true
        row.fields.forEach(field => {
          if (!field.mask || !field.name) return true
          if (this.inited_masks[field.name]) return true

          let v = this.get_by_name(this.data, field.name)
          let mask = mask_object(field.mask)
          if (!v || !mask || !mask.init || !v.toString().length) return true

          this.set_mask_inited(field.name)
          this.set_by_name(this.data, field.name, mask.init(v))
        })
      })

      return ''
    }
  },

  created() {
    // Set select & select-ajax field options on load
    if (this.view) {
      setTimeout(() => {
        this.prepareSelectAjax()
      }, 100)
    }
  },
  methods: {
    prepareSelectAjax() {
      this.$nextTick(() => {
        this.schema.forEach((row, row_index) => {
          row.fields.forEach((field, field_index) => {
            if (this.In(field.type, ['select', 'select-ajax']) && typeof field.options == typeof (() => {})) {
              this.$set(this.promises, field.name + '-' + row_index + '-' + field_index, '')

              let selected = ''
              const options = []

              field.options('', {}, '').then(result => {
                result.forEach(element => {
                  options.push({ ...element })
                })

                let test = options.filter(option => option.value == this.data[field.name])
                if (test && test[0] && test[0].name) selected = test[0].name

                this.$set(this.promises, field.name + '-' + row_index + '-' + field_index, selected)
              })
              // .catch(() => {
              //   this.$set(
              //     this.promises,
              //     field.name + '-' + row_index + '-' + field_index,
              //     '' // Error msg in field
              //   )
              // })
            }
          })
        })
      })
    },
    set_mask_inited(name) {
      this.inited_masks[name] = true
    },
    row_class(row) {
      let inp_class = row.class ? row.class + ' ' : ''
      inp_class += 'form-row'

      return inp_class.trim()
    },
    group_class(field) {
      let inp_class = 'form-group form-space input-'+this.final_field_type_parsed(field)+' '
      if (this.In(field.type, ['checkbox', 'radio'])) inp_class += 'form-check '
      if (field.inline) inp_class += 'form-check-inline '
      if (field.parent && field.parent.class) inp_class += field.parent.class + ' '
      else if (this.notIn(field.type, ['checkbox', 'radio', 'button', 'submit'])) inp_class += 'col-md-3'

      return inp_class.trim()
    },

    getSelectCompleteFieldValue(field, data) {
      let value = ''
      try {
        value = field.value(data)
      } catch (e) {
        // prevent errors from ajax that still loading
      }

      return value
    },

    // return some field type as another field type
    final_field_type_parsed(field) {
      if (this.In(field.type, ['select', 'select-ajax'])) {
        if (typeof field.options == typeof (() => {})) {
          return 'select-ajax'
        }
        return 'select'
      }
      return field.type
    },

    // return the selected option from the field.options array
    select_options_parsed(promise_or_options, value) {
      let selected = ''

      const options = promise_or_options
      let test = options.filter(option => option.value == value)
      if (test && test[0] && test[0].name) selected = test[0].name
      return selected
    },
    submit() {
      if (!this._events || !this._events.submit || !this._events.submit[0]) return false

      const data = cloneDeep(this.data)

      // Get the mask parsers and convert everything that has a parser
      const masks = {}
      this.schema.forEach(row => {
        if (!row.fields) return true
        row.fields.forEach(field => {
          if (!field.mask || !field.name) return true
          let v = this.get_by_name(data, field.name)
          let mask = mask_object(field.mask)

          if (!v || !mask || !v.length) return true
          masks[field.name] = { value: v, mask: mask }
        })
      })

      Object.keys(masks).forEach(name => {
        let v = masks[name]
        if (!v.mask.parser) return true
        this.set_by_name(data, name, v.mask.parser(v.value))
      })

      let errors_empty = this.objectEmpty(this.mixin_validate())
      if (this.validate) this.validate(data, this.errors)
      if (errors_empty) this._events.submit[0](data, this.errors)
    },
    set(name, obj, schema) {
      // the value object is the store for this set, it is reflected in the form when updated
      this.field_set.value[name] = obj

      // the schema of this object is a form fields object
      this.field_set.schema[name] = cloneDeep(schema)

      // the current index of this set, increased when add is called
      this.field_set.index[name] = 0

      // clone the real data object into the set data object to be used later
      this.field_set.data[name] = cloneDeep(Array.isArray(this.data[name]) ? this.data[name][0] : this.data[name])

      // make the field_set.data null so the new objects gonna be empty when added
      if (this.field_set.data[name]) {
        Object.keys(this.field_set.data[name]).forEach(e => {
          this.field_set.data[name][e] = null
        })
      }

      // remove empty fields used for setting the form fields
      if (Array.isArray(this.data[name]) && this.data[name].length == 1) {
        this.data[name].forEach((e, i) => {
          let allEmpty = true
          Object.keys(e).forEach(ee => {
            if (e[ee]) allEmpty = false
          })
          if (allEmpty) this.$delete(this.data[name], i)
        })
      }

      // loop to generate the fields based on real data
      Object.keys(this.data).forEach(e => {
        // for array real data objects
        if (Array.isArray(this.data[e])) {
          // generate fake fields for view mode
          if (this.view) {
            this.data[e].forEach((ee, i) => {
              Object.keys(ee).forEach(eee => {
                this.$set(this.data, `${name}[${i}][${eee}]`, ee[eee])
              })
            })
          }

          // add fields according to the real data[name] length
          for (let i = 0; i < this.data[e].length; i++) this.add(name, false)
          return
        }

        // for object real data objects (not array)
        if (typeof this.data[e] == 'object') {
          // generate fake fields for view mode
          if (this.view) {
            Object.keys(this.data[e]).forEach(ee => {
              this.$set(this.data, `${e}[${ee}]`, this.data[e][ee])
            })
          }
          return
        }
      }) // end loop
    },
    add(name, empty = true) {
      // increment the set.index so it never gets repeated and match the real data index
      const index = this.field_set.index[name]++
      const field_name = `${name}[${index}]`

      // clone the schema so it does not reflect in next adds
      const schema = cloneDeep(this.field_set.schema[name])
      if (!schema || !schema.fields) return false

      // set the schema names according to the main field name
      schema.fields.forEach(e => {
        e.index = index
        if (!e.name) return true
        e.name = `${field_name}[${e.name}]`
      })

      // add the schema into the value (that gonna be reflected in the form)
      this.field_set.value[name].push({ ...schema })

      // if empty it gona push an set.data into the current real data so it match the value index
      // if not empty it means there's already data loaded into the real data so just add the schema into set.value
      // the added field gonna get the values automatically based in the field index
      if (empty) this.$set(this.data[name], index, cloneDeep(this.field_set.data[name]))

      this.update_required()

      return index
    },
    remove(name, index) {
      // set the object to empty instead of deleting, deleting would reorder the array and generate empty fields
      this.$set(this.data[name], index, {})
      this.$set(this.field_set.value[name], index, {})
      this.update_required()

      return index
    },
    error(name, message = '') {
      this.set_by_name(this.rejects, name, true)
      this.set_by_name(this.errors, name, message)
    },
    reject(name, message = '') {
      this.error(name, message)
    },
    resolve(name) {
      this.$delete(this.rejects, name)
      this.$delete(this.errors, name)
    }
  }
}
</script>
<style src="./style.css"></style>
