import React, { useState, useEffect } from "react";
import axios from "axios";
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

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    loadPosts(1);
  }, []);

  async function loadPosts(pageToLoad) {
    setLoading(true);

    try {
      const res = await axios.get(
        `https://jsonplaceholder.typicode.com/posts?_start=${(pageToLoad - 1) * POSTS_PER_PAGE}&_limit=${POSTS_PER_PAGE}`,
      );
      setPosts((prev) => [...prev, ...res.data]);
      setPage(pageToLoad + 1);
    } catch (error) {
      console.error("Помилка завантаження постів:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleDeletePost = (id, e) => {
    e.stopPropagation();

    setPosts((prev) => prev.filter((post) => post.id !== id));
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
      const res = await axios.post(
        "https://jsonplaceholder.typicode.com/posts",
        newPost,
      );

      setPosts((prev) => [res.data, ...prev]);
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
        <button
          className="load-more-btn"
          onClick={handleLoadMore}
          disabled={loading}
        >
          Завантажити ще
        </button>
      </section>

      <Loader show={loading} />
      <Notification
        message={notification}
        onClose={() => setNotification("")}
      />
      <Modal post={modalPost} onClose={() => setModalPost(null)} />
    </>
  );
};

export default Posts;
