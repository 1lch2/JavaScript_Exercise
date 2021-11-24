const blogPosts = [
  { title: "First post", author: "jack"},
  { title: "First post", author: "jack"}
];

/**
 * refresh post from static value
 */
function getPosts() {
  setTimeout(() => {
    let res = '';
    blogPosts.forEach((value, index) => {
      res += `<p>#${index}. Title: ${value.title}</p>`;
    });
    // document.body.innerHTML = res;
    console.log(res);
  }, 1500);
}

/**
 * add new post and refresh the dom
 * @param {object} post new post
 * @param {function} callback refresh dom method
 */
function addPost(post, callback) {
  setTimeout(() => {
    blogPosts.push(post);
    callback();
  }, 3000);
}

getPosts();

let newPost = { title: "I am the new post", author: "someone"};
addPost(newPost, getPosts);