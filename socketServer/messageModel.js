const mongoose=require('mongoose');


const messageSchema=new mongoose.Schema({

    sender:{
        type:mongoose.Schema.Types.ObjectId,
        

        required:true
    },
    recipient:{
        type:mongoose.Schema.Types.ObjectId,
      
        required:true
    },
    message:{

        type:String,
        required:true
    }
})

const Message=mongoose.model('Message',messageSchema);
module.exports=Message;