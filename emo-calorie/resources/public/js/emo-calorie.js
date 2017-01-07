/**
 * Created by Dusan on 02.01.2017..
 */

$(document).ready(function() {
    $("#smiley").on("mouseover", toggleSmileyHover);
    $("#smiley").on("mouseout", toggleSmileyHover);
    $("#smiley").on("click", addFoodModal);
    $("#addFood").on("click", addFood);
    $("#setCaloriesToday").on("click", setCalories);

    setDefaultValues();

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
        $("#goalToday").val($txtCaloriesToday.val());
        setCaloriesToday($txtCaloriesToday.val());
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

function setDefaultValues() {
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
                $("#goalToday").val(status.goal);
                setCaloriesToday(Number(status.goal) - Number(status.calories));
                setFoodTable();
            }
        }
    }).fail(function () {
        toastr.error("Couldn't get a goal.", "Error");
    }).always(function () {
        $("#loading").hide();
    });
}

function setFoodTable() {
    var $foodTable = $("#foodTable");
    $("#loading").show();
    $.ajax({
        url: "/getfood",
    }).done(function (data) {
        if (data !== "") {
            $foodTable.show();
            $($.parseJSON(data)).each(function () {
                var food = this;
                var id = food.id;
                var name = food.name;
                var calories = food.calories;
                addFoodRow(id, name, calories);
            });

            animateOpacity($foodTable, 0, 1000);
        }
    }).fail(function () {
        toastr.error("Couldn't get foods.", "Error");
    }).always(function () {
        $("#loading").hide();
    });
}

function setCaloriesToday(value) {
    var $caloriesToday = $("#caloriesToday");
    $caloriesToday.text(value);
    animateOpacity($caloriesToday, 0, 1000);
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

    $("#loading").show();
    var name = $("#txtFoodName").val();
    var calories = $("#txtCalories").val();
    var current = Number($("#goalToday").val()) - Number($("#caloriesToday").text());

    $.ajax({
        url: "/food",
        method: "POST",
        data: { name: name, calories: calories, current: current }
    }).done(function () {
        toastr.info("Yammiii!", "Mmmmmm...");
        $("#addFoodModal").modal("toggle");
        $("#txtCalories").val("");
        $("#txtFoodName").val("");
        setCaloriesToday(Number($("#caloriesToday").text()) - Number(calories));
        var nbr = $("#foodTable>tbody>tr").length + 1;
        addFoodRow(0, name, calories); //todo: select and set id
        animateOpacity($table, 0, 1000);
    }).fail(function () {
        toastr.error("We couldn't add your food. Sorry!", "Error");
    }).always(function () {
        $("#loading").hide();
    });
}

function addFoodRow (id, name, calories) {
    var $table = $("#foodTable");
    $table.show();
    var $tbody = $("#foodTable>tbody");

    var $tr = $("<tr></tr>");
    $tr.data("id", id);
    var nbr = $("#foodTable>tbody>tr").length + 1;
    var $tdNbr = $("<td></td>");
    $tdNbr.text(nbr);
    $tr.append($tdNbr);

    var $tdName = $("<td></td>");
    $tdName.text(name);
    $tr.append($tdName);

    var $tdCalories = $("<td></td>");
    $tdCalories.text(calories);
    $tr.append($tdCalories);

    $tbody.append($tr);
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
