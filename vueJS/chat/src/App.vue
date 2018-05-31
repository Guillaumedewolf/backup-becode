<template>

  <b-container id="body" fluid class="w-100">
    <button id="connexionCSS" v-if="etatConnexion == false" @click="signInGoogle">Sign in with Google</button>
    <div id="menuBarre" v-if="etatConnexion == true">menu barre</div>
    <b-row>
      <b-col cols="1" id="sectionsCSS">
        <div>
          <button v-if="etatConnexion == true" @click="signOutButton">Log out</button>
        </div>
        
        <ul id="buttonSectionListe" class="buttonRubrique" v-if="etatConnexion == true">
            

            <li>
              <div  :class="{selection:rubrique == 'global'}" id="globalCSS" @click="rubrique = 'global'"><div :class="{newCSS:newGlobal}"></div></div>
            </li>
            <li>
              <div  :class="{selection:rubrique == 'prive'}" id="priveCSS" @click="rubrique = 'prive'"><div :class="{newCSS:newPrive}"></div></div>
            </li>
            <li>
              <div  :class="{selection:rubrique == 'perso'}" id="persoCSS" @click="rubrique = 'perso'"><div :class="{newCSS:newPerso}"></div></div>
            </li>
        </ul>
      </b-col>
      <b-col cols="8">
        <listeChat :typeSectionProps='rubrique' :notificationVu="notificationVu" v-if="etatConnexion == true"/>
      </b-col>
      <b-col cols="3" v-if="etatConnexion == true">
        <actifs v-if="etatConnexion == true"/>
      </b-col> 
    </b-row>
  </b-container>
 
</template>

<script>

import firebase from 'firebase'
import listeChat from './components/listeChat'
import actifs from './components/actifs'
import { db } from './main'







export default {
  name: 'App',
  components: {
    
    listeChat,
    actifs,
   

    
   
  },

  data () {
  return{
    user: null,
    Connexion: this.etatConnexion,
    rubrique: 'global',
    newGlobal: false,
    newPrive: false,
    newPerso: false,
    notificationVu: [],
    coucou:'salut google.be',
    iconConfig: {
      placement: 'top',
      size: '30px',
      name: 'fa-send', // font awesome icon name
      color: '#fff' // icon color: hex、rgb or rgba value
  },
    val:''

    
    
  }
    
    

},





methods: {


signInGoogle (){
        const provider = new firebase.auth.GoogleAuthProvider()
        firebase.auth().signInWithPopup(provider).then((result) => {
          this.etatConnexion = true
          this.notification()
          this.checkChange ()

          // si new membres
          db.collection('users').doc(firebase.auth().currentUser.uid).get().then(doc => {
              if (doc.exists) {
                   db.collection('users').doc(firebase.auth().currentUser.uid).set({
                    nom: firebase.auth().currentUser.displayName}, { merge: true })
                  .then(() => {
                    this.notification ()
                  }).catch(function(error) {
                    console.error("Error writing document: ", error);
                  });
              } else {
                  //recup user
                  var membresGlobal = {}
                  db.collection("users").get()
                  .then(querySnapshot => {
                    querySnapshot.forEach(doc => {
                        membresGlobal[doc.id] = true
                    });
                  })


                  //ajout dans global
                  db.collection("sections").where("type", "==", "global")
                  .get()
                  .then(querySnapshot => {
                      querySnapshot.forEach(doc => {
                        db.collection("sections").doc(doc.id).update({membres: membresGlobal})
                      });
                  })
                  .catch(function(error) {
                      console.log("Error getting documents: ", error);
                  });





                  db.collection('users').doc(firebase.auth().currentUser.uid).set({
                    nom: firebase.auth().currentUser.displayName}, { merge: true })
                  .then(() => {
                    this.notification ()
                  }).catch(function(error) {
                    console.error("Error writing document: ", error);
                  });
                   
                   
                }
          })

          this.userName = firebase.auth().currentUser.displayName

          })
          



    },
    signOutButton () {
      firebase.auth().signOut().then(function() {
        // Sign-out successful.
      }).catch(function(error) {
        // An error happened.
      });
       this.etatConnexion = false
        

        
        
      },

     notification () {
        var idUser = firebase.auth().currentUser.uid
        db.collection("sections").where("membres." + idUser, "==", true )
        .get()
        .then(querySnapshot => { 
          this.notificationVu = []
          querySnapshot.forEach(doc => {
              if(doc.data().vu[idUser] != true || doc.data().vu[idUser] == undefined){
                var infoSection = [doc.id,doc.data().type]
                this.notificationVu.push(infoSection)
              }
            

            });
            console.log("noti",this.notificationVu);
            this.newGlobal = false
            this.newPrive = false
            this.newPerso = false
            // afficher modif
            for (var i = this.notificationVu.length - 1; i >= 0; i--) {
              if(this.notificationVu[i][1] == 'global'){
                this.newGlobal = true
              }
              else if(this.notificationVu[i][1] == 'prive'){
                this.newPrive = true
              }
              else if(this.notificationVu[i][1] == 'perso'){
                this.newPerso = true
              }





            }
              
               
              
              
            





        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
         },


         //change

         checkChange () {
          db.collection("sections")
          .onSnapshot(snapshot => {
              snapshot.docChanges.forEach(change => {
                      if(change.type === "modified"){
                        this.notification ()
                    }
                  
                 

              });
    });




         },
         addEmoji () {
          console.log("addEmoji");
         }
},

created () {
  document.addEventListener('beforeunload', this.signOutButton)
  
},

updated () {
  this.user = this.userName
  // ajout de user





  

          
          
}


}




</script>

<style>
#body{
    height: 100vh;
    margin:0 auto;
    padding: 0;
    color:#187074;
    background-color: #0D181E;
    overflow:hidden;
    font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
}

#connexionCSS{
  margin: 0 auto;
  position: absolute;
  width: 100px;
  left:calc(50% - 50px);
  top:calc(50% - 50px);
  z-index: 1000


}


#menuBarre{
  height: 10vh;
  background-color: #060E11;
}
.newCSS {
  height: 15px;
  width: 15px;
  background-color: orange;
  position: absolute;
  left: 80%;
  border-radius: 50%;
}
#sectionsCSS{
  float: left;
 
  height: 90vh;
  
}
#buttonSectionListe{
  list-style: none;
  margin-top: 30px;
}
.buttonRubrique>li>div{
  border-radius: 15px;
  width: 50px;
  height: 50px;
  margin-top: 10px;
  margin-bottom: 10px;
  cursor:pointer;
}
.buttonRubrique>li>div:hover{
  filter: grayscale(100%);
}

.selection{
  filter: grayscale(100%);
}


#globalCSS{
  background-image: url('assets/icons/conference.png');
}
#priveCSS{
  background-image: url('assets/icons/group.png');
}
#persoCSS{
  background-image: url('assets/icons/friends.png');
}
</style>
