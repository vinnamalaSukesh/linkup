import { models, Schema,model } from "mongoose";
const user = new Schema({
    clerkId : {type : String,required : true,unique : true},
    uname: { type: String, required: true, unique: true },

    friends : { count : {type : Number,default : 0},
                list : [{
                    id : {type : String,required : true},
                    chatBox : {type : String,required : true}}],
                reqSent : [{ id : {type : String,required : true}}],
                reqReceived : [{ id : {type : String,required : true}}]
                    },

    groups : { count : {type : Number, default : 0},
            list : [{ id : {type : String,required : true} }]},

    posts : {count : {type :Number,required : true,default : 0},
            list : [{
                    postId : {type : String,required : true},
                    postedOn : {type : Date,required : true},
                    comments : {
                        count : {type : Number,default : 0},
                        list : [{
                            commentedBy: { type: String, required: true },
                            comment : {type : String, required : true}
                            }]
                        },
                    likes : {
                                count : {type : Number,default : 0},
                                list : [{ likedBy : {type : String} }]
                            }
                        }]
        },

    profilePic : {type : String, default : ""},
    coverPic: { type: String, default: "" },
    caption: { type: String, default: "" },
    online: { type: Boolean, default: false },
})

export const User = models["User"] || model("User", user);