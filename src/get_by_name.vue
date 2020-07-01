<script>
export default {
  methods: {
    get_by_name(data, name) {
      let found = []
      let rxp = /\[([^\]]+)\]/g
      let curMatch = ''

      while ((curMatch = rxp.exec(name))) found.push(curMatch[1])
      if (found.length) {
        found = [name.split('[')[0], ...found]

        let _break = false
        found.forEach(e => {
          if (_break) return true
          if (!data[[e]]) {
            _break = true
            return true
          }
          data = data[[e]]
        })

        if (typeof data === 'object' && !Array.isArray(data)) {
          return ''
        }
        return data
      }

      return data[name]
    }
  }
}
</script>
