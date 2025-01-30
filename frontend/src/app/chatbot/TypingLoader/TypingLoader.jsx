import './typingloader.css';

export default function TypingLoader({ content = 'QuackPrep is typing' }) {
  return (
    <div className='typing-loader-container'>
      <div className='typing-loader'>
        <div className='typing-dots'>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className='typing-text'>{content}</div>
      </div>
    </div>
  );
}
