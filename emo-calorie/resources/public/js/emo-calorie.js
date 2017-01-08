$(document).ready(function() {
    $("#smiley").on("mouseover", toggleSmileyHover);
    $("#smiley").on("mouseout", toggleSmileyHover);
    $("#smiley").on("click", addFoodModal);
    $("#addFood").on("click", addFood);
    $("#setCaloriesToday").on("click", setCalories);
    $("#foodTable").on("click", "tbody>tr", removeFood);
    $("#caloriesToday").on("click", resetForToday);

    setDefaultValues();

    $('[data-toggle="tooltip"]').tooltip();
    setToastrOptions();
});

function resetForToday() {

    $("#loading").show();

    $.ajax({
        url: "/reset",
        method: "POST"
    }).done(function () {
        setDefaultValues();
        $("#foodTable>tbody").empty();
        $("#foodTable").hide();
    }).fail(function () {
        toastr.error("Sorry. Please try again latter", "Couldn't reset");
    }).always(function () {
        $("#loading").hide();
    });
}

function removeFood() {
    var id = $(this).data("id");
    var currentNew = Number($("#goalToday").val()) - (Number($("#caloriesToday").text()) + Number(getCaloriesFromRow(id)));
    $("#loading").show();

    $.ajax({
        url: "/removefood",
        method: "POST",
        data: {id: id, current: currentNew}
    }).done(function () {
        $("tr[data-id='" + id + "']").remove();

        var $rows = $("#foodTable>tbody>tr");
        var consumedToday = 0;
        $("#foodTable>tbody").empty();

        if ($rows.length === 0) {
            $("#foodTable").hide();
            $(".tooltip").hide();
            setCaloriesToday($("#goalToday").val());
        } else {
            $rows.each(function () {
                var $row = $(this);
                var idcurrent = $row.data("id");
                var name = $($row.children("td")[1]).text();
                var calories = $($row.children("td")[2]).text();
                consumedToday += Number(calories);
                addFoodRow(idcurrent, name, calories);
            });
            animateOpacity($("#foodTable"), 0, 500);
            setCaloriesToday(Number($("#goalToday").val()) - consumedToday);
        }
    }).fail(function () {
        toastr.error("Sorry, but we couldn't remove your food.", "Couldn't remove food");
    }).always(function () {
       $("#loading").hide();
    });
}

function getCaloriesFromRow(id) {
    var $row = $("tr[data-id='" + id + "']");
    return $($row.children("td")[2]).text();
}

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

        $txtCaloriesToday.val("");
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
        if (data !== "" && data !== "[]") {
            $foodTable.show();
            $($.parseJSON(data)).each(function () {
                var food = this;
                var id = food.id;
                var name = food.name;
                var calories = food.calories;
                addFoodRow(id, name, calories);
            });

            animateOpacity($foodTable, 0, 500);
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

    setEmotion();
}

function setEmotion() {
    var caloriesLeft = Number($("#caloriesToday").text());
    var goal = Number($("#goalToday").val());
    var percentLeft = caloriesLeft/goal;

    if (percentLeft > 0.8) {
        setState("#1979ff", "FEED ME!", "/images/happy.png");
    } else if (percentLeft > 0.6 && percentLeft <= 0.8) {
        setState("#371cff", "YES PLEASE!", "/images/happy-one-hand.png");
    } else if (percentLeft > 0.4 && percentLeft <= 0.6) {
        setState("#6846ff", "IT'S OK!", "/images/fat.png");
    } else if (percentLeft > 0.2 && percentLeft <= 0.4) {
        setState("#d534ff", "HM! WHY NOT?", "/images/fatter.png");
    } else if (percentLeft > 0 && percentLeft <= 0.2) {
        setState("#ff32a5", "THIS IS LAST!", "/images/angry.png");
    } else {
        setState("#ff281d", "STOP!!", "/images/not good.png");
    }

    animateOpacity($("#smiley"), 0, 400);
}

function setState(background, text, src) {
    var $img = $("#smiley");
    var $ballonText = $("#talking-balloon-text");
    var $body = $("body");

    $img.attr("src", src);
    $ballonText.text(text);
    $body.css("background-color", background);
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
    }).done(function (id) {
        toastr.info("Yammiii!", "Mmmmmm...");
        $("#addFoodModal").modal("toggle");
        $("#txtCalories").val("");
        $("#txtFoodName").val("");
        setCaloriesToday(Number($("#caloriesToday").text()) - Number(calories));
        var nbr = $("#foodTable>tbody>tr").length + 1;
        addFoodRow(id, name, calories);
        animateOpacity($("#foodTable"), 0, 1000);
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
    $tr.attr("data-id", id);
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
