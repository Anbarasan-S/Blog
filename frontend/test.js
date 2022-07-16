const xhtml=new XMLHttpRequest();

// xhtml.open('GET','http://localhost:8080/bloggyserver/auth',true);
// xhtml.setRequestHeader('x-auth-token',"hello");
// xhtml.send();


	

// $.ajax({
//     type:"GET",
//     url: "http://localhost:8080/Blog/auth",
//     headers:{
//         'Content-Type':"application/json"
//     }
// });


const t=()=>{
    fetch("http://localhost:8080/Blog/auth",
        {
            method:"GET"
        }
    ).then((res)=>console.log(res)).catch(err=>console.log(err));
}