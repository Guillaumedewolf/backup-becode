<!-- zone affichage message -->
<!-- ===================== template ===================== -->
<template>
	<div class="actifsCSS">
		<div class="actifs" v-for="actif in actifs">
			<div class="online" v-if="actif[1] == 'online'">
				<span>On </span>{{actif[0]}}
			</div>
			<div class="offline" v-else>
				<span>Off </span>{{actif[0]}}
			</div>
			
		</div>
	</div>
</template>

<!-- ====================== script ========================== -->

<script>

import { db } from '../main'
import { dbRef } from '../main'
import firebase from 'firebase'


export default { 

name: 'actifs',

data () {
	return	{
		
		actifs: ['actifs']
		
	}
},

methods: {
	Actifs () {
	var uid = firebase.auth().currentUser.uid;
    var userStatusDatabaseRef = dbRef.ref('/status/' + uid);

    var isOfflineForDatabase = {
        state: 'offline',
        last_changed: firebase.database.ServerValue.TIMESTAMP,
    };

    var isOnlineForDatabase = {
        state: 'online',
        last_changed: firebase.database.ServerValue.TIMESTAMP,
    };

    // [END_EXCLUDE]
    var userStatusFirestoreRef = db.doc('users/' + uid);

    // Firestore uses a different server timestamp value, so we'll 
    // create two more constants for Firestore state.
    var isOfflineForFirestore = {
        state: 'offline',
        last_changed: firebase.firestore.FieldValue.serverTimestamp(),
    };

    var isOnlineForFirestore = {
        state: 'online',
        last_changed: firebase.firestore.FieldValue.serverTimestamp(),
    };

    dbRef.ref('.info/connected').on('value', snapshot => {
        if (snapshot.val() == false) {
            // Instead of simply returning, we'll also set Firestore's state
            // to 'offline'. This ensures that our Firestore cache is aware
            // of the switch to 'offline.'
            userStatusFirestoreRef.set(isOfflineForFirestore, {merge: true});
            return;
        };

        userStatusDatabaseRef.onDisconnect().set(isOfflineForDatabase).then(() => {
            userStatusDatabaseRef.set(isOnlineForDatabase);

            // We'll also add Firestore set here for when we come online.
            userStatusFirestoreRef.set(isOnlineForFirestore, {merge: true});
        });
});




		},
		afficherActifs(){
			db.collection("users")
    		.onSnapshot(querySnapshot => {
		        this.actifs = [];
		        querySnapshot.forEach(doc => {
		        	var infoActifs = [doc.data().nom, doc.data().state]
		            this.actifs.push(infoActifs);
		        });
    			});

    		

		}
},

created (){
	this.Actifs()
	this.afficherActifs()
	
}




}




</script>

<!-- ====================== CSS ========================== -->

<style>
	.actifsCSS {
		position: absolute;
	}
</style>