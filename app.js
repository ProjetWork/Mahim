const express = require('express')
const {getFirestore,updateDoc, doc, getDoc , setDoc} = require('firebase/firestore')
const {getAuth , createUserWithEmailAndPassword} = require('firebase/auth')
const fetch = require('node-fetch')
const {App} = require('./fi')
const { json } = require('express')
const app = express()
//server middleware

app.use(express.json())
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', req.get('Origin') || 'http://localhost:8100');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');  
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range'); 
    next()
  })
const db = getFirestore(App) 
//renouvelation des token 
app.post('/renewtoken',(req,res)=>{
    fetch('https://api.orange.com/oauth/v3/token', {
        method: 'POST',
        headers: {
            'Authorization': 'Basic bDFNZXlybTNSeGhLdmJvQVEyUHpBWFRCWHJvVTJMT2g6RXZqb3dMY1pVOHllYm5IaA==',
            'Accept': 'application/json'
        },
        body: new URLSearchParams({ 
            'grant_type': 'client_credentials' 
        })
    }).then((res1)=>{ 
        return res1.json()
      }).then(async(jsonrespone)=>{
        const refApp = doc(db,"APPINFO","e1fBtAfuGrhhOKtjXVDZ")
        await updateDoc(refApp,{
          token:jsonrespone.access_token 
        })
        console.log(jsonrespone.access_token)
       res.status(201).json({message: 'bien'})
    })
      
})
//message pour otp RH
app.post('/otp',async(req,res)=>{
    const reftoken = await getDoc(doc(db,"APPINFO", "e1fBtAfuGrhhOKtjXVDZ")) 
       if(reftoken.exists()){
          let take = reftoken.data()
          let data= {
            'outboundSMSMessageRequest': {
              'address': `tel:+224${req.body.numero}`,
              'senderAddress': 'tel:+2240000',
              "senderName": "MAHIM",
              'outboundSMSTextMessage': {
                  'message': `Bonjour Mr/Mme ${req.body.nom} Voici votre code OTP : ${req.body.code} pour la validation de votre compte `
              }
          }
            }
    
        fetch('https://api.orange.com/smsmessaging/v1/outbound/tel%3A%2B2240000/requests', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${take.token}` ,
                'Content-Type': 'application/json'
            },
            body:  JSON.stringify(data)
        }).then((res1)=>{ 
            console.log(res1.status) 
            return res.status(201).json({message:"notification recus"})
        }).catch((err)=>{
            console.log(err)
            return res.status(201).json({message:"notification non recus"})
        });
       }
   
})
//pour le message de la creation utilisateur 

app.post('/createuser',async(req,res)=>{
    let name = req.body.nom + ' '+ req.body.prenom
    let numero = req.body.numero
    const reftoken = await getDoc(doc(db,"APPINFO", "e1fBtAfuGrhhOKtjXVDZ")) 
       if(reftoken.exists()){
          let take = reftoken.data() 
          let data= {
            'outboundSMSMessageRequest': {
              'address': `tel:+224${numero}`,   
              'senderAddress': 'tel:+2240000',
              "senderName": "MAHIM",
              'outboundSMSTextMessage': {
                  'message': `Bonjour Mr/Mme ${name} votre compte à été creé dans MAHIM (achéteur rapide) voici votre code : ${req.body.code} pour la connexion \n vous beneficiez d'un montant  de 500.000 GNF comme montant maximal pour tout vos achat à crédit dans mahim.com ` 
              }
          }
            }
    
        fetch('https://api.orange.com/smsmessaging/v1/outbound/tel%3A%2B2240000/requests', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${take.token}` ,
                'Content-Type': 'application/json'
            },
            body:  JSON.stringify(data)
        }).then((data)=>{
            return data.json()
        }).then((re)=>{
            console.log(re)
            console.log(req.body)
            return res.status(201).json({message:"notification recus"})
        });
       }
}) 

//message pour la creation d'un bon d'achat 
app.post('/createbon',async(req,res)=>{
    const reftoken = await getDoc(doc(db,"APPINFO", "e1fBtAfuGrhhOKtjXVDZ")) 
    if(reftoken.exists()){
       let take = reftoken.data()
       let data= {
         'outboundSMSMessageRequest': {
           'address': `tel:+224${req.body.numero}`,
           'senderAddress': 'tel:+2240000',
           "senderName": "MAHIM",
           'outboundSMSTextMessage': {
               'message': `Bonjour Mr/Mme ${req.body.nom} vous venez de recevoir un montant de ${req.body.montant.toLocaleString('en-US')} GNF comme  bon d'achat dans Mahim de la part de ${req.body.E} ` 
           }
       }
         }
         
     fetch('https://api.orange.com/smsmessaging/v1/outbound/tel%3A%2B2240000/requests', {
         method: 'POST',
         headers: {
             'Authorization': `Bearer ${take.token}` ,
             'Content-Type': 'application/json'
         },
         body:   JSON.stringify(data)
     }).then(()=>{
        res.status(201).json({message: 'bien'})
     });
    }
}) 
//message pour les commandes 
app.post('/commande',async(req,res)=>{
    const reftoken = await getDoc(doc(db,"APPINFO", "e1fBtAfuGrhhOKtjXVDZ")) 
    if(reftoken.exists()){
       let take = reftoken.data() 
       //information client 
       let data= {
         'outboundSMSMessageRequest': {
           'address': `tel:+224${req.body.numero}`,
           'senderAddress': 'tel:+2240000',
           "senderName": "MAHIM",
           'outboundSMSTextMessage': {
               'message': `Bonjour Mr/Mme ${req.body.nom} vous venez de faire une commande dans Mahim voici le code de la commande : ${req.body.code} à presenter à la livraison ` 
           }
       }
         }
 
     fetch('https://api.orange.com/smsmessaging/v1/outbound/tel%3A%2B2240000/requests', {
         method: 'POST',
         headers: {
             'Authorization': `Bearer ${take.token}` ,
             'Content-Type': 'application/json'
         },
         body:  data 
     }).then(()=>{
     //information administrateur
        data.outboundSMSMessageRequest.address = `tel:+224629821308`
        data.outboundSMSMessageRequest.outboundSMSTextMessage.message = `Bonjour  nouvelle comande code: ${req.body.code} methode de payement : ${req.body.type}`
        fetch('https://api.orange.com/smsmessaging/v1/outbound/tel%3A%2B2240000/requests', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${take.token}` ,
                'Content-Type': 'application/json'
            },
            body:  data 
        })
        res.status(201).json({message: 'bien'})
     });
    }
})
app.get('/', (req,res)=> res.send('ok'))
//creation de nouvelle utilisateur
app.post('/user',(req,res)=>{
  let password =  `${Math.floor(Math.random() * 10)}` + `${Math.floor(Math.random() * 10)}` +  `${Math.floor(Math.random() * 10)}` +  `${Math.floor(Math.random() * 10)}` +  `${Math.floor(Math.random() * 10)}` +  `${Math.floor(Math.random() * 10)}` 
  let name = req.body.nom + ' '+ req.body.prenom
  const auth = getAuth(App)
  createUserWithEmailAndPassword(auth , req.body.email , password).then((user)=>{
       const refuser = doc(db,"USERS" , user.user.uid)
       setDoc(refuser,{
        CODEID : req.body.code ,
        IdE:req.body.ide ,
        bon:{
            active : false ,
            montant : 0 
        },
        credit : {active : true , montant : 500000},
        email:req.body.email ,
        id:user.user.uid ,
        password:password ,
        nom : name , 
         numero : req.body.numero , 
         nomE : req.body.nome 
       })
        res.status(201).json({message:"succes"})
  })
})


app.listen(4000,()=>{
    console.log('running')
})
//gestion des erreur

app.use((err, req, res, next) => {
    console.error(err.message) 
    return res.status(201).json({message:"succes"})
  })

