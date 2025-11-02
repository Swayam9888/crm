// Blog Website JavaScript Functionality

// Global variables
let blogs = [];
let currentEditId = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadBlogs();
    initializeEventListeners();
    showSection('home');
});

// Load blogs from localStorage
function loadBlogs() {
    const storedBlogs = localStorage.getItem('blogPosts');
    if (storedBlogs) {
        blogs = JSON.parse(storedBlogs);
    }
    displayBlogs();
}

// Save blogs to localStorage
function saveBlogs() {
    localStorage.setItem('blogPosts', JSON.stringify(blogs));
}

// Display all blogs
function displayBlogs() {
    const blogGrid = document.getElementById('blogGrid');
    const noBlogs = document.getElementById('noBlogs');
    
    if (blogs.length === 0) {
        blogGrid.style.display = 'none';
        noBlogs.style.display = 'block';
        return;
    }
    
    blogGrid.style.display = 'grid';
    noBlogs.style.display = 'none';
    
    // Sort blogs by date (newest first)
    const sortedBlogs = blogs.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    blogGrid.innerHTML = sortedBlogs.map(blog => createBlogCard(blog)).join('');
}

// Create blog card HTML
function createBlogCard(blog) {
    const excerpt = blog.content.length > 150 ? blog.content.substring(0, 150) + '...' : blog.content;
    const date = new Date(blog.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    return `
        <div class="blog-card" onclick="viewBlog('${blog.id}')">
            ${blog.image ? `<img src="${blog.image}" alt="${blog.title}" class="blog-image" onerror="this.style.display='none'">` : ''}
            <div class="blog-content">
                <div class="blog-meta">
                    <span class="blog-category">${blog.category}</span>
                    <span class="blog-date">${date}</span>
                </div>
                <h3 class="blog-title">${blog.title}</h3>
                <p class="blog-excerpt">${excerpt}</p>
                <div class="blog-author">
                    <i class="fas fa-user"></i>
                    <span>${blog.author}</span>
                </div>
                <div class="blog-actions" onclick="event.stopPropagation()">
                    <button class="btn btn-primary btn-small" onclick="editBlog('${blog.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger btn-small" onclick="confirmDelete('${blog.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>
    `;
}

// View a specific blog
function viewBlog(id) {
    const blog = blogs.find(b => b.id === id);
    if (!blog) return;
    
    const blogDetail = document.getElementById('blogDetail');
    const date = new Date(blog.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    blogDetail.innerHTML = `
        <div class="blog-detail-header">
            <h1 class="blog-detail-title">${blog.title}</h1>
            <div class="blog-detail-meta">
                <span><i class="fas fa-user"></i> ${blog.author}</span>
                <span><i class="fas fa-calendar"></i> ${date}</span>
                <span><i class="fas fa-tag"></i> ${blog.category}</span>
            </div>
        </div>
        ${blog.image ? `<img src="${blog.image}" alt="${blog.title}" class="blog-detail-image" onerror="this.style.display='none'">` : ''}
        <div class="blog-detail-content">
            ${formatContent(blog.content)}
        </div>
    `;
    
    showSection('view-blog');
}

// Format content with line breaks
function formatContent(content) {
    return content.replace(/\n/g, '</p><p>').replace(/^/, '<p>').replace(/$/, '</p>');
}

// Show a specific section
function showSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Show target section
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.dataset.section === sectionName) {
            link.classList.add('active');
        }
    });
    
    // Reset form if showing add-blog section
    if (sectionName === 'add-blog') {
        document.getElementById('blogForm').reset();
        currentEditId = null;
    }
}

// Edit blog
function editBlog(id) {
    const blog = blogs.find(b => b.id === id);
    if (!blog) return;
    
    currentEditId = id;
    
    // Fill the edit form
    document.getElementById('editBlogId').value = blog.id;
    document.getElementById('editBlogTitle').value = blog.title;
    document.getElementById('editBlogAuthor').value = blog.author;
    document.getElementById('editBlogCategory').value = blog.category;
    document.getElementById('editBlogImage').value = blog.image || '';
    document.getElementById('editBlogContent').value = blog.content;
    
    showSection('edit-blog');
}

// Confirm delete blog
function confirmDelete(id) {
    const modal = document.getElementById('deleteModal');
    modal.classList.add('show');
    
    const confirmBtn = document.getElementById('confirmDelete');
    confirmBtn.onclick = function() {
        deleteBlog(id);
        closeModal();
    };
}

// Delete blog
function deleteBlog(id) {
    blogs = blogs.filter(blog => blog.id !== id);
    saveBlogs();
    displayBlogs();
    showNotification('Blog deleted successfully!', 'success');
}

// Close modal
function closeModal() {
    const modal = document.getElementById('deleteModal');
    modal.classList.remove('show');
}

// Initialize event listeners
function initializeEventListeners() {
    // Navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.dataset.section;
            showSection(section);
        });
    });
    
    // Add blog form
    const blogForm = document.getElementById('blogForm');
    blogForm.addEventListener('submit', function(e) {
        e.preventDefault();
        addBlog();
    });
    
    // Edit blog form
    const editBlogForm = document.getElementById('editBlogForm');
    editBlogForm.addEventListener('submit', function(e) {
        e.preventDefault();
        updateBlog();
    });
    
    // Modal close events
    const modal = document.getElementById('deleteModal');
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// Add new blog
function addBlog() {
    const form = document.getElementById('blogForm');
    const formData = new FormData(form);
    
    const newBlog = {
        id: generateId(),
        title: formData.get('title').trim(),
        author: formData.get('author').trim(),
        category: formData.get('category'),
        image: formData.get('image').trim(),
        content: formData.get('content').trim(),
        date: new Date().toISOString()
    };
    
    // Validate form
    if (!newBlog.title || !newBlog.author || !newBlog.category || !newBlog.content) {
        showNotification('Please fill in all required fields!', 'error');
        return;
    }
    
    blogs.push(newBlog);
    saveBlogs();
    displayBlogs();
    showSection('home');
    showNotification('Blog added successfully!', 'success');
    
    // Reset form
    form.reset();
}

// Update existing blog
function updateBlog() {
    if (!currentEditId) return;
    
    const form = document.getElementById('editBlogForm');
    const formData = new FormData(form);
    
    const updatedBlog = {
        title: formData.get('title').trim(),
        author: formData.get('author').trim(),
        category: formData.get('category'),
        image: formData.get('image').trim(),
        content: formData.get('content').trim()
    };
    
    // Validate form
    if (!updatedBlog.title || !updatedBlog.author || !updatedBlog.category || !updatedBlog.content) {
        showNotification('Please fill in all required fields!', 'error');
        return;
    }
    
    // Find and update the blog
    const blogIndex = blogs.findIndex(blog => blog.id === currentEditId);
    if (blogIndex !== -1) {
        blogs[blogIndex] = {
            ...blogs[blogIndex],
            ...updatedBlog,
            dateModified: new Date().toISOString()
        };
        
        saveBlogs();
        displayBlogs();
        showSection('home');
        showNotification('Blog updated successfully!', 'success');
    }
    
    currentEditId = null;
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 3000;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Get notification icon
function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        default: return 'fa-info-circle';
    }
}

// Get notification color
function getNotificationColor(type) {
    switch (type) {
        case 'success': return '#28a745';
        case 'error': return '#dc3545';
        case 'warning': return '#ffc107';
        default: return '#17a2b8';
    }
}

// Add CSS animations for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        margin-left: auto;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background-color 0.3s ease;
    }
    
    .notification-close:hover {
        background-color: rgba(255,255,255,0.2);
    }
`;
document.head.appendChild(notificationStyles);

// Sample data for demonstration (optional)
function addSampleBlogs() {
    if (blogs.length === 0) {
        const sampleBlogs = [
            {
                id: generateId(),
                title: "Welcome to My Blog!",
                author: "Blog Admin",
                category: "lifestyle",
                image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop",
                content: "Welcome to our amazing blog platform! Here you can share your thoughts, experiences, and knowledge with the world. This is a fully responsive blog website built with HTML, CSS, and JavaScript. You can add new blog posts, edit existing ones, and manage your content easily. The data is stored locally in your browser, so your blogs will persist even after closing the browser. Start your blogging journey today!",
                date: new Date(Date.now() - 86400000).toISOString()
            },
            {
                id: generateId(),
                title: "Getting Started with Web Development",
                author: "Tech Guru",
                category: "technology",
                image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop",
                content: "Web development is an exciting field that combines creativity with technical skills. Whether you're interested in frontend development with HTML, CSS, and JavaScript, or backend development with various programming languages, there's always something new to learn. Start with the basics, build projects, and never stop learning. The web development community is welcoming and full of resources to help you grow.",
                date: new Date(Date.now() - 172800000).toISOString()
            },
            {
                id: generateId(),
                title: "The Art of Travel Photography",
                author: "Photo Explorer",
                category: "travel",
                image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop",
                content: "Travel photography is more than just taking pictures of beautiful places. It's about capturing moments, telling stories, and preserving memories. Whether you're using a professional camera or just your smartphone, the key is to observe your surroundings, understand lighting, and be patient. Great travel photos often come from unexpected moments and genuine interactions with local people and culture.",
                date: new Date(Date.now() - 259200000).toISOString()
            }
        ];
        
        blogs = sampleBlogs;
        saveBlogs();
        displayBlogs();
    }
}

// Uncomment the line below to add sample blogs when the page loads
// addSampleBlogs();
