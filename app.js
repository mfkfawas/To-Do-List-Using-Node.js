const express = require('express');
const bodyParser = require('body-parser');
//const date = require(__dirname+'/date.js');
const mongoose = require('mongoose')
const _ = require('lodash')

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public')); // To load css and js files. we need to explicitly serve the
// express server the static resources.

//connecting to mongoDB using mongoose package
mongoose.connect('mongodb+srv://admin-mfk:kl10ab9000@cluster0.5okrg.mongodb.net/toDoListDB', {useNewUrlParser: true, useUnifiedTopology: true});

//constructing new schema
const itemSchema = new mongoose.Schema({
    name: String
})

//Add schema to mongoose model
const item = mongoose.model("Item", itemSchema)

//Adding items to item
const item1 = new item({
    name: "Welcome to our todo list"
})
const item2 = new item({
    name: "Hit + to add new item to our todo list"
})
const item3 = new item({
    name: "<-- hit this to delete an item"
})
const defaultItems = [item1, item2, item3]

//constructing new schema for customlist
const listSchema = new mongoose.Schema({
    name: String,
    items: [itemSchema] //[{name: ggg},{name: hhh}]
})
//add zchema to a model
const lists = mongoose.model("List", listSchema)


app.get('/', (req, res)=>{
    
    //Reading  datas from db, {} refer to complete rows. Usually we can give any conditions if we need too
    item.find({}, (err, results)=>{
        //foundItems contain datas from db. If it is empty that means no data is entered to corr collection.
        //This condn is given to avoid repetition of same datas, bcoz if we restart our server without this
        //condition the datas are again inserted to corr colection.
        if(results.length === 0){
            item.insertMany(defaultItems, (err)=>{
            if(err){
                console.log(err)
            } else {
                console.log("Inserted defaultItems succesfully")
            }
            })
            res.redirect('/')
        } else{
            res.render('list', {listTitle: "Today", nextDoItems: results});  
        }
        
    })

    //let day = date.getDate();
    //Our created node module's fns.
    // let day = date.getDay(); //gives current day.
    // this fn is used for ejs. Its check 'list.ejs' in 'views' directory
    //  in our working directory.
});

//Custom List
app.get('/:customListName', (req, res)=>{
    //_.capitalize() - lodash fn for converting 1st char of a string to capital.
    //we used it bcoz - class 348
    const customListName = _.capitalize(req.params.customListName)

    //Above we checked item.find() which returns an array, so we checked the length. Here lists.findOne()
    //we get an obj so we checking using the results var directly,
    lists.findOne({name: customListName}, (err, results)=>{
        if(!err){
            if(results){
                //Show the existing lists with title customListName
                res.render('list', {listTitle: results.name, nextDoItems: results.items})
            } else {
                //Create a new list with title customListName
                const list = new lists({
                    name: customListName,
                    items: defaultItems
                })
                list.save()
                res.redirect('/' + customListName)//Custom List(look above)
            }
        }
    })
})

// app.get('/work', (req, res)=>{
//     res.render('list',{listTitle: "Work List",nextDoItems: workList});
// });

// app.get('/about', (req, res)=>{
//     res.render('about');
// });

app.post('/', (req, res)=>{

   const itemName = req.body.nextItem
   const listName = req.body.list

   const newItem = new item({
    name: itemName
})

   if(listName === "Today"){

        newItem.save() 

        res.redirect('/')
   } else {
        lists.findOne({name: listName},(err, results)=>{
            if(!err){
                //items in lists have type [itemSchema], so we cannot push itemName directly,
                //can only push same type
                results.items.push(newItem)
                results.save()

                res.redirect('/' + listName)
            }
        })
   }

    // if(req.body.list === "Work"){
    //     workList.push(item);
    //     res.redirect('/work'); // We cannot use res.render(); here bcoz when the value is sended, the value that is to be sent from get(); will
    //     // be undefined - Angela Yu - Web Dev - class no - 268 
    // } else {
    //     items.push(item);
    //     res.redirect('/'); // We cannot use res.render(); here bcoz when the value is sended, the value that is to be sent from get(); will
    //     // be undefined - Angela Yu - Web Dev - class no - 268 
    // }
});

app.post('/delete', (req, res)=>{
    idOfChecked = req.body.checkbox
    listName = req.body.listName

    if(listName === "Today"){       
        item.deleteOne({_id: idOfChecked}, (err)=>{ //can also use findByIdAndRemove()
            if(err){
                console.log(err)
            } else {
                console.log("succesfully deleted the checked element")
            }
        })
        res.redirect('/')
        //deleting checked elements from custom lists.
        //Anything with $ sign before is mongoDB command.
        //$pull is used to delete an element from an array.The below pull command delete an element with id
        //idOfChecked from array named items.
        //items - array name.
    } else {
        lists.findOneAndUpdate({name: listName}, {$pull: {items: {_id: idOfChecked}}}, (err, results)=>{
            if(!err){
                res.redirect('/' + listName)
            }
        })
    }
})


app.listen(3000, (req, res)=>{
    console.log("Port running on server 3000");
});