<template>
  <div class="q-pa-md">
    <h4 class="q-my-none">Welkom   {{ this.user.displayName }}</h4>
    <p class="text-body1 q-mt-sm q-ml-sm">
      Uw acount is <template v-if="!this.user.emailVerified">niet</template> geverifieerd
      <span v-if="!this.user.emailVerified">
        <q-btn color="primary" label="STUUR VERIFICATIE EMAIL" @click="sendVerification" />
      </span>
    </p>

    <section class="q-mt-md" style="max-width: 500px">
      <form class="">
        <p class="text-h6">Bewerk profiel informatie</p>
        <fieldset class="flex row">
          <q-input
            label="Volledige naam"
            type="text"
            v-model="fullName"
          ></q-input>
          <q-input
            label="E-mail"
            type="email"
            v-model="email"
          ></q-input>
          <div class="flex justify-start q-mt-md">
            <q-btn
              color="primary"
              label="Opslaan"
              :loading="loading"
              @click="editUserInfo"
            >
              <template v-slot:loading>
                <q-spinner-gears></q-spinner-gears>
              </template>
            </q-btn>
          </div>
        </fieldset>
      </form>
    </section>

    <h4>Trainings groepen waar jij in zit</h4>
    <br>
    <div class="row">
      <q-card class="q-ma-sm col" :key="group.id" v-for="group in groups">
        <q-card-section>
          <h6 class="q-ma-none">{{ group.name }}</h6>
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
  name: 'Dashboard',
  data () {
    return {
      loading: false,
      user: this.$fb.auth().currentUser,
      fullName: '',
      email: '',
      groups: []
    }
  },
  created () {
    if (this.user != null) {
      this.fullName = this.user.displayName
      this.email = this.user.email
    }
    this.$db.collection('users').doc(this.user.uid).get().then((doc) => {
      doc.data().groups.forEach(group => {
        group.get().then((doc) => {
          this.groups.push(doc.data())
        })
      })
    })
  },
  methods: {
    editUserInfo () {
      this.user.updateProfile({
        displayName: this.fullName
      }).then(this.user.updateEmail(this.email)).then(() => {
        this.$db.collection('users').doc(this.user.uid).update({
          displayName: this.fullName
        })
      }).then(() => {
        this.$q.notify({
          classes: 'text-weight-bold text-center',
          color: 'positive',
          message: `Het profiel is bewerkt`
        })
      }).catch((error) => {
        this.$q.notify({
          classes: 'text-weight-bold text-center',
          color: 'negative',
          message: `Het lijkt er op dat er een fout is opgetreden: ${error.message}`
        })
        this.loading = false
      })
    },
    sendVerification () {
      this.user.sendEmailVerification().then(() => {
        this.$q.notify({
          classes: 'text-weight-bold text-center',
          color: 'positive',
          message: `Verificatie verzonden`
        })
      }).cath((error) => {
        this.$q.notify({
          classes: 'text-weight-bold text-center',
          color: 'negative',
          message: error
        })
      })
    }
  }
}
</script>

<style>
</style>
