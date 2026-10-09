window.globalRanking={
 configured:false,ready:null,
 async init(){
  if(new URLSearchParams(location.search).get("ranking")==="local")return null;
  const config=window.BOB_FIREBASE_CONFIG;
  if(!config?.apiKey||!config?.projectId||!config?.appId)return null;
  this.configured=true;
  this.ready=(async()=>{
   const [app,auth,db]=await Promise.all([import('https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js'),import('https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js'),import('https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js')]);
   const instance=app.getApps().find(a=>a.name==='bob-roll-contra-lixo')||app.initializeApp(config,'bob-roll-contra-lixo'),identity=auth.getAuth(instance);await identity.authStateReady();if(!identity.currentUser)await auth.signInAnonymously(identity);
   this.sdk=db;this.db=db.getFirestore(instance);this.uid=identity.currentUser.uid;return this;
  })();return this.ready;
 },
 async read(){await this.ready;const f=this.sdk;const result=await f.getDocs(f.query(f.collection(this.db,'ranking_bob_roll_contra_lixo'),f.orderBy('score','desc'),f.orderBy('seconds','asc'),f.limit(10)));return result.docs.map(d=>d.data());},
 async save(row,id){await this.ready;const f=this.sdk;await f.setDoc(f.doc(this.db,'ranking_bob_roll_contra_lixo',id),{...row,uid:this.uid,createdAt:f.serverTimestamp()});}
};
