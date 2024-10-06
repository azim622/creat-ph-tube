function getTimeString (time){
    const hour =parseInt(time/3600);
    let remainingSecond = time % 3600;
    const minute =parseInt(remainingSecond/60);
    remainingSecond = remainingSecond%60;
    return `${hour}hour ${minute} minute ${remainingSecond}second ago`
}

const removeActiveClass=()=>{
    const buttons = document.getElementsByClassName("category-btn")
    console.log(buttons)
    for (let btn of buttons){
        btn.classList.remove("active")
    }

}

// creat load categories 
const loadCatagories = () =>{
    fetch('https://openapi.programming-hero.com/api/phero-tube/categories')
    .then((res) => res.json())
    .then((data) => displyCatagories(data.categories))
    .catch((error) => console.log(error))
}
// creat video section 
const loadvideos = (searchText= "") =>{
    fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`)
    .then((res) => res.json())
    .then((data) =>displyVideos(data.videos) )
    .catch((error) => console.log(error))
}

const loadCategoryVideos = (id) =>{
    // alert(id);
    fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
    .then((res) => res.json())
    .then((data) =>{


        removeActiveClass()

        const activeButton = document.getElementById(`btn-${id}`)
        activeButton.classList.add("active")

        displyVideos(data.category) 
    } )
    .catch((error) => console.log(error))
}

const videoDetails =async(videoId) => {
    console.log(videoId)
    const uri = `https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`;
    const res= await fetch(uri);
    const data  = await res.json();
    disolyDetails(data.video)
}
    const disolyDetails = (video) =>{
        console.log(video)
        const detailContainer = document.getElementById("modal-content")

        detailContainer.innerHTML=`
        <img src= ${video.thumbnail}>
        <p>${video.description}</p>
        `

        // way 1
        // document.getElementById("showModalData").click()
        // way-2 
        document.getElementById("coustomModal").showModal()
    }

// const cardDemo =
//     {
//         "category_id": "1003",
//         "video_id": "aaak",
//         "thumbnail": "https://i.ibb.co/ZNggzdm/cake.jpg",
//         "title": "Beyond The Pale",
//         "authors": [
//             {
//                 "profile_picture": "https://i.ibb.co/MZ2vbXR/jimm.jpg",
//                 "profile_name": "Jim Gaffigan",
//                 "verified": false
//             }
//         ],
//         "others": {
//             "views": "2.6K",
//             "posted_date": "15400"
//         },
//         "description": "'Beyond The Pale' by Jim Gaffigan, with 2.6K views, is a comedic gem that explores everyday observations and family life with a light-hearted and witty approach. Jim's humor is accessible and delightful, making this show perfect for anyone who enjoys clean, observational comedy."
//     }



const displyVideos = (videos) => {
    const videoContainer = document.getElementById('videos')
    videoContainer.innerHTML="";

    if(videos.length == 0){
        videoContainer.classList.remove("grid")
        videoContainer.innerHTML=
        `
        <div class="min-h-[300px] flex flex-col w-full justify-center items-center ">
           <img src="assets/icon.png">
           <h2 class="font-bold text-xl text-center">No Content Here In This Category</h2>
        </div>
        `
        return

    }
    else{
        videoContainer.classList.add("grid")

    }



    videos.forEach((video) => {
        console.log(video)
        const card = document.createElement('div');
        card.classList ='card card-compact bg-base-100 '
        card.innerHTML= 
        ` <figure class="h-[200px] relative">
        <img
        src=${video.thumbnail}
        class ="h-full w-full object-cover"
        alt="Shoes" />
        ${
            video.others.posted_date?.length ==0 ? "":`
            <span class="absolute right-2 bottom-2 text-xs bg-black text-white rounded p-1">${getTimeString(video.others.posted_date)}</span>` 
        }
        
        </figure>
        <div class="px-0 py-2 flex gap-2">
           <div>
              <img class="h-10 w-10 rounded-full object-cover" src= ${video.authors[0].profile_picture}>
           </div>
            <div>
            <h2 class="font-bold">${video.title}</h2>
            <div class="flex items-center gap-2">
               <p class="text-gray-400">${video.authors[0].profile_name}</p>

               ${video.authors[0].verified === true ? `<img class="w-5" src ="https://img.icons8.com/?size=48&id=D9RtvkuOe31p&format=png">`:""}
               
            </div>
            <p> <button onclick ="videoDetails('${video.video_id}')" class="btn btn-sm btn-error">Details</button></p>
           </div>
        </div>
        `
        videoContainer.append(card)
    })

}

const displyCatagories= (categories) =>{
    const catagoryContainer =document.getElementById('categories')
    categories.forEach((item) => {
        console.log(item)

        // btn created
        const buttonContainer = document.createElement("div");
        buttonContainer.innerHTML = 
        `
        <button id="btn-${item.category_id}" onclick ="loadCategoryVideos(${item.category_id})" class="btn category-btn">
           ${item.category}
        </button>
        
        `
       

        // btn added 
        catagoryContainer.append(buttonContainer)
    })
      
}

document.getElementById("search-input").addEventListener("keyup", (e)=>{
    loadvideos(e.target.value)

})

loadCatagories()
loadvideos()