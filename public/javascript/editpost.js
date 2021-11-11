async function editFormHandler(event) {
  // this function is called when the edit form is submitted and it handles the form submission
  // and then calls the editPost function to update the post in the database and then reloads the page to show the updated post
  event.preventDefault(); // this prevents the page from reloading

  const title = document.querySelector('input[name="post-title"]').value.trim();
  const id = window.location.toString().split("/")[
    window.location.toString().split("/").length - 1
  ];
  const response = await fetch(`/api/posts/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      title,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    document.location.replace("/dashboard/");
  } else {
    alert(response.statusText);
  }
}

document
  .querySelector(".edit-post-form")
  .addEventListener("submit", editFormHandler);
