<script>
export default {
  methods: {
    delete_by_name(data, name) {
      let found = []
      let rxp = /\[([^\]]+)\]/g
      let last = ''
      let curMatch = ''

      while ((curMatch = rxp.exec(name))) found.push(curMatch[1])
      if (found.length) {
        found = [name.split('[')[0], ...found]
        last = found.pop()

        found.forEach(e => {
          if (!data[e]) this.$set(data, e, {})
          data = data[e]
        })

        if (typeof data == 'object') this.$delete(data, last)
        return
      }

      this.$delete(data, name)
    }
  }
}
</script>
