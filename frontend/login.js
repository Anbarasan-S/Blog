
const loader=document.getElementsByClassName('loader')[0];
const form=document.getElementsByClassName('form-container')[0];

const resetLoading=(mode)=>mode===0?loader.style.display='none':loader.style.display='';
const resetForm=(mode)=>mode===0?form.style.display='none':form.style.display='';

const initialCheck=()=>{
    const tokens=document.cookie.split(";");
    for(let token of tokens)
    {
        if(token.split("=").length==2)
        {
            if(token.split("=")[0]==="token"&&token.split("=")[1]!='')
            {
                window.location.href='index.html';
                return;
            }
        }
    }
    resetForm(1);
}

initialCheck();

const loginSubmitHandler=(e)=>{
    console.log(loader.style.display);
    resetLoading(1);
    resetForm(0);
    e.preventDefault();
   let xhtml=new XMLHttpRequest();
    xhtml.open('POST',`http://localhost:5000/api/blog/account/login`,true);
    xhtml.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhtml.setRequestHeader('x-auth-token',"the");

    let json = JSON.stringify({
        email: document.getElementsByName("email")[0].value,
        password:document.getElementsByName("password")[0].value
      });
      
    xhtml.onload=function(){
        if(this.status===200)
        {
            const obj=JSON.parse(this.responseText);
            document.cookie=`token=${obj.token};  SameSite=None; Secure`;
            window.location.href='/index.html';
        }
        else
        {
            const obj=JSON.parse(this.responseText);
            document.getElementById('alert-text').innerText=obj.msg;
            document.getElementById('warner').style.display='';
            resetLoading(0);
            resetForm(1);
        }
    }

    xhtml.onreadystatechange=function(){
        if(this.status===0&&this.readyState===4)
            {
                document.getElementById('alert-text').innerText=`Can't connect with the server please check your Internet`;
                document.getElementById('warner').style.display='';
                resetLoading(0);  
            }
    }
    xhtml.send(json);
}


