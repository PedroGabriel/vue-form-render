<script>
import get_by_name from './get_by_name'
import set_by_name from './set_by_name'

export default {
  mixins: [get_by_name, set_by_name],
  computed: {
    field_value: {
      get: function() {
        return this.get_by_name(this.data, this.field.name)
      },
      set: function(newValue) {
        this.set_by_name(this.data, this.field.name, newValue)
      }
    }
  }
}
</script>
