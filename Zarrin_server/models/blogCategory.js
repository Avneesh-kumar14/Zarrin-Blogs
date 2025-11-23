const {Schema,model, default: mongoose}=require('mongoose')
const Category = new Schema ({
    name :{
        type:String
        
    },
    slug:{
        type:String,
        unique:true ,
        required:true
    }  
},{
    timestamps:true
})
Category.pre('save', function (next) {
  if (this.name) {
    this.slug = this.name.replace(/\s+/g, '_');
  }
  next();
});
const blogCategory = model("category",Category)
module.exports= blogCategory