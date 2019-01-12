// Job Save Button
$(document).on("click", ".btn.save", function(){
  var thisId = $(this).attr("data-id")
  $.ajax ({
    method: "POST",
    url: "/jobs/save/" + thisId
  }).then(function(){
    alert("Job has been saved!")
  })
})

// Job Delete Button
$(document).on("click", ".btn.delete", function(){
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "POST",
    url: "jobs/delete/" + thisId
  }).then(function(){
    console.log("Job Deleted")
    location.reload();
  });
})

// Add note button
$(document).on("click", "", function(){})


$(document).on("click", "", function(){})