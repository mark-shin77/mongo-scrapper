// Job Save Button
$(document).on("click", ".btn.save", function(){
  var thisId = $(this).attr("data-id");
  $.ajax ({
    method: "POST",
    url: "/jobs/save/" + thisId
  }).then(function(){
    alert("Job has been saved!")
    location.reload();
  });
});

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
});

// Add note button
$(document).on("click", ".btn.save-note", function(){
  var newNote = $(".user-note").val();
  var newNoteContainer = $(
    "<div class='row'>" +
      "<div class='new-notes col-10'><p>"+ newNote +"</p></div>" +
      "<button type='button' class='btn btn-danger delete-note'> X </button>" +
    "</div>"
  )
  var thisId = $(this).attr("data-id");
  $.ajax ({
    method: "POST",
    url: "/jobs/" + thisId,
    data: {
      noteText: $("#user-text-input").val()
    }
  }).then(function(){
    $(".notes-container").append(newNoteContainer);
    $("#user-text-input").val("");
  })
});

// Delete note button
$(document).on("click", ".btn.delete-note", function(){

})

// Alert showing user there are no saved jobs
function noSavedJobs (){
  var notification = $(
    "<div class='alert alert-warning text-center'> <h4>Uh Oh! Looks like we don't have any saved articles.</h4>" +
    "<h5><a href='/scrape' class='no-jobs-notification'>Click here to look through available jobs!</a></h5></div>"
  )
  $(".saved-jobs-container").append(notification);
};

// Prompt telling user to scrape jobs
function needToScrape () {
  var notification = $(
    "<div class='alert alert-warning text-center'> <h4>Uh Oh! Scrape to find available Jobs!</h4>" +
    "<h5><a href='/scrape' class='no-jobs-notification'>Click here to find available jobs!</a></h5></div>"
  )
  $(".job-wrapper").append(notification);
};

var jobs = $(".jobs")
if (jobs.length == 0) {
  noSavedJobs();
  needToScrape();
};