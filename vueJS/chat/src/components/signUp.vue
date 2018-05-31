<!-- zone envois message -->
<!-- ===================== template ===================== -->
<template>
	<div>
		<button v-if="etatConnexion == false" @click="signInGoogle">Sign in with Google</button>
		<button v-if="etatConnexion == true" @click="signOutButton">deco</button>
		<button  @click="userCheck" >user</button>
	</div>
	
</template>

<!-- ====================== script ========================== -->

<script>
import firebase from 'firebase'
import { db } from '../main'


export default { 

name: 'signUp',

data () {
	return{
		loading: true,
      	user: null,
      	Connexion : this.etatConnexion
		
	}
		
		

},
methods: {

	signInGoogle (){
		        const provider = new firebase.auth.GoogleAuthProvider()
        firebase.auth().signInWithPopup(provider).then((result) => {
          this.user = result.user
          this.etatConnexion = true
          this.Connexion = this.etatConnexion
          console.log(this.etatConnexion);

          
		  
        }).catch(err => console.log(error))


	},
	
	

      userCheck () {
      	console.log(firebase.auth().currentUser.displayName, this.user, this.Connexion)

      },

      signOutButton () {
        firebase.auth().signOut().then(() => {
          this.etatConnexion = false
        this.user = ''
        }).catch(err => console.log(error))
        
      }


},

created () {
  if(firebase.auth().currentUser != null){
    this.etatConnexion = true
    this.Connexion = this.etatConnexion

  }
  else {
    this.etatConnexion = false
    this.Connexion = this.etatConnexion
  }
},

updated () {
  if(firebase.auth().currentUser != null){
    this.etatConnexion = true
    this.Connexion = this.etatConnexion
    }
    else {
    this.etatConnexion = false
    this.Connexion = this.etatConnexion
  }
}







}






</script>

<!-- ====================== CSS ========================== -->

<style>


</style>