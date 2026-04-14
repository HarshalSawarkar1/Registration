$(document).ready(function () {
    GetList();
})

var SaveRegistration = function () {
    $formData = new FormData();
    var photo = document.getElementById('fileselect');;
    if (photo.files.length > 0) {
        for (var i = 0; i < photo.files.length; i++) {
            $formData.append('file-' + i, photo.files[i]);
        }
    }

    var sr_No = $("#hdnSr_No").val();
    var name = $("#txtName").val();
    var address = $("#txtAddress").val();
    var email_Id = $("#txtEmail_Id").val();
    var dob = $("#txtDOB").val();
    var fileInput = $("#fileselect")[0];
    var mobile_No = $("#txtMobile_No").val();
    var pincode = $("#txtPincode").val();
    var password = $("#txtPassword").val();

    $formData.append('Sr_No', sr_No);
    $formData.append('Name', name);
    $formData.append('Address', address);
    $formData.append('Email_Id', email_Id);
    $formData.append('DOB', dob);
    if (fileInput.files.length > 0) {
        $formData.append("fb", fileInput.files[0]);
    }
    $formData.append('Mobile_No', mobile_No);
    $formData.append('Pincode', pincode);
    $formData.append('Password', password);

    if (name == "") {
        alert("Please Enter Your Name");
        $("#txtName").focus();
        return false;
    }
    else if (address == "") {
        alert("Please Enter Your Address");
        $("#txtAddress").focus();
        return false;
    }
    else if (email_Id == "") {
        alert("Please Enter Your Email_Id");
        $("#txtEmail_Id").focus();
        return false;
    }
    else if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email_Id)) {
        alert("Only Gmail Addresses are Allowed");
        $("#txtEmail_Id").focus();
        return false;
    }
    else if (dob == "") {
        alert("Please Enter Your DOB");
        $("#txtDOB").focus();
        return false;
    }
    else if (fileInput.files.length == "") {
        alert("Please Select Your Photo");
        $("#fileselect").focus();
        return false;
    }
    else if (mobile_No == "") {
        alert("Please Enter Your Mobile_No");
        $("#txtMobile_No").focus();
        return false;
    }
    else if (!/^\d{10}$/.test(mobile_No)) {
        alert("Please enter a valid 10-digit Mobile Number");
        $("#txtMobileNo").focus();
        return false;
    }
    else if (pincode == "") {
        alert("Please Enter Your Pincode");
        $("#txtPincode").focus();
        return false;
    }
    else if (!/^\d{6}$/.test(pincode)) {
        alert("Please enter a valid 6-digit Pincode");
        $("#txtPincode").focus();
        return false;
    }
    else if (password == "") {
        alert("Please Enter Your Password");
        $("#txtPassword").focus();
        return false;
    }
    else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(password)) {
        alert("Password must contain at least 1 uppercase, 1 lowercase, 1 number, 1 special character, and be at least 8 characters long.");
        $("#txtPassword").focus();
        return false;
    }

    $.ajax({
        url: "/Registration/SaveRegistration",
        method: "Post",
        data: $formData,
        contentType: false,
        processData: false,

        success: function (response) {
            alert("Successfull");
        }
    })
};

var GetList = function () {
    debugger
    $.ajax({
        url: "/Registration/GetList",
        method: "Post",
        contentType: "application/json;charset=utf-8",
        async: false,
        dataType: "json",

        success: function (response) {
            var html = "";
            $.each(response.model, function (index, elementvalue) {
                html += "<tr><td>" + elementvalue.Sr_No +
                    "</td><td>" + elementvalue.Name +
                    "</td><td>" + elementvalue.Address +
                    "</td><td>" + elementvalue.Email_Id +
                    "</td><td class='dob' data-dob='" + elementvalue.DOB +"'>" + formatDate(elementvalue.DOB) +
                    "</td><td class='age'>" +
                    "</td><td>  <img src = '../Content/Images/" + elementvalue.Photo + "'/height='100px',width'100px')/>" +
                    "</td><td>" + elementvalue.Mobile_No +
                    "</td><td>" + elementvalue.Pincode +
                    "</td><td>" + elementvalue.Password +
                    "</td><td>  <input type='button' value='Edit' class='btn btn-primary' onclick='EditReg(" + elementvalue.Sr_No + ")'/></td></tr>";

            });
            $("#Registration_Form tbody").html(html);

            AgeCalculate();
        }
    });
}

function formatDate(dateString) {
    var date = new Date(dateString);
    if (isNaN(date)) return "";
    var day = String(date.getDate()).padStart(2, '0');
    var month = String(date.getMonth() + 1).padStart(2, '0');
    var year = date.getFullYear();
    return `${day}/${month}/${year}`;
}
        
function AgeCalculate() {
    $("#Registration_Form tbody tr").each(function () {
        var dobStr = $(this).find(".dob").data("dob");
        if (dobStr) {
            var birthDate = new Date(dobStr);
            var today = new Date();

            var years = today.getFullYear() - birthDate.getFullYear();
            var months = today.getMonth() - birthDate.getMonth();
            var days = today.getDate() - birthDate.getDate();

            if (days < 0) {
                months--;
                var prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
                days += prevMonth.getDate();
            }

            if (months < 0) {
                years--;
                months += 12;
            }

            var ageText = years + " years";
            if (months > 0 || days > 0) {
                ageText += " " + months + " months";
            }
            if (days > 0) {
                ageText += " " + days + " days";
            }

            $(this).find(".age").text(ageText);
        }
    });
}


var EditReg = function (Sr_No) {
    debugger
    var model = { Sr_No: Sr_No };
    $.ajax({
        url: "/Registration/EditReg",
        method: "POST",
        data: JSON.stringify(model),
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        async: false,

        success: function (response) {
            $("#hdnSr_No").val(response.model.Sr_No);
            $("#txtName").val(response.model.Name);
            $("#txtAddress").val(response.model.Address);
            $("#txtEmail_Id").val(response.model.Email_Id);
            $("#txtDOB").val(response.model.DOB);
            if (response.model.photo) {
                $("#imgPreview").attr("src", "/Content/Images/" + response.model.Photo);
                $("#lblFileName").text(response.model.Photo);
            }
            $("#txtMobile_No").val(response.model.Mobile_No);
            $("#txtPincode").val(response.model.Pincode);
            $("#txtPassword").val(response.model.Password);
        } 
    });
};

