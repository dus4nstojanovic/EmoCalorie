/**
 * Created by Dusan on 02.01.2017..
 */

$(document).ready(function() {
    $("#smiley").on("mouseover", toggleSmileyHover);
    $("#smiley").on("mouseout", toggleSmileyHover);
    $("#smiley").on("click", addFoodModal);
    $("#addFood").on("click", addFood)


    $('[data-toggle="tooltip"]').tooltip();
    setToastrOptions();
});

function toggleSmileyHover() {
    var $balloon = $("#talking-container");

    if($balloon.hasClass("hover")) {
        $balloon.removeClass("hover");
    } else {
        $balloon.addClass("hover");
    }
}

function addFoodModal() {
    $("#addFoodModal").modal("toggle");
}

function addFood() {
    if (!validateFields()) {
        return;
    }

    $("#addFoodModal").modal("toggle");
    $("#loading").show();
    $("#txtCalories").val("");
    $("#txtFoodName").val("");

    //todo: do ajax logic here...

    //todo: toastr.info("Yammiii!", "Mmmmmm..."); on success
}

function validateFields() {
    var isValid = true;
    if($("#txtFoodName").val().length < 3) {
          toastr.error("Food name isn't valid.", "Couldn't add food");
        isValid = false;
    }

    var $calories = $("#txtCalories");

    if($calories.val().length <= 0) {
        toastr.error("Food calories is required field.", "Couldn't add food")
        isValid = false;
        return false;
    }

    if(isNaN(Number($calories.val()))) {
        toastr.error("Food calories isn't a number", "Couldn't add food");
        isValid = false;
    }

    return isValid
}

function setToastrOptions() {
    toastr.options = {
        "positionClass": "toast-top-left"
    };
}
