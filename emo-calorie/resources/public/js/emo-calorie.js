/**
 * Created by Dusan on 02.01.2017..
 */

$(document).ready(function() {
    $("#smiley").on("mouseover", toggleSmileyHover);
    $("#smiley").on("mouseout", toggleSmileyHover);
    $("#smiley").on("click", addFoodModal);
    $("#addFood").on("click", addFood);
    $("#setCaloriesToday").on("click", setCalories);

    setGoalModal();

    $('[data-toggle="tooltip"]').tooltip();
    setToastrOptions();
});

function setCalories() {
    var $txtCaloriesToday = $("#txtCaloriesToday");

    if ($txtCaloriesToday.val().length <= 0) {
        toastr.error("Calories goal is required field.", "Couldn't set goal");
        return;
    }

    //todo: we could add number spinner for calories goal text field
    if(isNaN(Number($txtCaloriesToday.val()))) {
        toastr.error("Calories goal must be a number", "Couldn't set goal");
        return;
    }
    $("#loading").show();
    $.ajax({
        url: "/goal",
        method: "POST",
        data: {goal: $txtCaloriesToday.val()}
    }).done(function() {
        toastr.success("It's Up To You.", "Good luck");
        $("#setGoalModal").modal("toggle");
        var $caloriesToday = $("#caloriesToday");
        $caloriesToday.text($txtCaloriesToday.val());
        animateOpacity($caloriesToday, 0, 1000);
    }).fail(function() {
        toastr.error("We couldn't set a goal for today. Go and eat. Enjoy!", "Error");
    }).always(function() {
        $("#loading").hide();
    });
}

function animateOpacity($target, value, speed) {
    $target.animate({
        "opacity": value
    }, speed / 2, function () {
        $target.animate({
            "opacity": "1"
        }, speed / 2)
    });
}

function setGoalModal() {
    $("#loading").show();
    $.ajax({
        url: "/getgoal"
    }).done(function (data) {
        if (data === "") {
            $("#setGoalModal").modal("toggle");
        } else {
            var status = $.parseJSON(data);
            var date = moment(status.sdate, "MM/DD/YYYY").startOf('day');
            var today = moment().startOf('day');
            var isAfter = today.isAfter(date);
            if(isAfter) {
                $("#setGoalModal").modal("toggle");
            } else {
                toastr.info("It's Up To You.", "Remeber");
                var $caloriesToday = $("#caloriesToday");
                $caloriesToday.text(status.goal);
                animateOpacity($caloriesToday, 0, 1000);
            }
        }

    }).fail(function () {
        toastr.error("Couldn't get a goal.", "Error");
    }).always(function () {
        $("#loading").hide();
    });
}

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
        toastr.error("Food calories is required field.", "Couldn't add food");
        isValid = false;
        return false;
    }

    if(isNaN(Number($calories.val()))) {
        toastr.error("Food calories isn't a number", "Couldn't add food");
        isValid = false;
    }

    return isValid;
}

function setToastrOptions() {
    toastr.options = {
        "positionClass": "toast-top-left"
    };
}
