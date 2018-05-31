<!-- zone affichage message + input-->
<!-- ===================== template ===================== -->
<template>
	<div id="chatbox" @keyup.enter="envois">
		<div id="tchat">

			<button @click="ancienMessageAfficher">ancien message</button>
			<button v-if="listeMessagesLongueur > 30" @click="ancienMessageSupprimer">moins</button>
			<ul class="listeMessage" id="scroll">
				<li id="messageCSS" v-for="message in listeMessages" >

					<div v-if="message[1] == user" class="messageMoi">
						<b class="userCSS">moi</b>
						<span>
							<div v-html="message[0]" v-linkified />
						</span>
					</div>

					<div v-else class="messageAutre">
						<b class="userCSS">{{ message[1] }}</b>
						<span >
							<div v-html="message[0]" v-linkified />
						</span>
					</div>
				</li>
			</ul>
		</div>
		<div class="envoyerCSS">
			<picker id="picker" v-if="pickerEmoji == true" @select="addEmoji" emoji="point_up" title="Pick your emoji…" set="emojione" :style="{ position: 'absolute', bottom: '8vh', left: '70px' }" :i18n="{ search: 'Recherche', categories: { search: 'Résultats de recherche', recent: 'Récents' } }"/>

			<div id="fileUpload" v-if="files != 'vide'">
				{{files.name}} <span id="suppFile" @click="files = 'vide'">x</span>
				<span id="progressBar" class="progress" v-if="progressUpload != 0">
					<div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" :aria-valuenow="progressUpload" aria-valuemin="0" aria-valuemax="100"  :style="progressUpload"></div>
				</span>  
			</div>

			<label for="file" id="label-file"></label>
			<input id="file" class="input-file" type="file" @change="uploadFichier($event)">
			<img src="../assets/icons/emote.png" alt="" @click="pickerEmojiToggle">
			<input type="text" v-model="messageEnvoyer" id="inputMessage">
			<img src="../assets/icons/paperplane.png" alt="" @click = "envois">
		</div>
	</div>
</template>

<!-- ====================== script ========================== -->

<script>

import { db } from '../main'
import { storage } from '../main'
import firebase from 'firebase'
import { Picker } from 'emoji-mart-vue'
import { Emoji } from 'emoji-mart-vue'
import { emojiConvertor } from '../main'






export default { 

name: 'chatBox',
props: ['sectionActive'],
components: {
	Picker,
	Emoji
},

data () {
	return	{
		listeMessages: [],
		listeMessagesLongueur: 0,
		limitMessage : 20,
		user: '',
		messageEnvoyer: '',
		listeMembres: [],
		pickerEmoji: false,
		files:'vide',
		filesBlob:'',
		progressUpload:0,
		emojioulala: '',
		scrolled: false,
		unsubscribe: ''
		
		
	}
},

methods: {
	afficherMessage () {
		


		var expediteur = ''
		 this.unsubscribe = db.collection('sections/' + this.sectionActive + '/messages').orderBy("envois", "desc").limit(this.limitMessage).onSnapshot(querySnapshot => {

			this.listeMessages = []
        querySnapshot.forEach(doc => {

        	//emoji convertor
        	var textConvert = this.emojiCompile(doc.data().text)
        	var infoMsg = [textConvert,doc.data().expediteur]
        	
        	//normal
        	//var infoMsg = [doc.data().text,doc.data().expediteur]

           this.listeMessages.push(infoMsg)
        });

        this.listeMessages.reverse()
        this.listeMessagesLongueur = this.listeMessages.length
        this.updateScroll()
        
        //======== vu =============

        //recup vu
        db.collection('sections').doc(this.sectionActive).get().then(doc => {
   			if (doc.exists) {	
   					var listeMembres = {}
   					listeMembres = doc.data().vu
   					//modif vu
   						var idUser = firebase.auth().currentUser.uid
				        listeMembres[idUser] = true
				        db.collection('sections').doc(this.sectionActive).update({
							vu: listeMembres
						})	
    	}
		})


        
    });
},
ancienMessageAfficher(){
	this.limitMessage += 10
	this.afficherMessage()
	
},
ancienMessageSupprimer(){
	this.limitMessage += -10
	this.afficherMessage()
	
	
},

envois () {
	//notification
		// this.recuperationMembres(true)
					var idUser = firebase.auth().currentUser.uid
					var listeMembres = {}
			        listeMembres[idUser] = true
			        db.collection('sections').doc(this.sectionActive).update({
						vu: listeMembres
					})


	if(this.messageEnvoyer != ''){
		// emoji creation avant envois db
		// this.messageEnvoyer = this.emojiCompile(this.messageEnvoyer)
		db.collection('sections/' + this.sectionActive + '/messages').add({
		    envois: new Date,
		    text: this.messageEnvoyer,
		    expediteur: firebase.auth().currentUser.displayName
		})
		.then(function(docRef) {
		    console.log("Document written with ID: ", docRef.id);
		})
		.catch(function(error) {
		    console.error("Error adding document: ", error);
		});
		this.messageEnvoyer = ''


	}

	if(this.files != 'vide'){
			this.envoisFichier()
	}
		




},

	recuperationMembres(envois) {
		this.listeMembres = {}
		var docRef = db.collection("sections").doc(this.sectionActive);

			docRef.get().then(doc => {

			    if (doc.exists) {
			        
			    	
			        if(doc.data().membres != undefined){
			        	this.listeMembres = []

			        	// for(var membre in doc.data().membres){
			        	// 	console.log(membre);
			        	// this.listeMembres[membre] = false;

			        // }
			        	


			        }

			        else {
			        	db.collection("users").get()
						    .then(querySnapshot => {
						    	var membresGlobal ={}
						        querySnapshot.forEach(doc => {
						            membresGlobal[doc.id] = true
						        });
						        db.collection("sections").doc(this.sectionActive).update({membres: membresGlobal})
						        this.listeMembres = membresGlobal
						        console.log("ajout membres",this.listeMembres);

						    })
						    .catch(function(error) {
						        console.log("Error getting documents: ", error);
						    });

			        	
			        }


			       
			        // 	console.log(this.listeMembres);
			        // for(var membre in this.listeMembres){

			        // 	this.listeMembres[membre] = false;

			        // }
			        if(envois){
			        console.log('listeMembres', this.listeMembres);
			        var idUser = firebase.auth().currentUser.uid
			        this.listeMembres[idUser] = true
			        db.collection('sections').doc(this.sectionActive).update({
						vu: this.listeMembres
					})
			        }
			        


			       





			    } else {
			        // doc.data() will be undefined in this case
			        console.log("No such document!", this.sectionActive);

			    }
			}).catch(error => {
			    console.log("Error getting document:", error);
			});
	},
	addEmoji(emojiObject){
		this.messageEnvoyer += emojiObject.colons
		this.pickerEmoji = false
	},

	pickerEmojiToggle(){
		this.pickerEmoji = !this.pickerEmoji
	},

	drawEmoji (text) {
		return text.replace(/(:.*?:)/g,'<emoji emoji="$1" :size="32" />')
	},

	uploadFichier(event){
		// taille max 50000
		console.log(event.target.files[0]);
    	// this.files.push(event.target.files[0])


    	var file = event.target.files[0]
    	if(file.size < 100000000){
    		this.files = file
    	}
    	

	
	},
	envoisFichier(){
		// File or Blob named mountains.jpg
		var file = this.files

		// Create the file metadata
		var metadata = {
		  contentType: file.type
		};

		// Upload file and metadata to the object 'images/mountains.jpg'
		var uploadTask = storage.ref().child('document' + file.name).put(file, metadata);

		// Listen for state changes, errors, and completion of the upload.
		uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
		  snapshot => {
		    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
		    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
		    console.log('Upload is ' + progress + '% done');
		    this.progressUpload = 'width:' + progress + '%'
		    switch (snapshot.state) {
		      case firebase.storage.TaskState.PAUSED: // or 'paused'
		        console.log('Upload is paused');
		        break;
		      case firebase.storage.TaskState.RUNNING: // or 'running'
		        console.log('Upload is running');
		        break;
		    }
		  }, error => {

		  // A full list of error codes is available at
		  // https://firebase.google.com/docs/storage/web/handle-errors
		  switch (error.code) {
		    case 'storage/unauthorized':
		      // User doesn't have permission to access the object
		      break;

		    case 'storage/canceled':
		      // User canceled the upload
		      break;

		    case 'storage/unknown':
		      // Unknown error occurred, inspect error.serverResponse
		      break;
		  }
		}, () => {
		  // Upload completed successfully, now we can get the download URL
		  uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
		    console.log('File available at', downloadURL);
		   	var lien = ''

		    	// check lien == img
		    	if(file.type == 'image/png' || file.type == 'image/jpg' || file.type == 'image/jpeg' || file.type == 'image/gif'){
		    		lien = lien = '<a href="'+downloadURL+'" target="_blank">'+file.name + '<br><img class="imgLienMessage" src="'+downloadURL+'" alt=""></a>'
		    	}
		    	else {
		    		lien = '<a href="'+downloadURL+'" target="_blank">'+file.name+'</a>'
		    	}


		    	//envois du lien 
		    	db.collection('sections/' + this.sectionActive + '/messages').add({
				    envois: new Date,
				    text: lien,
				    expediteur: firebase.auth().currentUser.displayName
				})
				.then(function(docRef) {
				    console.log("Document written with ID: ", docRef.id);
				})
				.catch(function(error) {
				    console.error("Error adding document: ", error);
				});
				this.messageEnvoyer = ''
				//notification
				this.recuperationMembres()
				db.collection('sections').doc(this.sectionActive).update({
					vu: this.listeMembres
				})


				this.files='vide'
				this.progressUpload = 0


		  });
		  
		});
			},

			emojiCompile(input){
				return emojiConvertor.replace_colons(input)
			},
			updateScroll(){
		    	var container = this.$el.querySelector("#tchat");
				container.scrollTop = container.scrollHeight;
		    	
}

},

created (){
	this.afficherMessage()
	this.user = firebase.auth().currentUser.displayName
	
},

watch: {
  sectionActive: function() {
  		  this.unsubscribe()
          this.afficherMessage ()


        }
  	
  
    
}



}




</script>

<!-- ====================== CSS ========================== -->

<style>
	#chatBox{
		width: 100%
	}


	#tchat {
		height: 80vh;
		width: auto;
		overflow-y: scroll;
		margin:auto;
		background-color: #1F303A;
		background-image: url('https://firebasestorage.googleapis.com/v0/b/test-chat-188d8.appspot.com/o/mascotOpacity.png?alt=media&token=18a19a01-4c57-46c2-a5bf-bee95a919f5b');
		background-repeat: no-repeat;
		background-position: center;

	}


	#messageCSS {
		padding:5px;
		width: 100%;
		list-style: none;
		color:white;
	}

	.userCSS {
	}
	.userCSS{
		color:#1C9EA0;
	}

	.envoyerCSS {
	margin: 0 auto;
	width: 100%;
	height: 10vh;
	background-color: #111B24;
	line-height: 10vh;
	display: flex;
	justify-content: space-around;
	align-items: center;
	position: relative;

}

.envoyerCSS>img{
	cursor:pointer;
	width: 57px;
    height: 57px;
}
#inputMessage{
	height: 57px;
	width: 72%;
	background-color: #2A3C48;
	border:none;
	border-radius: 12px;
	color:white; 
}
#label-file {
    cursor: pointer;
    background-image: url('../assets/icons/paperclip.png');
    width: 57px;
    height: 57px;
    margin-bottom: 0.0rem;
}


.input-file {
    display: none;
}

#fileUpload{
	position: absolute;
	left:1%;
	margin-bottom: 15vh;
	padding: 3px;
	padding-left: 15px;
	width: auto;
	height: auto;
	border:1px solid black;
	text-align: right;
	align-items: center;
	line-height: normal;
	background-color: #16222E;
	color:white;
	border-radius: 20px;

}

#progressBar{
	margin: 5px;
}

.messageMoi{
	text-align: right;
	margin: 5px;
	margin-right: 50px;

}
.messageAutre{
	margin:5px;
	margin-left: 15px;
}


#suppFile{
	cursor: pointer;
	margin-left:10px;
	margin-right:5px;
	color:red;
}
#suppFile:hover{
	color:white;
}

#picker{
	z-index: 100000
}

.imgLienMessage{
	height: 300px; 
}

.emoji-sizer {
	width:25px;
	height: 25px;
}

/*lien*/

 /* unvisited link */
a:link {
    color: #63C3D1;

}

/* visited link */
a:visited {
    color: #63C3D1;
}

/* mouse over link */
a:hover {
    color: #63C3D1;
}

/* selected link */
a:active {
    color: #63C3D1;
} 


</style>