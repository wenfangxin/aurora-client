<template>

</template>
<script>
export default {
  name:"redirect",
  created() {
    const { query} = this.$route
    this.$router.replace({
      path: query.path,
      query:JSON.parse(query.data)
    })
  },
}
</script>


