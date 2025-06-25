const Modal = ({ post, onClose }) => {
  if (!post) return null;

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close-btn" onClick={onClose}>
          &times;
        </span>
        <h2>{post.title}</h2>
        <p>{post.body}</p>
      </div>
    </div>
  );
};

export default Modal;
