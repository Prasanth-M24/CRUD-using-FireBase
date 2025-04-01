import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove, set } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

const appSetting = {
    databaseURL : "https://js-crud-b1d9c-default-rtdb.firebaseio.com/",
};

const app = initializeApp( appSetting );
const database = getDatabase( app );
const userListInDB = ref( database, "users" );

const idEl = document.querySelector( "#id" );
const nameEl = document.querySelector( "#name" );
const ageEl = document.querySelector( "#age" );
const cityEl = document.querySelector( "#city" );
const frm = document.querySelector( "#frm" );
const tblbodyEl = document.querySelector( "#tblbody" );

frm.addEventListener("submit", function(e){
    e.preventDefault();
    if( !nameEl.value.trim() || !ageEl.value.trim() || !cityEl.value.trim() ){
        alert( "Enter all details" )
    }

    if( idEl.value ){
        // update record
        set(ref(database, "users/" + idEl.value), {
            name: nameEl.value.trim(),
            age: ageEl.value.trim(),
            city: cityEl.value.trim()
        })
        clearValue();
        return;
    }
    // insert record
    const newUser ={
        name : nameEl.value.trim(),
        age : ageEl.value.trim(),
        city : cityEl.value.trim()
    }
    push( userListInDB, newUser );
    clearValue();
} );

function clearValue(){
    nameEl.value = "";
    ageEl.value = "";
    cityEl.value = "";
    idEl.value = "";
}

onValue( userListInDB, function( snapshot ){
    if( snapshot.exists() ){
        let userArray = Object.entries( snapshot.val() );
        console.log(userArray);
        tblbodyEl.innerHTML = ""
        for(let i=0;i<userArray.length;i++){
            let currentUser = userArray[i];
            // console.log(currentUser);
            let userId = currentUser[0];
            let userValue = currentUser[1];
            tblbodyEl.innerHTML += ` 
            <tr>
                <td>${i+1}</td>
                <td>${userValue.name}</td>
                <td>${userValue.age}</td>
                <td>${userValue.city}</td>
                <td><button class="btn-edit" data-id=${userId}><i class="fa-solid fa-pen-to-square "></i></button></td>
                <td><button class="btn-delete" data-id=${userId}><i class="fa-solid fa-trash "></i></button></td>
            </tr>`
        }
    }
    else{
        tblbodyEl.innerHTML = "<tr><td colspan='6'>No data found</td></tr>";
    }
} );

document.addEventListener("click", function(e){

    if (e.target.classList.contains("btn-edit")) {
        let id = e.target.dataset.id;
        // console.log( e.target.closest("tr").children );
        const tdElement = e.target.closest("tr").children;
        idEl.value = id;
        nameEl.value = tdElement[1].textContent;
        ageEl.value = tdElement[2].textContent;
        cityEl.value = tdElement[3].textContent;
    }
    else if (e.target.classList.contains("btn-delete")) {
        if (confirm("Are you sure to delete?")) {
            let id = e.target.dataset.id;
            // console.log("delete", id);
            let data =ref( database, `users/${id}` );
            remove(data);
        }
    }
   
})