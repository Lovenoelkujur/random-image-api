const dotenv = require("dotenv");
const express = require("express");
const axios = require("axios");
const sharp = require('sharp');

dotenv.config();

const PORT = 9000;
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;


const app = express();

app.use(express.json());

app.get("/random-images",async (req,res)=>{
    try{
        const url = 'https://api.unsplash.com/'
        const resp = await axios({
            method : "get",
            url : `${url}photos/random`,
            headers : {
                Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
            }
            
        });

        const imageUrl = resp.data.urls.full;
        
    //    Fetch the image data
        const imageData = await axios({
            method:"get",
            url : imageUrl,
            responseType: 'arraybuffer'

        })

         // Resize the image using sharp
         const resizedImageData = await sharp(imageData.data)
         .resize({ width: 350 }) // Set the desired width for resizing
         .toBuffer();
         
        // Set the appropriate headers for the resized image
         res.set({
             'Content-Type': 'image/png',
             'Content-Length': resizedImageData.length
         });

        // Send the resized image as a response
        res.status(200).send(resizedImageData);

            // res.status(200).json({
            //     image : imageUrl,
            // })
            
    }catch(error){
        console.log(error);
        res.status(500).json({
            message : 'internal server error occured'
        })
    }
});

app.use("/*",(req,res)=>{
    res.status(404).json({
        message : "PAGE NOT FOUND"
    })
})

app.listen(PORT,()=>{
    console.log(`server is running at ${PORT}`);
})