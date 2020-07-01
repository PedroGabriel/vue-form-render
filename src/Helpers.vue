<script>
export default {
  methods: {
    notIn(field, list) {
      return !list.includes(field)
    },
    In(field, list) {
      return list.includes(field)
    },
    objectEmpty(obj = {}) {
      return Object.keys(obj).length === 0 && obj.constructor === Object
    }
  }
}
</script>
