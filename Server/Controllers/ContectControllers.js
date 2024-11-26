import User from "../models/UserModel.js";

export const SearchContect=async(request, response, next)=>{
    try{
        const {SearchTerm}=request.body;
  
        if(SearchTerm===undefined || SearchTerm==null){
            return response.status(400).send("SearchTerm is required.");
        }

        const sanitizedSearchTerm=SearchTerm.replace(/[.*+?${}()|[\]\\]/g,"\\$&")

        const regex=new RegExp(sanitizedSearchTerm,"i");
        const Contects=await User.find({
            $and:[{_id:{$ne:request.userId}}],
            $or:[{firstName:regex},{lastName:regex},{email:regex}]
        })
      return response.status(200).json({Contects});
    }catch(error){
      console.log(error);
    }
  }
 