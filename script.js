$( document ).ready(readyNow);

//create empty array to store employees
const employeesList = [];
//create global for sorting table - default: lastName
let sortTableBy = "lastNameDESCENDING";

/*Create a delete button that removes an employee from the DOM. For Base mode, it does **not** need to remove that Employee's salary from the reported total.*/

//functions listed in alphabetical order

function addEmployee(){
    // enforce ID uniqueness by refusing to add duplicate ID numbers
    let alreadyInArray = false;
    $( "#warning" ).remove();
    for (const employee of employeesList){
        if (employee.idNumber === $( "#idNumberIn" ).val()){
            alreadyInArray = true;
            break;
        }
    }
    
    if (alreadyInArray) {
        // if ID number is already in array, display warning and do not add employee
        $( "#addEmployeeSection" ).append( `<h2 id="warning" style="color:red">ID number ${$( "#idNumberIn" ).val()} is already in the table. Please ensure you have the correct ID and try again.</h2>` );
    } else if (isNaN($( "#annualSalaryIn" ).val()) || $( "#annualSalaryIn" ).val()==="" ) {
        // if annualSalary field is not a number, display warning and do not add employee
        $( "#addEmployeeSection" ).append( `<h2 id="warning" style="color:red">Annual salary ${$( "#annualSalaryIn" ).val()} is not a valid salary. please enter a number and try again.</h2>` );
    } else {
        // construct new employee object
        let newEmployee = new employeeConstructor(
            $( "#firstNameIn" ).val(),
            $( "#lastNameIn" ).val(),
            $( "#idNumberIn" ).val(),
            $( "#jobTitleIn" ).val(),
            $( "#annualSalaryIn" ).val(),
        );

        // add to employeesList array
        employeesList.push(newEmployee);
        
        // sort employeesList array by current sortTableBy
        doSort();

        // populate table from EmployeesList array
        populateEmployeesTable();

        // empty inputs
        $( "#firstNameIn" ).val("");
        $( "#lastNameIn" ).val("");
        $( "#idNumberIn" ).val("");
        $( "#jobTitleIn" ).val("");
        $( "#annualSalaryIn" ).val("");
    }
    } //end addEmployee

function deleteRow() {
    
} //end deleteRow

function doSort() {
    // determine whether to sort in ASCENDING or DESCENDING order of sort column
    let ascendingOrDescending = sortTableBy.indexOf("ASCENDING") > -1;
    if (ascendingOrDescending) {
        let sortColumn = sortTableBy.replace("ASCENDING","");
        if (sortColumn === 'annualSalary') {
            employeesList.sort(function(a, b) {
                return Number(a[sortColumn]) - Number(b[sortColumn]);
        });
        } else {
            employeesList.sort(function(a, b) {
                const textA = a[sortColumn].toUpperCase();
                const textB = b[sortColumn].toUpperCase();
                return (textA < textB) ? 1 : (textA > textB) ? -1 : 0;
            });
        }
    } else {
        let sortColumn = sortTableBy.replace("DESCENDING","");
        if (sortColumn === 'annualSalary') {
            employeesList.sort(function(a, b) {
                return Number(b[sortColumn]) - Number(a[sortColumn]);
            });
        } else {
            employeesList.sort(function(a, b) {
                const textA = a[`${sortColumn}`].toUpperCase();
                const textB = b[`${sortColumn}`].toUpperCase();
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            });
        }
    }
} //end doSort

/**
 * constructs employee object
 * @param {string} firstName 
 * @param {string} lastName 
 * @param {number} idNumber 
 * @param {string} jobTitle 
 * @param {number} annualSalary 
 */
 function employeeConstructor(firstName, lastName, idNumber, jobTitle, annualSalary) {
    let employee = {
        firstName : firstName,
        lastName : lastName,
        idNumber : idNumber,
        jobTitle : jobTitle,
        annualSalary : annualSalary
    };
    return employee;
} //end employeeConstructor

function populateEmployeesTable() {
    let el = $( "#employeesTableBody" );
    let totalMonthlyCost = 0;
    el.empty();
    for (const employee of employeesList) {
        totalMonthlyCost += Number(employee.annualSalary)/12;
        el.append(
            `<tr>
                <td>${employee.firstName}</td>
                <td>${employee.lastName}</td>
                <td>${employee.idNumber}</td>
                <td>${employee.jobTitle}</td>
                <td>$${employee.annualSalary.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                <td><button class="deleteButton">Delete</button></td>
            </tr>`
        )
    }
    el.append(
        `<tr></tr>
        <tr>
                <td></td>
                <td></td>
                <td></td>
                <td>Total Monthly: </td>
                <td ${(totalMonthlyCost > 20000) ? "style='background-color: red;'": ""} >$${(Math.round(totalMonthlyCost*100)/100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                <td></td>
        </tr>`
    )
} //end populateEmployeesTable

/**
 * readyNow runs in the background as soon as document loads - listens for events and calls the relevant functions accordingly
 */
 function readyNow() {
    $( "#submitButton" ).on("click", addEmployee );
    $( "#employeesTableHeader" ).on("click", "th", setSort );
    $( "#employeesTableBody" ).on("click",".deleteButton", deleteRow);
} //end readyNow

function setSort() {
    //update what column to sort employees by
    //the employee property name is the same as the header id with the word Column removed from the end
    //click column header again to reverse order - use UP or DOWN to keep track
    if (this.id !== deleteButtonColumn) {
        sortTableBy = (sortTableBy.indexOf("ASCENDING") > -1) ? this.id.replace("Column","DESCENDING") : this.id.replace("Column","ASCENDING");
        doSort();
        populateEmployeesTable();
    }
} //end setSort