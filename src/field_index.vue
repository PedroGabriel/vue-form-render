<script>
export default {
  computed: {
    field_index() {
      return typeof this.field.index == 'number' ? this.field.index : ''
    }
  }
}
</script>
