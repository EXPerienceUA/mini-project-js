document.addEventListener('DOMContentLoaded', () => {
    const content = document.getElementById('content');
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');
    const postId = urlParams.get('postId');

    if (postId) {
        loadPostDetails(postId);
    } else if (userId) {
        loadUserDetails(userId);
    } else {
        loadUsers();
    }

    function loadUsers() {
        fetch('https://jsonplaceholder.typicode.com/users')
            .then(response => response.json())
            .then(users => {
                content.innerHTML = '<h1>Users</h1><div class="user-container" id="users"></div>';
                const usersContainer = document.getElementById('users');
                users.forEach(user => {
                    const userDiv = document.createElement('div');
                    userDiv.classList.add('user');
                    userDiv.innerHTML = `
                        <p>ID: ${user.id}</p>
                        <p>Name: ${user.name}</p>
                        <a href="?userId=${user.id}">View Details</a>
                    `;
                    usersContainer.appendChild(userDiv);
                });
            });
    }

    function loadUserDetails(userId) {
        fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
            .then(response => response.json())
            .then(user => {
                content.innerHTML = `
                    <div class="user-details" id="user-details">
                        <h2>User Details</h2>
                        <pre>${JSON.stringify(user, null, 2)}</pre>
                    </div>
                    <button id="load-posts" style="display:block; width: 90%; margin: 20px auto; padding: 10px;">Post of current user</button>
                    <div class="posts" id="posts"></div>
                `;

                document.getElementById('load-posts').addEventListener('click', () => {
                    fetch(`https://jsonplaceholder.typicode.com/users/${userId}/posts`)
                        .then(response => response.json())
                        .then(posts => {
                            const postsContainer = document.getElementById('posts');
                            postsContainer.innerHTML = '';
                            posts.forEach(post => {
                                const postDiv = document.createElement('div');
                                postDiv.classList.add('post');
                                postDiv.innerHTML = `
                                    <p>${post.title}</p>
                                    <a href="?postId=${post.id}">View Post Details</a>
                                `;
                                postsContainer.appendChild(postDiv);
                            });
                        });
                });
            });
    }

    function loadPostDetails(postId) {
        fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`)
            .then(response => response.json())
            .then(post => {
                content.innerHTML = `
                    <div class="post-details" id="post-details">
                        <h2>Post Details</h2>
                        <pre>${JSON.stringify(post, null, 2)}</pre>
                    </div>
                    <div class="comments" id="comments"></div>
                `;

                fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`)
                    .then(response => response.json())
                    .then(comments => {
                        const commentsContainer = document.getElementById('comments');
                        comments.forEach(comment => {
                            const commentDiv = document.createElement('div');
                            commentDiv.classList.add('comment');
                            commentDiv.innerHTML = `
                                <p><strong>${comment.name}</strong></p>
                                <p>${comment.body}</p>
                            `;
                            commentsContainer.appendChild(commentDiv);
                        });
                    });
            });
    }
});
