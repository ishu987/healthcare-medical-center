const router = require('express').Router();
const Inventory = require('../Models/Inventory');

router.post('/AddInvMngmnt', async(req, res) => {
    
    const inventory = new Inventory({
        productId: req.body.productId,
        productType: req.body.productType,
        productName: req.body.productName,
        quantity: req.body.quantity,
        pricePerItem: req.body.pricePerItem,
        manufactureDate: req.body.manufactureDate,
        expiredDate: req.body.expiredDate,
        description: req.body.description,
        brand: req.body.brand,
    });

    try {
        const savedInvMngmnt = await inventory.save();
        res.json(savedInvMngmnt);
    } catch (err) {
        res.json({ message: err });
    }
});

router.get('/viewInvMngmnt', async(req, res) => {

    try {
        const invMngmnt = await Inventory.find();
        res.json(invMngmnt);
    } catch (err) {
        res.json({ message: err });
    }
});
 
router.get('/getMaxId', async(req,res) =>{
    try {
        var maxId = await Inventory.findOne().sort('-productId');
        if (maxId == null){
            maxId = 0;
        }
        res.json(maxId)
    }catch (err) {
            res.json({message: err});
        }
});

router.get('/getInvMngmnt/:productId', async(req,res) => {
    try{
        const InvMngmnt = await Inventory.findOne({productId:req.params.productId});
        res.json(InvMngmnt);
    }catch (err) {
        res.json({ message: err});
    }
});

router.delete('/deleteInvMngmnt/:productId', async(req,res) => {
    try{
        await Inventory.findOneAndDelete({productId:req.params.productId});
                res.status(200).json({
                    message: data
                })
    }
    catch (err){
        res.json({message: err})
    }
});

// router.delete('/deleteInvMngmnt/:productId', async(req, res) => {

//     Inventory.deleteOne({ _productId: req.params.productId })
//         .then(thing => res.status(200).send(thing))
//         .catch(error => res.status(400).send({ error: error.message }));

// });

router.post('/updateInvMngmnt', async(req,res) => {
    const updatedDetails = {
        productId: req.body[0].productId,
        productType: req.body[0].productType,
        productName: req.body[0].productName,
        quantity: req.body[0].quantity,
        pricePerItem: req.body[0].pricePerItem,
        manufactureDate: req.body[0].manufactureDate,
        expiredDate: req.body[0].expiredDate,
        description: req.body[0].description,
        brand: req.body[0].brand,
    };

    try{
        await Inventory.findOneAndUpdate({productId: req.body[0].productId}, updatedDetails,{useFindAndModify: false});
        res.status(200).json({
            message:data
        })
    }
    catch(err){
        res.json({message: err})
    }
});

module.exports = router;