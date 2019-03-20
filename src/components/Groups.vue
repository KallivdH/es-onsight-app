<template>
  <div class="q-pa-md">
    <h1>Trainings Groepen</h1>
    <br>
    <div class="row">
      <q-card class="q-ma-sm col" :key="group.id" v-for="group in groups">
        <q-card-section>
          <h6 class="q-ma-none">{{ group.name }}</h6>
          <q-btn color="primary absolute-right q-ma-sm" round icon="edit"></q-btn>
        </q-card-section>
        <q-separator/>
        <q-card-section>
          Dag: {{ group.day }}
        </q-card-section>
        <q-card-section>
          Tijd: {{ group.time }}
        </q-card-section>
        <q-card-section>
          Klimmers: {{ group.time }}
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Groepen',
  data () {
    return {
      groups: []
    }
  },
  created () {
    this.$db.collection('groups').get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        this.groups.push(doc.data())
      })
    })
  }
}
</script>

<style>
</style>
