let submit_click=false;
const err_msg="The password must contains atleast 6 characters and must contain one lowercase one uppercase one digit and a special character";
const re=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
let re_password=document.getElementsByName("repassword")[0];
const loader=document.getElementsByClassName('loader')[0];
const form=document.getElementsByClassName('form-container')[0];

const loginValidator=(event)=>
{
    event.preventDefault();
    const email=document.getElementsByName("email")[0].value;
    const password=document.getElementsByName("password")[0].value;
  
    if(changeHandler()&&repassChangeHandler())
    {

        document.getElementsByClassName("form-container")[0].style.display="none";
        resetLoading(1);
        let xhtml=new XMLHttpRequest();
        
            xhtml.open("POST","http://localhost:5000/api/blog/account/signup",true);
            xhtml.setRequestHeader("Content-type","application/json; charset=utf-8");
        

        xhtml.onload = function() {
            if(this.status===200)
            {
                const obj=JSON.parse(this.responseText);
                document.getElementById('alert-text').innerText=obj.msg;
                document.getElementsByClassName('alert')[0].className="alert alert-secondary alert-dismissible fade show d-flex justify-content-center";
                document.getElementById('warner').style.display='';
                resetLoading(0);
            }
            else
            {
                document.getElementById('alert-text').innerText=JSON.parse(this.responseText).msg;
                document.getElementById('warner').style.display='';
                resetLoading(0);
                resetForm(1);
            }
        };

        xhtml.onreadystatechange=function()
        {
        
            if(this.status===0&&this.readyState===4)
            {
                document.getElementById('alert-text').innerText=`Can't connect with the server please check your Internet`;
                document.getElementById('warner').style.display='';
                resetLoading(0);
                resetForm(1);
            }
        }
        const body=JSON.stringify({email,password});
        xhtml.send(body);
}

}


            
const resetLoading=(mode)=>mode===0?loader.style.display='none':loader.style.display='';
const resetForm=(mode)=>mode===0?form.style.display='none':form.style.display='';


const changeHandler=()=>{
    let changed_password=document.getElementsByName('password')[0].value;
    let password_msg=document.getElementById('pass-err');

    if(re_password.value!=="")
    {
        repassChangeHandler();
    }

    if(re.test(changed_password))
   {
       password_msg.innerText='';
    document.getElementsByName('password')[0].style.borderColor='';
    return true;
    }
    else
    {
     password_msg.innerText=err_msg;
     document.getElementsByName('password')[0].style.borderColor='red';
     return false;
    }
}

const repassChangeHandler=()=>{
    let re_password=document.getElementsByName('repassword')[0];
    let changed_password=document.getElementsByName('password')[0];

    

    if(re_password.value!==changed_password.value)
    {
       document.getElementById('repass-err').innerText='The password does not match with the actually entered password';
       re_password.style.borderColor='red';
       return false;
    }
    else
    {
        re_password.style.borderColor='';
        document.getElementById('repass-err').innerText='';
        return true;
    }
}

const focusHandler=()=>{
    let changed_password=document.getElementsByName('password')[0];

    if(changed_password.value==='')
    {
        changed_password.focus();
        changeHandler();
        return;
    }
    if(document.getElementsByName('repassword')[0].value!=='')
    repassChangeHandler();
}