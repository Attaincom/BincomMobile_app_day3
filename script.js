const BIN_ID = "67ae135de41b4d34e48c771d";
const API_KEY = "$2a$10$ka/Gglq1rLCcwRU1ez/KXul6UWDpSpjmLXWe8yMoR7ekL6BJUi5O.";
const API_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;  // Base URL

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

        const postsContainer = document.getElementById("posts");
        postsContainer.innerHTML = "";

        posts.forEach(post => {
            const date = new Date(post.createdAt).toLocaleString();
            postsContainer.innerHTML += `
                <div class="post">
                    <h4>${post.title}</h4>
                    <p>${post.content}</p>
                    <small>Added on: ${date}</small>
                </div>`;
        });

    } catch (error) {
        console.error("Error fetching posts:", error);
    }
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

        // Fetch current posts
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

        // Create a new post object
        const newPost = {
            id: Math.random().toString(36).substr(2, 9),
            title,
            content,
            createdAt: new Date().toISOString()
        };

        posts.push(newPost); // Append the new post

        // Send updated posts back to jsonbin.io
        const updateResponse = await fetch(API_URL, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "X-Master-Key": API_KEY,
                "X-Bin-Versioning": "false" // Disable versioning to avoid multiple copies
            },
            body: JSON.stringify({ posts })
        });

        if (!updateResponse.ok) {
            throw new Error("Failed to update posts.");
        }

        // Clear input fields
        document.getElementById("title").value = "";
        document.getElementById("content").value = "";

        fetchPosts(); // Refresh the posts list

    } catch (error) {
        console.error("Error creating post:", error);
    }
}

// Attach event listener to button
document.getElementById("addPostBtn").addEventListener("click", createPost);

// Load posts on page load
fetchPosts();
