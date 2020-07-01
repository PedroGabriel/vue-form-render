<script>
export default {
  computed: {
    auto_events() {
      const filtered = Object.keys(this.field)
        .filter(key => !this.custom_events.includes(key))
        .reduce((obj, key) => {
          obj[key] = this.field[key]
          return obj
        }, {})

      return filtered
    }
  }
}
</script>
