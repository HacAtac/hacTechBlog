// async function to handle comment form handler
//front end validation and ajax call to backend to save comment to database and display on page reload
async function commentFormHandler(event) {
  event.preventDefault();

  const comment_text = document
    .querySelector('textarea[name="comment-body]')
    .value.trim();

  //const = post_id to location and string/split the length minus 1
  const post_id = window.location.toString().split("/")[
    window.location.toString().split("/").length - 1
  ];

  if (comment_text) {
    const response = await fetch("/api/comments", {
      method: "POST",
      body: JSON.stringify({
        post_id,
        comment_text,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      document.location.reload();
    } else {
      alert(response.statusText);
    }
  }
}

//query selector for comment form and event listener for submit
document
  .querySelector(".comment-form")
  .addEventListener("submit", commentFormHandler);
