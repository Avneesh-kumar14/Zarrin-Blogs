import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Mock Blog Card Component
const MockBlogCard = ({ blog, onLike, onBookmark }) => {
  return (
    <div data-testid="blog-card">
      <img src={blog.image} alt={blog.title} />
      <h3>{blog.title}</h3>
      <p>{blog.description}</p>
      <div className="blog-meta">
        <span className="author">By {blog.author}</span>
        <span className="category">{blog.category}</span>
      </div>
      <div className="blog-actions">
        <button onClick={() => onLike(blog.id)} data-testid="like-btn">
          ❤️ {blog.likes}
        </button>
        <button onClick={() => onBookmark(blog.id)} data-testid="bookmark-btn">
          📌 Bookmark
        </button>
        <button data-testid="read-more-btn">Read More</button>
      </div>
    </div>
  );
};

describe('Blog Card Component', () => {
  
  const mockBlog = {
    id: '1',
    title: 'Learning MERN Stack',
    description: 'A complete guide to building applications with MongoDB, Express, React, and Node.js',
    image: 'https://example.com/blog.jpg',
    author: 'John Doe',
    category: 'Technology',
    likes: 5,
    bookmarks: 2
  };

  const mockOnLike = jest.fn();
  const mockOnBookmark = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render blog card with all information', () => {
    render(
      <BrowserRouter>
        <MockBlogCard 
          blog={mockBlog} 
          onLike={mockOnLike}
          onBookmark={mockOnBookmark}
        />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Learning MERN Stack')).toBeInTheDocument();
    expect(screen.getByText(/A complete guide/)).toBeInTheDocument();
    expect(screen.getByText('By John Doe')).toBeInTheDocument();
    expect(screen.getByText('Technology')).toBeInTheDocument();
  });

  test('should display correct blog image', () => {
    render(
      <BrowserRouter>
        <MockBlogCard 
          blog={mockBlog} 
          onLike={mockOnLike}
          onBookmark={mockOnBookmark}
        />
      </BrowserRouter>
    );
    
    const image = screen.getByAltText('Learning MERN Stack');
    expect(image).toHaveAttribute('src', 'https://example.com/blog.jpg');
  });

  test('should display likes count', () => {
    render(
      <BrowserRouter>
        <MockBlogCard 
          blog={mockBlog} 
          onLike={mockOnLike}
          onBookmark={mockOnBookmark}
        />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/5/)).toBeInTheDocument();
  });

  test('should call onLike when like button is clicked', () => {
    render(
      <BrowserRouter>
        <MockBlogCard 
          blog={mockBlog} 
          onLike={mockOnLike}
          onBookmark={mockOnBookmark}
        />
      </BrowserRouter>
    );
    
    const likeButton = screen.getByTestId('like-btn');
    fireEvent.click(likeButton);
    
    expect(mockOnLike).toHaveBeenCalledWith('1');
    expect(mockOnLike).toHaveBeenCalledTimes(1);
  });

  test('should call onBookmark when bookmark button is clicked', () => {
    render(
      <BrowserRouter>
        <MockBlogCard 
          blog={mockBlog} 
          onLike={mockOnLike}
          onBookmark={mockOnBookmark}
        />
      </BrowserRouter>
    );
    
    const bookmarkButton = screen.getByTestId('bookmark-btn');
    fireEvent.click(bookmarkButton);
    
    expect(mockOnBookmark).toHaveBeenCalledWith('1');
    expect(mockOnBookmark).toHaveBeenCalledTimes(1);
  });

  test('should render all action buttons', () => {
    render(
      <BrowserRouter>
        <MockBlogCard 
          blog={mockBlog} 
          onLike={mockOnLike}
          onBookmark={mockOnBookmark}
        />
      </BrowserRouter>
    );
    
    expect(screen.getByTestId('like-btn')).toBeInTheDocument();
    expect(screen.getByTestId('bookmark-btn')).toBeInTheDocument();
    expect(screen.getByTestId('read-more-btn')).toBeInTheDocument();
  });

  test('should handle multiple blog cards', () => {
    const blogs = [
      mockBlog,
      { ...mockBlog, id: '2', title: 'React Hooks' },
      { ...mockBlog, id: '3', title: 'Node.js Best Practices' }
    ];

    const { rerender } = render(
      <BrowserRouter>
        {blogs.map(blog => (
          <MockBlogCard 
            key={blog.id}
            blog={blog} 
            onLike={mockOnLike}
            onBookmark={mockOnBookmark}
          />
        ))}
      </BrowserRouter>
    );

    expect(screen.getAllByTestId('blog-card')).toHaveLength(3);
    expect(screen.getByText('React Hooks')).toBeInTheDocument();
    expect(screen.getByText('Node.js Best Practices')).toBeInTheDocument();
  });
});
