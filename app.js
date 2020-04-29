var express=require("express")
var app=express()
var mongoose=require("mongoose")
var bodyParser=require("body-parser")
var expressSanitizer=require("express-sanitizer");
var methodOverride=require("method-override");
app.set("view engine","ejs")
var Port=5000;
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:true}))
mongoose.connect("mongodb://localhost/blogappdemo",{useNewUrlParser:true})
app.use(methodOverride('_method'))
app.use(expressSanitizer())
var blogSchema=new mongoose.Schema(
    {
        tittle:String,
        image:String,
       blogbody:String,
        created:{type:Date, default:Date.now()}
    }
)
var blogs=mongoose.model("blogs",blogSchema)

//Set up of routes
app.get("/",function(req,res)
{
    res.redirect("/blogs");
})
app.get("/blogs",function(req,res)
{
    blogs.find({},function(err,blogs)
    {
        if(err)
        {
            console.log(err)
        }
        else{
            console.log("Before the rendered in the index file from the database")
            console.log(blogs);
            res.render("index",{blogs:blogs})
        }
    })
})
//Creating a new Route for displaying the form
app.get("/blogs/new",function(req,res)
{
    res.render("new")
})

/*Creating the route to submit it to a particular form
app.post("/blogs",function(req,res)
{
    var tittle=req.body.tittle;
    console.log(tittle)
    var image=req.body.image;
    console.log(image)
    var blogbody=req.body.blogbody
    console.log(blogbody)
    var total={tittle:tittle,image:image,blogbody:blogbody}
    console.log(total)
    blogs.create(total,function(err,blog)
    {
        if(err)
        {
            console.log(err)
        
        }
        else{
            res.redirect("/blogs")
        }
    })
})*/ 

app.post("/blogs",function(req,res)
{
    req.body.blogs.blogbody=req.sanitize(req.body.blogs.blogbody);
    console.log(req.body.blogs.blogbody);
    blogs.create(req.body.blogs,function(err,newBlog)
    {
      console.log(req.body.blogs);
        if(err)
        {
       console.log(err)
        }
 else{
    res.redirect("/blogs");
}
        
    })   
})
//Show route
app.get("/blogs/:id",function(req,res)
{
    blogs.findById(req.params.id,function(err, foundId)
    {
        console.log(req.params.id)
        if(err)
        {
            res.render("index");
        }
        else
        {
            res.render("show",{blogs:foundId});
        }
    })
})

/*Creating an edit route
app.get("/blogs/:id/edit",function(req,res)
{
    blogs.findById(blogs,function(err,foundblog)
    {
        if(err)
        {
            console.log(err)
        }
        else{
            res.redirect("/edit",{blogs:foundblog})
        }
    })
})
app.put("/blogs/:id",function(req,res)
{
    blogs.findByIdAndUpdate(req.params.id,blogs,function(err,updatedBlogs)
    {
        if(err)
        {
            res.redirect("/blogs")
        }
       else{
           res.render("show",{blogs:updatedBlogs});
       }

    })
})*/
//Edit Route
app.get("/blogs/:id/edit",function(req,res)
{
       
    blogs.findById(req.params.id,function(err,foundblog)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("edit",{blogs:foundblog});
        }
    })
})
//Update Route
app.put("/blogs/:id",function(req,res)
{
    req.body.blogs.blogbody=req.sanitize(req.body.blogs.blogbody);
    blogs.findByIdAndUpdate(req.params.id,req.body.blogs,function(err,updatedblogs)
    {
        if(err)
        {
            console.log(err);
        }
        else{
            res.redirect("/blogs/"+req.params.id);
        }
    })
})

//Making delete route
app.delete("/blogs/:id",function(req,res)
{
  blogs.findByIdAndRemove(req.params.id,function(err)
  {
      console.log("Id coming from delete route");
      console.log(req.params.id);
      if(err)
      {
          console.log(err);
      }
      else{
          res.redirect("/blogs");
      }
  })
})

app.listen(Port,function(req,res)
{
    console.log("server statred at")
})