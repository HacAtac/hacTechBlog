//this function is used to add a post to the database and to the page
// and to update the user's post count and the user's last post time
// also updates the user's last post time and post count in the database
async function newFormHandler(event) {
  event.preventDefault();

  const title = document.querySelector('input[name="post-title"]').value;
  const post_url = document.querySelector('input[name="post-url"]').value;
  const post_content = document.querySelector(
    'input[name="post-description"]'
  ).value;

  const response = await fetch("/api/posts", {
    method: "post",
    body: JSON.stringify({
      title,
      post_url,
      post_content,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    document.location.replace("/dashboard");
  } else {
    alert(response.statusText);
  }
}
document
  .querySelector(".new-post-form")
  .addEventListener("submit", newFormHandler);
