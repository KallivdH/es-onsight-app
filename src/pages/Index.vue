<template>
  <q-page class="q-pa-md">
    <h4 class="q-my-sm">Volgende training</h4>
    <q-btn color="primary" icon="check" label="TRAINING GROEPEN" @click="routeClick('groepen')" />
  </q-page>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      days: []
    }
  },
  methods: {
    routeClick (routePath) {
      this.$router.push({ path: routePath })
    }
  },
  created () {
    var cDay = new Date().getDay()
    this.$db.collection('users').doc(this.$fb.auth().currentUser.uid).get().then((doc) => {
      // var d = new Date()
      doc.data().groups.forEach(async group => {
        group.get().then((doc) => {
          if (cDay <= doc.data().day) {
            this.days.push(doc.data().day)
          }
          /* if (doc.data().day >= currentDate.getDay()) {
            d.setDate(d.getDate() + (doc.data().day + 7 - d.getDay()) % 7)
            console.log(d)
            getData = true
          } */
        })
      }).then(() => {})
    })
  },
  watch: {
    days () {
      let nextTraining = Math.min(this.days)
      console.log(this.days + ' => ' + nextTraining)
    }
  }
}
</script>
<style>
</style>
