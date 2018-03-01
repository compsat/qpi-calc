$(document).ready(function() {

	$(".input-table").on("mouseenter", ".input-row", function() {
		if($(this).index() != 1 || $(".input-row").length != 1)
			$(this).find(".delete-btn").css("visibility", "visible");
	});

	$(".input-table").on("mouseleave", ".input-row", function() {
		$(this).find(".delete-btn").css("visibility", "hidden");
	});

	$(".input-table").on("click", ".delete-btn", function() {
		$(this).parent().remove();
		updateQPI();
	});

	$(".add-btn").on("click", function() {
		aisisRowTotal = $(".input-row.aisis-rows").length;
		rowTotal = $(".input-row").length;
		$(".input-table > tbody > tr").eq(rowTotal-aisisRowTotal).after("<tr class='input-row'>" + $(".input-row").html() + "</tr>");
	});
	
	$(".modal-fill-btn").on("click", function() {
		addSemClasses();
		updateQPI();
	});
	
	$(".reset-btn").on("click", function() {
		$(".input-row:eq(0) .course-code").val("");
		$(".input-row:eq(0) .unit-select").val(3);
		$(".input-row:eq(0) .grade-select option:eq('0')").prop('selected', true);
		$(".input-table").find("tr:gt(1)").remove();
		aisisRowTotal = 0;
		qpi = "-";
		targetQpi = "-";
		updateQPI();
	});

	$(".input-card").on("change", ".input-select", updateQPI);
	
	$('.target-end').on('input',function(){
    	updateQPI();
	});
	
	$('.target-end').on('blur',function(){
		if($('.target-end').val() > 4)
			$('.target-end').val("4.00")
		else if($('.target-end').val() < 0)
			$('.target-end').val("0.00")
		else if($('.target-end').val() == "")
			$('.target-end').val("1.25")
	});
	
	$('.sem-units').on('input',function(){
    	updateQPI();
	});
	
	$('.sem-units').on('blur',function(){
		if($('.sem-units').val() < 0)
			$('.sem-units').val("0")
		else if($('.sem-units').val() == "")
			$('.sem-units').val("15")
	});

	qpi = "-";
	targetQpi = "1.25";

	function addSemClasses() {
		summary = $(".txt-area").val();
		summSplit = summary.split(/\s\t|\t|\n/);
		course_codes = [];
		course_units = [];
		gradeValue = [];
		grade_index = [];
		currCourseCode = "";
		ifUncredited = false;
		
		for (i=0; i<summSplit.length; i++) {
			if (i%7==3) { 
				currCourseCode = summSplit[i];
				ifUncredited = currCourseCode.startsWith("INTAC") || currCourseCode.startsWith("PE") || currCourseCode.startsWith("NSTP");
				if(ifUncredited)
					continue;
				else
					course_codes.push(currCourseCode);
			}
			if (i%7==5 && !ifUncredited) {
				course_units.push(summSplit[i]);
			}
			if (i%7==6 && !ifUncredited) {
				if (summSplit[i]=="A") grade_index.push(1);
				else if (summSplit[i]=="B+") grade_index.push(2);
				else if (summSplit[i]=="B") grade_index.push(3);
				else if (summSplit[i]=="C+") grade_index.push(4);
				else if (summSplit[i]=="C") grade_index.push(5);
				else if (summSplit[i]=="D") grade_index.push(6);
				else grade_index.push(0);
			}
		}
		
		rowTotal = $(".input-row").length;
		initialRowTotal = rowTotal;
		emptyTable = $(".input-row:eq(0) .grade-select option:eq('0')").is(':selected');
		
		for (i=0; i<course_codes.length; i++) {
			currRow = rowTotal + i;
			$(".input-table").append("<tr class='input-row aisis-rows'>" + $(".input-row").html() + "</tr>");
			$(".input-row:eq(" + currRow + ") .course-code").val(course_codes[i]);
			$(".input-row:eq(" + currRow + ") .unit-select").val(course_units[i]);
			$(".input-row:eq(" + currRow + ") .grade-select option:eq(" + grade_index[i] + ")").prop('selected', true);
		}
		if(emptyTable && initialRowTotal == 1)
			$(".input-row:eq(0)").remove();
	}

	function updateQPI() {
		rowTotal = $(".input-row").length;
		aisisRowTotal = $(".input-row.aisis-rows").length;
		gradeTotal = 0;
		unitTotal = 0;
		aisisGradeTotal = 0;
		aisisUnitTotal = 0;
		target = $(".target-end").val();
		semUnits = $(".sem-units").val();

		for(i = 0; i < rowTotal; i++) {
			gradeSelectVal = $(".input-row:eq(" + i + ") .grade-select").val();
			
			if (gradeSelectVal != "-") {
				grade = parseFloat(gradeSelectVal);
				units = parseFloat($(".input-row:eq(" + i + ") .unit-select").val());
				gradeTotal += grade*units;
				unitTotal += units;
			}
		}
		
		for(i = 0; i < aisisRowTotal; i++) {
			gradeSelectVal = $(".input-row.aisis-rows:eq(" + i + ") .grade-select").val();
			
			if (gradeSelectVal != "-") {
				grade = parseFloat(gradeSelectVal);
				units = parseFloat($(".input-row.aisis-rows:eq(" + i + ") .unit-select").val());
			}
		}

		if (isNaN(qpi)) {
			qpi = (gradeTotal/unitTotal).toFixed(2);
			setQPI(qpi);
		} else {
			qpi = (gradeTotal/unitTotal).toFixed(2);
			animateQPI(Math.abs(qpi - parseFloat($(".qpi-display").text()))/20);
		}
		
		if (isNaN(targetQpi)) {
			targetQpi = Number((target*(unitTotal+Number(semUnits))-gradeTotal)/Number(semUnits)).toFixed(2);
			setTargetQPI(targetQpi);
		} else {
			targetQpi = Number((target*(unitTotal+Number(semUnits))-gradeTotal)/Number(semUnits)).toFixed(2);
			animateTargetQPI(Math.abs(targetQpi - parseFloat($(".target-qpi").text()))/20);
		}
	}

	var animateQPI = function(step) {
		window.setTimeout(function() {
			if ($(".qpi-display").text() != qpi) {
				gradeDisplay = parseFloat($(".qpi-display").text());

				if (Math.abs(qpi - (gradeDisplay + step)) < step)
					step = Math.abs(qpi - gradeDisplay);

				if (step < 0.01)
					step = 0.01;

				if ($(".qpi-display").text() < qpi)
					addend = step;
				else
					addend = -step;

				setQPI((gradeDisplay + addend).toFixed(2));
			
				animateQPI(step);
			}
		}, 20);
	}
	
	var animateTargetQPI = function(step) {
		window.setTimeout(function() {
			if ($(".target-qpi").text() != targetQpi) {
				gradeDisplay = parseFloat($(".target-qpi").text());

				if (Math.abs(targetQpi - (gradeDisplay + step)) < step)
					step = Math.abs(targetQpi - gradeDisplay);

				if (step < 0.01)
					step = 0.01;

				if ($(".target-qpi").text() < targetQpi)
					addend = step;
				else
					addend = -step;

				setTargetQPI((gradeDisplay + addend).toFixed(2));
			
				animateTargetQPI(step);
			}
		}, 20);
	}

	function setQPI(qpi) {
		if (!isNaN(qpi))
			$(".qpi-display").text(qpi);
		else
			$(".qpi-display").text("-");
	}
	
	function setTargetQPI(qpi) {
		if (isNaN(qpi) || qpi > 4 || qpi < 0) {
			$(".target-qpi").text("IMPOSSIBLE");
			$(".target-qpi").css("font-size", "35pt");
			targetQpi = "-";
		}
		else {
			$(".target-qpi").text(qpi);
			$(".target-qpi").css("font-size", "67pt");
		}
	}
});