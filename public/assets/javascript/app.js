// Job Save Button
$(document).on("click", ".btn.save", function(){
  var thisId = $(this).attr("data-id")
  $.ajax ({
    method: "POST",
    url: "/jobs/save/" + thisId
  }).then(function(){
    alert("Job has been saved!")
    location.reload();
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
$(document).on("click", ".btn.notes", function(){

})


$(document).on("click", "", function(){})

// Alert showing user there are no saved jobs
function noSavedJobs (){
  var notification = $(
    "<div class='alert alert-warning text-center'> <h4>Uh Oh! Looks like we don't have any saved articles.</h4>" +
    "<h5><a href='/scrape' class='no-jobs-notification'>Click here to look through available jobs!</a></h5></div>"
  )
  $(".saved-jobs-container").append(notification);
}
var jobs = $(".jobs")
if (jobs.length == 0) {
  noSavedJobs();
  needToScrape();
}

// Prompt telling user to scrape jobs
function needToScrape () {
  var notification = $(
    "<div class='alert alert-warning text-center'> <h4>Uh Oh! Scrape to find available Jobs!</h4>" +
    "<h5><a href='/scrape' class='no-jobs-notification'>Click here to find available jobs!</a></h5></div>"
  )
  $(".job-wrapper").append(notification);
}
