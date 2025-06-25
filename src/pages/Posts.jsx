import React, { useState, useEffect, useCallback } from "react";
import { getPosts, createPost } from "../services/postsService";
import Loader from "../components/Loader";
import Notification from "../components/Notification";
import Modal from "../components/Modal";

const POSTS_PER_PAGE = 10;
 
const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState("");
  const [modalPost, setModalPost] = useState(null);
  const [allLoaded, setAllLoaded] = useState(false);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const loadPosts = useCallback(async (pageToLoad) => {
    if (allLoaded) return;

    setLoading(true);

    try {
      const start = (pageToLoad - 1) * POSTS_PER_PAGE;
      const newPosts = await getPosts(start, POSTS_PER_PAGE);

      if (newPosts.length < POSTS_PER_PAGE) {
        setAllLoaded(true);
      }

      setPosts((prev) => [...prev, ...newPosts]);
      setPage(pageToLoad + 1);
    } catch (error) {
      console.error("Помилка завантаження постів:", error);
    } finally {
      setLoading(false);
    }
  }, [allLoaded]);

  useEffect(() => {
    loadPosts(1);
  }, [loadPosts]);

  const handleDeletePost = (id, e) => {
    e.stopPropagation();

    setPosts((prev) => {
      const filtered = prev.filter((post) => post.id !== id);
      if (filtered.length === 0) {
        setAllLoaded(false);
      }
      return filtered;
    });
    setNotification("Публікацію видалено.");
  };

  const handleLoadMore = () => {
    loadPosts(page);
  };

  const isFormValid = title.trim() !== "" && body.trim() !== "";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) return;

    const newPost = {
      title: title.trim(),
      body: body.trim(),
      userId: 1,
    };

    setLoading(true);
    try {
      const res = await createPost(newPost);

      setPosts((prev) => [res, ...prev]);
      setNotification("Публікацію створено успішно!");
      setTitle("");
      setBody("");
    } catch (error) {
      console.error("Не вдалося створити пост:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1>Створення публікації</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Заголовок"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Текст публікації"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
        />
        <button type="submit" disabled={!isFormValid}>
          Опублікувати
        </button>
      </form>

      <section>
        <h2>Публікації</h2>
        <div className="posts-list">
          {posts.length === 0 && !loading && (
            <p>Додайте публікації або натисніть "Завантажити ще" для отримання постів</p>
          )}

          {posts.map((post, idx) => (
            <div
              key={post.id}
              className={`post ${idx % 2 === 0 ? "even" : "odd"} clickable`}
              onClick={() => setModalPost(post)}
            >
              <h3>{post.title}</h3>
              <p>{post.body}</p>
              <div className="post-actions">
                <button
                  className="delete-btn"
                  onClick={(e) => handleDeletePost(post.id, e)}
                >
                  Видалити
                </button>
              </div>
            </div>
          ))}
        </div>

        {!allLoaded && (
          <button
            className="load-more-btn"
            onClick={handleLoadMore}
            disabled={loading}
          >
            Завантажити ще
          </button>
        )}
      </section>

      <Loader show={loading} />
      <Notification message={notification} onClose={() => setNotification("")} />
      <Modal post={modalPost} onClose={() => setModalPost(null)} />
    </>
  );
};

export default Posts;
