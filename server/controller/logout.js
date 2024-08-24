const logout = (req, res)=>{
    try{
        const cookieOption = {
            http: true,
            secure: true
        }
        return res.cookie("token", "", cookieOption).json(200).json({
            message:"Session out"
        })
    }catch(error){
        return res.status(500).json({message:"Something went wrong"})
    }
}

module.exports = logout