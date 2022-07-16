const xhtml=new XMLHttpRequest();

const token=new URL(window.location.href).searchParams;
const loader=document.getElementsByClassName('loader')[0];

if(!token.get("token"))
{
    window.location.href="invalid.html";
}
xhtml.open('POST',`http://localhost:5000/api/blog/account/verify?token=${token.get("token")}`,true);

xhtml.send();


xhtml.onload = function() {
    if(this.status===200)
    {
       const obj=JSON.parse(this.responseText);
       document.getElementById('alert-text').innerText=obj.msg;
       document.getElementById('warner').style.color='green';
       document.getElementById('warn').className="alert alert-success alert-dismissible fade show d-flex justify-content-center";
       document.getElementById('warner').style.display='';
       resetLoading(0);
    }
    else
    {
        window.location.href="invalid.html";
        resetLoading(0);
    }
};

xhtml.onreadystatechange=function()
{

    if(this.status===0&&this.readyState===4)
    {
        document.getElementById('alert-text').innerText=`Can't connect with the server please check your Internet`;
        document.getElementById('warner').style.display='';
        resetLoading(0);
    }
}

const resetLoading=(mode)=>mode===0?loader.style.display='none':loader.style.display='';


