$( document ).ready(readyNow);

//create empty array to store employees
const employeesList = [];
//create global for sorting table - default: lastName
let sortTableBy = "lastNameDESCENDING";

/*A 'Submit' button should collect the form information, store the information to calculate monthly costs, append information to the DOM and clear the input fields. Using the stored information, calculate monthly costs and append this to the to DOM. If the total monthly cost exceeds $20,000, add a red background color to the total monthly cost.

Create a delete button that removes an employee from the DOM. For Base mode, it does **not** need to remove that Employee's salary from the reported total.*/

/**
 * readyNow runs in the background as soon as document loads - listens for events and calls the relevant functions accordingly
 */
function readyNow() {
    $( "#submitButton" ).on("click", addEmployee );
    $( "#employeesTableHeader" ).on("click", "th", setSort );
} //end readyNow

function addEmployee(){
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
} //end addEmployee

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

function populateEmployeesTable() {
    let el = $( "#employeesTableBody" );
    el.empty();
    for (const employee of employeesList) {
        el.append(
            `<tr>
                <td>${employee.firstName}</td>
                <td>${employee.lastName}</td>
                <td>${employee.idNumber}</td>
                <td>${employee.jobTitle}</td>
                <td>$${employee.annualSalary.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                <td><button>Delete</button></td>
            </tr>`
        )
    }
} //end populateEmployeesTable

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



/* just grabbing some IDs to avoid having to switch back and forth - will delete this comment later
    id="firstNameIn" placeholder="First Name"
    id="lastNameIn" placeholder="Last Name"
    id="idNumberIn" placeholder="ID"
    id="jobTitleIn" placeholder="Title"
    id="annualSalaryIn" placeholder="Annual Salary"
    id="submitButton"
    id="employeesTable"*/