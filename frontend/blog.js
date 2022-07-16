let content;
const loader=document.getElementsByClassName('loader')[0];
const form=document.getElementsByClassName('form-container')[0];


const resetLoading=(mode)=>mode===0?loader.style.display='none':loader.style.display='';
const resetForm=(mode)=>mode===0?form.style.display='none':form.style.display='';
const blog_obj={};
const title_obj={};


const linkClickHandler=(event)=>
{
    event.preventDefault();
    const elems=document.getElementsByClassName('nav-item');

    
    for(let elem of elems)
    {
        if(elem.className.indexOf('active')!==-1)
        {
            elem.className=elem.className.replace('active','');
        }
    }

    event.target.parentElement.className+=' active';
    const t=()=>{
        fetch("http://localhost:8080/Blog/auth",
            {
                method:"GET",
                headers:{
                    Accept: 'application/json',
    Authentication: 'Bearer Token',
    'X-Custom-Header': 'header value'
                }
            }
        ).then((res)=>console.log(res)).catch(err=>console.log(err));
    }
    t();
    window.location.href=event.target.href;
}

const loadContent=()=>{
    content=document.getElementsByClassName("content")[0];
    const token=getToken();
    if(token===null)
    {
        window.location.href="login.html";
    }
    else 
    {
    
        const xhtml=new XMLHttpRequest();
        xhtml.open('GET',"http://localhost:5000/api/blog/get",true);
        xhtml.setRequestHeader('x-auth-token',token[1]);
        
        xhtml.onload=function()
        {
            if(this.status===200)
            {
                const json=JSON.parse(this.responseText);
                resetLoading(0);
                content.style.display='';
                showAllBlog();
            }
            else
            {
                document.cookie=`token=`
                window.location.href="login.html";
            }
        }

        xhtml.send();
    }
}

const getToken=()=>{
    const tokens=document.cookie.split(";");
    for(let token of tokens)
    {
        let val=token.split("=");
        if(val.length==2)
        {
            if(val[0]==="token")
            {
                return val;
            }
        }
    }
    return null;
}

const createBlog=(event)=>{
    event.preventDefault();
    const title=document.getElementsByName("title")[0].value;
    const blog=document.getElementsByName("blog")[0].value;
    content=document.getElementsByClassName("content")[0];
    const token=getToken();

    if(token===null)
    {
        window.location.href="/login.html";
    }
    else 
    {
        const xhtml=new XMLHttpRequest();
        xhtml.open('POST',"http://localhost:5000/api/blog/add",true);
        xhtml.setRequestHeader('x-auth-token',token[1]);
        xhtml.setRequestHeader('Content-type', 'application/json; charset=utf-8');

        const body=JSON.stringify({
            title:title,
            blog:blog
        });
        xhtml.onload=function()
        {
            if(this.status===200)
            {
                document.getElementsByName("title")[0].style.borderColor='';
                document.getElementById('title-exists').innerText='';
                const json=JSON.parse(this.responseText);
                console.log(json);
                $(function () {
                    $('#myModal').modal('toggle');
                 });
                resetLoading(0);
                content.style.display='';
                showAllBlog();
            }
            else if(this.status===400)
            {
                document.getElementsByName("title")[0].style.borderColor='red';
                document.getElementById('title-exists').innerText=JSON.parse(this.responseText).msg;
            }
            else 
            {
                document.cookie=`token=`
                window.location.href="login.html";
            }
        }

        xhtml.send(body);
    }
}

const createCard=(title,blog,id)=>{
    const doc=document.createElement("div");
    doc.className="col-sm-3";
    const doc2=document.createElement("div");
    doc2.className="card";
    const doc3=document.createElement("div");
    doc3.className="card-body";
    const h=document.createElement("h2");
    const para=document.createElement("p");
    h.className="card-title";
    h.innerHTML=title;
    para.innerHTML=blog;
    para.className="card-text";   
    doc3.appendChild(h);
    doc3.appendChild(para);
    doc2.appendChild(doc3);
    doc.appendChild(doc2);
    const button1=document.createElement("button");
    button1.innerText="View"
    button1.className="btn btn-success view";
    button1.id=id;
    button1.onclick=(event)=>view(event);
    button1.style.marginRight="2rem";
    const button2=document.createElement("button");
    button2.innerText="Edit";
    button2.id=id;
    button2.className="btn btn-primary edit";
    button2.style.marginRight="2rem";
    button2.onclick=(event)=>edit(event);
    const button3=document.createElement("button");
    button3.innerText="Delete";
    button3.id=id;
    button3.className="btn btn-danger remove";
    button3.onclick=(event)=>remove(event);
    doc3.appendChild(button1);
    doc3.appendChild(button2);
    doc3.appendChild(button3);
    doc.style.margin="2rem";
    return doc;
}

const showAllBlog=()=>{
    document.getElementById("plus").style.display="none";

    const xhtml=new XMLHttpRequest();
    xhtml.open('GET',`http://localhost:5000/api/blog/get`,true);
    const token=getToken();
    xhtml.setRequestHeader("x-auth-token",token[1]);
    xhtml.onload=function()
    {
        if(this.status===200)
        {
            document.getElementById("plus").style.display="";
            const doc=document.getElementById("blog-content");
            doc.innerHTML="";
            const res=JSON.parse(this.responseText);
            if(res.blogs.length===0)
            {
            document.getElementById("plus").style.display="";
            }
            else
            {
                const blogs=res.blogs;
                let div=[];
                let ptr=0;
                div[0]=document.createElement("div");
                div[0].className="row";
                for(let ind=0;ind<blogs.length;ind+=1)
                {
                    let title=blogs[ind].title,blog=blogs[ind].blog;
                    const id=blogs[ind]._id;
                    blog_obj[id]=blog;
                    title_obj[id]=title;
                    blog=blog.substring(0,10);
                    blog+="...";
                    if((ind+1)%3===0)
                    {
                        div[ptr].appendChild(createCard(title,blog,id));
                        doc.appendChild(div[ptr]);
                        ptr++;
                        div[ptr]=document.createElement("div");
                        div[ptr].className="row";
                    }
                    else
                    {
                        div[ptr].appendChild(createCard(title,blog,id));
                    }

                    if(ind===blogs.length-1)
                    {
                        doc.appendChild(div[ptr]);
                    }
                    
                }
            }

        }
        else
        {
            logout();
        }
    }


    xhtml.send();
}

const edit=(event)=>{
document.getElementsByName("title")[1].style.borderColor='';
document.getElementById("title-exist").innerText='';
    const id=event.target.id;
    document.getElementsByName("title")[1].value=title_obj[id];
    document.getElementsByName("blog")[1].value=blog_obj[id];
    document.getElementsByName("edit")[0].id=id;
    $(function () {
        $('#editModal').modal('toggle');
     });
}

const editSubmit=(event)=>{
    const id=document.getElementsByName("edit")[0].id;
    event.preventDefault();
    const token=getToken();
    if(token===null||token.length===1)
    {
       logout();
    }
    const xhtml=new XMLHttpRequest();
    xhtml.open('PUT',`http://localhost:5000/api/blog/edit/${id}`,true);
    xhtml.setRequestHeader("x-auth-token",token[1]);
    xhtml.setRequestHeader('Content-type', 'application/json; charset=utf-8');

    xhtml.onload=function()
    {
       if(this.status===200)
       {
           document.getElementsByClassName("alert")[0].className="alert alert-success alert-dismissible fade show d-flex justify-content-center";
           document.getElementById("warner").style.display="";
           document.getElementById("alert-text").innerText=JSON.parse(this.responseText).msg;
           $(function () {
               $('#editModal').modal('toggle');
            });
            showAllBlog();
       }
       else if(this.status===400)
       {
        document.getElementsByName("title")[1].style.borderColor='red';
        document.getElementById('title-exist').innerText=JSON.parse(this.responseText).msg;
       }
       else if(this.status===500)
       {
           logout();
       }
    }
    const title=document.getElementsByName("title")[1].value;
    const blog=document.getElementsByName("blog")[1].value;
    const body=JSON.stringify({title:title,blog:blog});
    xhtml.send(body);
}

const view=(event)=>{
    const id=event.target.id;
    document.getElementById("blog-content").style.display="none";
    document.getElementById("plus_btn").style.display="none";
    const title=document.getElementById("title");
    const blog=document.getElementById("blog");
    title.innerText=title_obj[id];
    blog.innerText=blog_obj[id];
}

const remove=(event)=>{
    if(confirm(`Sure you want to remove ${title_obj[event.target.id]}`)!==true)
    {
        return;
    }
    const id=event.target.id;
    const token=getToken();

    if(token==null||token.length===1)
    {
        logout();
        return;
    }

    const xhtml=new XMLHttpRequest();
    xhtml.open('DELETE',`http://localhost:5000/api/blog/remove/${id}`,true);
    xhtml.setRequestHeader("x-auth-token",token[1]);
    
    xhtml.onload=function(){
        if(this.status===200)
        {
            document.getElementsByClassName("alert")[0].className="alert alert-success alert-dismissible fade show d-flex justify-content-center";
            document.getElementById("warner").style.display="";
            document.getElementById("alert-text").innerText=JSON.parse(this.responseText).msg;
            showAllBlog();
        }
        else if(this.status===500)
        {
            logout();
        }
    }

    xhtml.send();
}


const logout=()=>{
    document.cookie=`token=`;
    window.location.href='login.html';
}