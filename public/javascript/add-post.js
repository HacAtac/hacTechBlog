async function newFormHandler(event) {
  //this function will handle the form submission and prevent the default behavior
  //then it will call the addPost function to add the post to the database and then redirect to the home page

  event.preventDefault();

  const title = document.querySelector('input[name="post-title"]').value; // get the value of the title input
  const post_text = document.querySelector('textarea[name="post-text"]').value; // get the value of the post textarea

  const response = await fetch(`/api/posts`, {
    // fetch the post endpoint and pass in the post data as the body

    method: "POST", // set the method to post
    body: JSON.stringify({
      // set the body to the post data
      title, // set the title to the title variable
      post_text, // set the post_text to the post_text variable
    }),
    headers: {
      // set the headers to the content type and authorization
      "Content-Type": "application/json", //  set the content type to application/json
    },
  });

  if (response.ok) {
    document.location.replace("/dashboard");
  } else {
    alert(response.statusText);
  }
}

document // when the document is ready
  .querySelector(".new-post-form") // get the new post form
  .addEventListener("submit", newFormHandler); // add a submit event listener to the form and call the newFormHandler function
