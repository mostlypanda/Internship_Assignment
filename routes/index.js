var express = require('express');
var router = express.Router();
var admin = require("firebase-admin");
var serviceAccount = require("./fc");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://test1-21f34.firebaseio.com"
});

var db = admin.firestore();


router.post('/bookmark',(req,res)=>{
  obj=req.body
  obj.createdat=new Date()
  obj.updatedat=new Date()
  db.collection('bookmark').doc().set(obj)
  res.send('done')
})

router.post('/tag',(req,res)=>{
  obj=req.body
  obj.createdat=new Date()
  obj.updatedat=new Date()
  db.collection('tag').doc().set(obj)
  res.send('done')
})

router.put('/bookmark/:id/',async (req,res)=>{
  id=req.params.id
  a=await db.collection('bookmark').doc(id).get()
  obj=(a.data())
  obj.updatedat=new Date()
  console.log(obj);
  obj1=obj.tag.split(":")
  obj1.push(req.body.tag)
  console.log(obj);
  obj.tag=obj1.join(":")
  await db.collection('bookmark').doc(id).update(obj)
  res.send('done')
})

router.delete('/bookmark/:id/',async (req,res)=>{
  id=req.params.id
  a=await db.collection('bookmark').doc(id).get()
  obj=(a.data())
  obj.updatedat=new Date()
  console.log(obj);
  obj1=obj.tag.split(":")
  obj1.splice(obj1.indexOf(req.body.tag),1)
  console.log(obj);
  obj.tag=obj1.join(":")
  await db.collection('bookmark').doc(id).update(obj)
  res.send('done')
})

router.get('/bookmark',async (req,res)=>{
  l=[]
  await db.collection('bookmark').get().then(a=>{
    console.log('object')
    a.forEach(b=>{
      l.push(b.data())
      console.log(b.data())
    })
  })
  res.status(200).json({'result':l})
})
router.get('/tag',async (req,res)=>{
  l=[]
  await db.collection('tag').get().then(a=>{
    console.log('object')
    a.forEach(b=>{
      l.push(b.data())
      console.log(b.data())
    })
  })
  res.status(200).json({'result':l})
})
router.delete('/tag/:id',async (req,res)=>{
  await db.collection('tag').doc(req.params.id).delete()
  res.send('done')
})

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
