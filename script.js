const BIN_ID = "67ae135de41b4d34e48c771d";
const API_KEY = "$2a$10$ka/Gglq1rLCcwRU1ez/KXul6UWDpSpjmLXWe8yMoR7ekL6BJUi5O.";
const API_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

// Function to fetch posts from jsonbin.io
async function fetchPosts() {
    try {
        console.log("Fetching posts...");

        const response = await fetch(`${API_URL}/latest`, {
            headers: {
                "X-Master-Key": API_KEY
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch posts.");
        }

        const data = await response.json();
        console.log("Fetched data:", data);

        const posts = data.record.posts || [];
        renderPosts(posts);
    } catch (error) {
        console.error("Error fetching posts:", error);
    }
}

// Function to render posts
function renderPosts(posts) {
    const postsContainer = document.getElementById("posts");
    postsContainer.innerHTML = "";

    posts.forEach(post => {
        const date = new Date(post.createdAt).toLocaleString();
        postsContainer.innerHTML += `
            <div class="post" data-id="${post.id}">
                <h4>${post.title}</h4>
                <p>${post.content}</p>
                <small>Added on: ${date}</small>
                <button onclick="editPost('${post.id}')">Edit</button>
                <button onclick="deletePost('${post.id}')">Delete</button>
            </div>`;
    });
}

// Function to create a new post
async function createPost() {
    const title = document.getElementById("title").value.trim();
    const content = document.getElementById("content").value.trim();

    if (!title || !content) {
        alert("Please enter a title and content.");
        return;
    }

    try {
        console.log("Creating post:", { title, content });

        const response = await fetch(`${API_URL}/latest`, {
            headers: {
                "X-Master-Key": API_KEY
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch existing posts.");
        }

        const data = await response.json();
        const posts = data.record.posts || [];

        const newPost = {
            id: Math.random().toString(36).substr(2, 9),
            title,
            content,
            createdAt: new Date().toISOString()
        };

        posts.push(newPost);

        await updatePosts(posts);
    } catch (error) {
        console.error("Error creating post:", error);
    }
}

// Function to delete a post
async function deletePost(postId) {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
        console.log("Deleting post:", postId);

        const response = await fetch(`${API_URL}/latest`, {
            headers: { "X-Master-Key": API_KEY }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch posts.");
        }

        const data = await response.json();
        let posts = data.record.posts || [];

        posts = posts.filter(post => post.id !== postId);

        await updatePosts(posts);
    } catch (error) {
        console.error("Error deleting post:", error);
    }
}

// Function to edit a post
async function editPost(postId) {
    try {
        console.log("Editing post:", postId);

        const response = await fetch(`${API_URL}/latest`, {
            headers: { "X-Master-Key": API_KEY }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch posts.");
        }

        const data = await response.json();
        let posts = data.record.posts || [];

        const post = posts.find(p => p.id === postId);
        if (!post) return;

        const newTitle = prompt("Enter new title:", post.title);
        const newContent = prompt("Enter new content:", post.content);

        if (newTitle !== null && newContent !== null) {
            post.title = newTitle.trim();
            post.content = newContent.trim();
            await updatePosts(posts);
        }
    } catch (error) {
        console.error("Error editing post:", error);
    }
}

// Function to update posts in jsonbin.io
async function updatePosts(posts) {
    try {
        const response = await fetch(API_URL, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "X-Master-Key": API_KEY,
                "X-Bin-Versioning": "false"
            },
            body: JSON.stringify({ posts })
        });

        if (!response.ok) {
            throw new Error("Failed to update posts.");
        }

        fetchPosts();
    } catch (error) {
        console.error("Error updating posts:", error);
    }
}

// Attach event listener to button
document.getElementById("addPostBtn").addEventListener("click", createPost);

// Load posts on page load
fetchPosts();
