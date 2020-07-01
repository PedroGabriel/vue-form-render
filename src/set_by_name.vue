<script>
export default {
  methods: {
    set_by_name(data, name, value) {
      let found = []
      let rxp = /\[([^\]]+)\]/g
      let curMatch = ''
      let last = ''

      while ((curMatch = rxp.exec(name))) found.push(curMatch[1])
      if (found.length) {
        found = [name.split('[')[0], ...found]
        last = found.pop()

        found.forEach(e => {
          if (!data[e]) this.$set(data, e, {})
          data = data[e]
        })

        if (typeof data == 'object') this.$set(data, last, value)
        return
      }

      this.$set(data, name, value)
    }
  }
}
</script>
