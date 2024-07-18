const generateForm = document.querySelector(".generate-form");
const imageGallery = document.querySelector(".image-gallery");

const OPENAI_API_KEY = "#########";
const apiUrl = "https://api.openai.com/v1/images/generations";
let isImageGenerating=false;

const updateImageCard=(imgDataArray)=>{
    imgDataArray.forEach((imgObject,index)=>{
            const imgCard = imageGallery.querySelectorAll("img-card")[index];
            const imgElement = imgCard.querySelector("img");
            const downloadBtn = imgCard.querySelector("download-btn");

            //set the image source to the ai-generated image data
            const aiGeneratedImg = `data:image/jpeg;base64,${imgObject.b64_json}`;
            imgElement.src = aiGeneratedImg; 

            //when the image is loaded remove the loading class and set download attributes
            imgElement.onload = ()=>{
                imgCard.classList.remove("loading");
                downloadBtn.setAttribute("href",aiGeneratedImg);
                downloadBtn.setAttribute("downlaod",`${new Date().getTime()}.jpg`);
            }
    });
}

generateAiImages=async (userPrompt, userImgQuantity)=>{
    try {
        // send a request to the openapi to generate images based on user inputs
        const response = await fetch(apiUrl,{
            method:"POST",
            headers:{
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                prompt: userPrompt,
                n: parseInt(userImgQuantity),
                size: "512x512",
                response_format:"b64_json"
            })
        });

        //throws an error msg if the AI response is unsuccessful
        if(!response.ok) throw new Error("Failed to generate images! Please try again");

        const{data} = await response.json();//to get data from the response
        updateImageCard([...data])
    } catch (error) {
        alert(error.message);
    }finally{
        isImageGenerating = false;
    }
}


const handleFormSubmission=(e)=>{
    e.preventDefault();
    if(isImageGenerating) return;
    isImageGenerating=true;
        // console.log(e.srcElement);

    //get user input and image quantity from the form
    const userPrompt = e.srcElement[0].value;
    const userImgQuantity = e.srcElement[1].value;
        // console.log(userPrompt, userImgQuantity);
    
    // Creating HTML Markup for image card with loading state
    const imgCardMarkup = Array.from({length: userImgQuantity},()=>
    `<div class="img-card loading">
        <img src="images/loader.svg" alt="image">
        <a href="#" class="download-btn">
            <img src="images/download.svg" alt="download icon">
        </a>
    </div>`
    ).join("");
    // console.log(imgCardMarkup);

    imageGallery.innerHTML = imgCardMarkup;
    generateAiImages(userPrompt, userImgQuantity);
}
generateForm.addEventListener("submit", handleFormSubmission);

