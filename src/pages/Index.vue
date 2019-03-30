<template>
  <q-page class="q-pa-md">
    <h4 class="q-my-sm">Volgende training</h4>
    <q-card flat bordered class="my-card q-mb-sm" style="max-width: 300px;">
      <q-card-section>
        <div class="text-h6">{{ name }}</div>
      </q-card-section>

      <q-separator inset />

      <q-card-section>
        <p>{{ date }}</p>
      </q-card-section>

      <q-card-actions>
        <q-btn-toggle
          v-model="model"
          toggle-color="primary"
          :options="[
            {label: 'Aanwezig', value: 'true'},
            {label: 'Afwezig', value: 'false'},
          ]"
      />
      </q-card-actions>

    </q-card>
    <q-btn color="primary" icon="check" label="TRAINING GROEPEN" @click="routeClick('groepen')" />
  </q-page>
</template>

<script>
export default {
  name: 'Home',

  data () {
    return {
      model: null,
      name: null,
      date: null,
      moment: require('moment')
    }
  },

  created () {
    this.moment.locale('nl')
    this.$db.collection('users').doc(this.$fb.auth().currentUser.uid).get().then((doc) => {
      let daysDiff = []
      doc.data().groups.forEach(group => {
        group.get().then((doc) => {
          let date = this.moment(doc.data().date.toDate())
          if (date.isSameOrAfter(new Date(this.moment()))) {
            daysDiff.push({ diff: date.day() - this.moment().day(), date: date.format('dddd D MMMM HH:mm'), name: doc.data().name })
            daysDiff.sort((a, b) => (a.diff > b.diff) ? 1 : -1)
            this.date = daysDiff[0].date
            this.name = daysDiff[0].name
          }
        })
      })
    })
  },
  methods: {
    routeClick (routePath) {
      this.$router.push({ path: routePath })
    }
  }
}
</script>
<style>
</style>
