//wait until the dom content is fully loaded
document.addEventListener("DOMContentLoaded",() => {

    //get all the refrerence to the DOM elemets

    const entryList =document.getElementById("entry-list");
    const totalIncome =document.getElementById("total-income");
    const totalExpenses =document.getElementById("total-expenses");
    const netBalance =document.getElementById("net-balance");
    const addEntryButton =document.getElementById("add-entry");
    const updateEntryButton =document.getElementById("update-entry");
    const descriptionInput =document.getElementById("decsription");
    const amopuntInput =document.getElementById("amount");
    const typeSelect =document.getElementById("type");
    const filterRadios =document.querySelectorAll('input[name="filter"]');


    //load the entries from the local storage or initialize as an empty array

    let entries =JSON.parse(localstorage.getItem('entries'))||[];

    let editingIndex =-1;//index of the entry that being edited 



    //function to calculate and update totals 
    
    
    const calculateTotals= () => {
        let income=0;
        let expenses=0;
        entries.forEach(entry => {
            if(entry.type ==='income'){
                income +=parseFloat(entry.amount);
            }else{
                expenses +=parseFloat(entry.amount);
            }
        });

        totalIncome.textcontent=income.toFixed(2);
        totalExpenses.textcontent=expenses.toFixed(2);
        netBalance.textontent=(income-expenses).toFixed(2);
    };


//function to render entries bases on the filterv

const renderEntries=(filter ='all') => {
    entryList.innerHTML ='';//clearing the existing list
    entries.filter(entry =>filter ==='all' || entry.type === filter)
    .forEach((entry,index)=> {
        const li=document.createElement('li');
        li.innerHTML=`
        ${entry.description} - ${entry.amount} (${entry,type})
        <button onclick ="editEntry(${index})">Edit </button>
        <button onclick="deleteEntry(${index})">Delete</button>
    `
    entryList.appendChild(li)
    });
    calculateTotals();
;}

//function to add new entry

const addEntry =() =>{
    const description =descriptionInput.value;
    const amount =parseFloat(amountInput.value);
    const type =typeSelect.value;

    //validate input filelds 
    if(description &&  !isNaN(amount)  && amount >0 ){
        if (editingIndex > -1){
            entries[editingIndex] ={description,amount,type};
            editingIndex = -1;
            addEntryButton.style.display="inline";
            updateEntryButton.style.display="none"
        }else{
            entries.push({description,amount,type})
        }
        localStorage.setItem("entries",JSON.stringify(entries));
        renderEntries();

        //clear the input fields 
        descriptionInput.value='';
        amountInput.value='';
        typeSelect.value='income';
    }
};

//funcion to edit the entry
window.editEntry =(index) =>{
    const entry =entries[index];
    descriptionInput.value =entry.description;
    amountInput.value=entry.amount;
    typeSelect.value =entry.type;
    editingIndex=index;
    addEntryButton.style.display="none";
    updateEntryButton.style.display="inline";
};

//function to delete the entry 
window.deleteEntry =(index) => {
    entries.splice(index,1);//remove the netry from the array
    localstorage.SetItem('entries',JSON.stringify(entries));
    renderEntries()
}

//even listener for the "add entry" button
addEntryButton.addEventListener('click',addEntry)

//even listener fo rthe "update entry" button
updateEntryButton.addEventListener('click',addEntry)

//event listeners for filters changes 
filterRadios.forEach(radio => {
    radio.addEventListener('change',() => {
        renderEntries(radio.value);
    })
})

//initial rendering of the entries 
renderEntries()
})