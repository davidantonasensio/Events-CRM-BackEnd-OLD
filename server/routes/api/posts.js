const express = require('express');
const mongodb = require('mongodb');

const router = express.Router();

// Get Posts
router.get('/', async (req, res) => {
  const posts = await loadPostsCollection();
  //res.send('activ: ' + req.query.activ + ', customer: ' + req.query.customer); 
  
  let lenghtYearsArray
  if(typeof req.query.Years !== 'undefined'){ 
    //res.send("AAAAAAAAA");
    lenghtYearsArray = req.query.Years.length;
  } else {
    //res.send("BBBBB");
    lenghtYearsArray = 0;
  }



  let JsonArray1 = [];
  let JsonArray2 = [];


  // search for one entry by its id
  if(typeof req.query.id !== 'undefined' &&  req.query.id !== 'false'){
    //res.send("9999999");
    JsonArray1 = await posts.find({_id: new mongodb.ObjectID(req.query.id) }).toArray() 


    // Search for entries depending of is activ, is customer and the years of the events
  } else if(req.query.activ === 'true' ||  req.query.customer === 'true')  {
      //res.send("8888888888");
      if(req.query.activ === 'true'){ activ = true} else {activ=false}
      if(req.query.customer === 'true'){ customer = true} else {customer=false}


      // for the selected Years
      if(lenghtYearsArray !== 0){
        for (i = 0; i < lenghtYearsArray; i++) {
          JsonArray2 = await posts.find({
            "WeddingInfo.DateWedding": {
              $gte: req.query.Years[i] + "-01-01T00:00:00.000Z",
              $lte: req.query.Years[i] + "-12-31T00:00:00.000Z"
            },
            ActivCustomer: activ,
            AlreadyCustomer: customer
          }).toArray();
          JsonArray1 = JsonArray1.concat(JsonArray2);
        }

      // Search just for is activ and is customer, Years are not selected  
      } else {
        //res.send("8888888888");
        JsonArray1 = await posts.find({
          ActivCustomer: activ,
          AlreadyCustomer: customer
        }).toArray();
      }


  // Search for selectios of Years, not is activ or is customer are selected
  } else if(lenghtYearsArray !== 0){
      //res.send("77777777777");
      for (i = 0; i < lenghtYearsArray; i++) {
        JsonArray2 = await posts.find({
          "WeddingInfo.DateWedding": {
            $gte: req.query.Years[i] + "-01-01T00:00:00.000Z",
            $lte: req.query.Years[i] + "-12-31T00:00:00.000Z"
          }
        }).toArray();
        JsonArray1 = JsonArray1.concat(JsonArray2);
      }

  // Just select everything, no filter is selected
  } else {
      JsonArray1 = await posts.find({}).toArray()
      //res.send("666666666666");
  }

  res.send(JsonArray1);

});



// Add Post
router.post('/', async (req, res) => {
  let inserted = '';
  const posts = await loadPostsCollection();

    await posts.insertOne({
      ownID: req.body.post[0].ownID,      
      ActivCustomer: req.body.post[0].ActivCustomer,
      AlreadyCustomer: req.body.post[0].AlreadyCustomer,
      DateContact: req.body.post[0].DateContact,
      Source: req.body.post[0].Source,
      WeddingInfo: { 
                    DateWedding: req.body.post[0].WeddingInfo.DateWedding, 
                    WeddingLocation: req.body.post[0].WeddingInfo.WeddingLocation
                  },
      BrideInfo: {
                    BrideName: req.body.post[0].BrideInfo.BrideName, 
                    BrideSurname: req.body.post[0].BrideInfo.BrideSurname, 
                    BrideTel: req.body.post[0].BrideInfo.BrideTel, 
                    BrideEmail: req.body.post[0].BrideInfo.BrideEmail},
      GroomInfo: {
                    GroomName: req.body.post[0].GroomInfo.GroomName, 
                    GroomSurname: req.body.post[0].GroomInfo.GroomSurname, 
                    GroomTel: req.body.post[0].GroomInfo.GroomTel, 
                    GroomEmail: req.body.post[0].GroomInfo.GroomEmail},
      CoupleAddress: req.body.post[0].CoupleAddress, 
      ContractInfo: {  
                    ContractDate: req.body.post[0].ContractInfo.ContractDate,
                    OrderedServices: req.body.post[0].ContractInfo.OrderedServices,
                    OrderedProducts: req.body.post[0].ContractInfo.OrderedProducts,
                    NumberHours: req.body.post[0].ContractInfo.NumberHours,
                    TotalPrice: req.body.post[0].ContractInfo.TotalPrice,
                    DepositToPay: req.body.post[0].ContractInfo.DepositToPay,
                    DepositPayed: req.body.post[0].ContractInfo.DepositPayed,
                    PermisionPublic: req.body.post[0].ContractInfo.PermisionPublic  
      },
      Comments: req.body.post[0].Comments,
    },function(error, response){    

    if(error) {
        console.log('Error occurred while inserting');
        res.status(201).send(error);
       // return 
    } else {
       console.log('inserted record', response.ops[0]);
       res.status(201).send(response.ops[0]._id);
      // return 
    }

    });

  //res.status(201).send("11111111");
});


// update Post
router.post('/update', async (req, res) => {
  //res.status(201).send(req.body.post[0].ownID);
  //res.status(201).send("lalalalalalalala");

  
  const posts = await loadPostsCollection();

    await posts.updateOne({
      "_id": new mongodb.ObjectID(req.body.post[0].id)
    },
      {$set: {
      ownID: req.body.post[0].ownID,
      ActivCustomer: req.body.post[0].ActivCustomer,
      AlreadyCustomer: req.body.post[0].AlreadyCustomer,
      DateContact: req.body.post[0].DateContact,
      Source: req.body.post[0].Source,
      WeddingInfo: { 
                    DateWedding: req.body.post[0].WeddingInfo.DateWedding, 
                    WeddingLocation: req.body.post[0].WeddingInfo.WeddingLocation
                  },
      BrideInfo: {
                    BrideName: req.body.post[0].BrideInfo.BrideName, 
                    BrideSurname: req.body.post[0].BrideInfo.BrideSurname, 
                    BrideTel: req.body.post[0].BrideInfo.BrideTel, 
                    BrideEmail: req.body.post[0].BrideInfo.BrideEmail},
      GroomInfo: {
                    GroomName: req.body.post[0].GroomInfo.GroomName, 
                    GroomSurname: req.body.post[0].GroomInfo.GroomSurname, 
                    GroomTel: req.body.post[0].GroomInfo.GroomTel, 
                    GroomEmail: req.body.post[0].GroomInfo.GroomEmail},
      CoupleAddress: req.body.post[0].CoupleAddress, 
      ContractInfo: {  
                    ContractDate: req.body.post[0].ContractInfo.ContractDate,
                    OrderedServices: req.body.post[0].ContractInfo.OrderedServices,
                    OrderedProducts: req.body.post[0].ContractInfo.OrderedProducts,
                    NumberHours: req.body.post[0].ContractInfo.NumberHours,
                    TotalPrice: req.body.post[0].ContractInfo.TotalPrice,
                    DepositToPay: req.body.post[0].ContractInfo.DepositToPay,
                    DepositPayed: req.body.post[0].ContractInfo.DepositPayed,
                    PermisionPublic: req.body.post[0].ContractInfo.PermisionPublic  
      },
      Comments: req.body.post[0].Comments,
    }
  })
  .then(result => {
    // result.matchedCount === 1
    //res.status(201).send(req.body.id);
    res.status(201).send(req.body.post[0].id);
  }).catch((err) => {
    res.status(201).send(err);
  });

  //res.status(201).send("Ehhhhhhhh");
  
});



// Delete Post
router.delete('/:id', async (req, res) => {
//router.delete('/', async (req, res) => {
  //res.status(201).send("BLABLALBALBALBABLA");

  const posts = await loadPostsCollection();
  await posts.deleteOne({ _id: new mongodb.ObjectID(req.params.id) })
  .then(result => {
    res.status(201).send();
  }).catch((err) => {
    res.status(201).send(err);
  });
  
  //res.status(200).send();
});




async function loadPostsCollection() {
  const client = await mongodb.MongoClient.connect
  //('mongodb://192.168.2.65:27017/wedding-CRM',
  ('mongodb://192.168.2.65:27017/events',
    {
      useNewUrlParser: true
    }
  );

  //return client.db('wedding-CRM').collection('posts');
  return client.db('events').collection('clients');
}

module.exports = router;
