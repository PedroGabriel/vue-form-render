<script>
import Helpers from './Helpers'
import get_by_name from './get_by_name'
import set_by_name from './set_by_name'
import delete_by_name from './delete_by_name'

export default {
  mixins: [Helpers, get_by_name, set_by_name, delete_by_name],
  created() {
    this.update_required()
  },
  methods: {
    // test the value using only negations, return message if error
    predefined_validators(type, value) {
      const validators = {
        cpf: value => {
          if (!value) return 'CPF inválido'
        },
        cnpj: value => {
          if (!value) return 'CNPJ inválido'
        },
        numeric: value => {
          if (!value) return 'O valor deve ser numérico'
        }
      }
      return validators[type] ? validators[type](value) : true
    },
    update_required() {
      this.$nextTick(() => {
        this.required = {}
        this.schema.forEach(row => {
          if (!row.fields) return
          row.fields.forEach(field => {
            if (!field.required) return
            this.$set(this.required, field.name, field.required)
          })
        })
      })
    },
    mixin_validate() {
      this.update_required()

      Object.keys(this.data).forEach(name => {
        if (!this.rejects[name] && this.errors[name]) {
          this.delete_by_name(this.errors, name)
        }
      })

      Object.keys(this.required).forEach(name => {
        let rule = this.required[name]
        let value = this.get_by_name(this.data, name)

        if (rule) {
          if (!value || !value.toString().trim().length) {
            this.set_by_name(this.errors, name, 'Este campo é obrigatório')
            return false
          }

          value = value.toString().trim()

          if (
            typeof rule == 'string' &&
            rule.toString().toLowerCase() != 'true'
          ) {
            let field_validation = this.predefined_validators(rule, value)
            if (field_validation) {
              this.set_by_name(this.errors, name, field_validation)
              return false
            }
          } else if (rule instanceof RegExp && !rule.test(value)) {
            this.set_by_name(this.errors, name, 'O campo está fora das regras')
            return false
          }
        }
      })

      return this.errors
    }
  }
}
</script>
