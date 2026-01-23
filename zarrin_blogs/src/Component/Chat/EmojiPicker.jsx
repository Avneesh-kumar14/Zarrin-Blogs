import React, { useState, useMemo } from 'react';
import { X } from 'lucide-react';
import './EmojiPicker.css';

const EMOJI_CATEGORIES = {
  recent: {
    name: 'Recent',
    icon: '🕐',
    emojis: []
  },
  smileys: {
    name: 'Smileys',
    icon: '😀',
    emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '🥲', '😋', '😛', '😜', '🤪', '😌', '😔', '😑', '😐', '😏', '😒', '🙁', '😲', '😞', '😖', '😢', '😭', '😤', '😠', '🤬', '😈', '👿', '💀', '☠️', '💩', '🤡', '👹', '👺', '👻', '👽', '👾', '🤖', '😸', '😹', '😺', '😻', '😼', '😽', '🙀', '😿', '😾']
  },
  gestures: {
    name: 'Gestures',
    icon: '👋',
    emojis: ['👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🫰', '🤟', '🤘', '🤙', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🤜', '🤛']
  },
  hearts: {
    name: 'Hearts',
    icon: '❤️',
    emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '💌', '💢', '💥', '💫', '⭐', '🌟', '✨', '⚡']
  },
  hand_signs: {
    name: 'Hand Signs',
    icon: '🤚',
    emojis: ['🤚', '👌', '🤌', '🤏', '✌️', '🤞', '🫰', '🤟', '🤘', '🤙', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝']
  },
  symbols: {
    name: 'Symbols',
    icon: '💯',
    emojis: ['💯', '💢', '💥', '✨', '🌟', '⭐', '🔥', '💫', '🎉', '🎊', '🎈', '🎁', '🏆', '🥇', '🥈', '🥉', '⚽', '⚾', '🏀', '🏈', '🎾', '🎳', '🎯', '🎪', '🎭', '🎨', '🎬', '🎤', '🎧', '🎼', '🎹', '🎺', '🎸', '🥁', '🎻']
  },
  activities: {
    name: 'Activities',
    icon: '🎮',
    emojis: ['🎮', '🎯', '🎲', '🎰', '🎳', '🎪', '🎨', '🎬', '🎤', '🎧', '🎼', '🎹', '🎺', '🎸', '🥁', '🎻', '🎭', '🏆', '🏅', '🥇', '🥈', '🥉']
  },
  nature: {
    name: 'Nature',
    icon: '🌸',
    emojis: ['🌸', '🌺', '🌻', '🌼', '🌷', '🌹', '🥀', '🌱', '🌲', '🌳', '🌴', '🌵', '🌾', '🌿', '☘️', '🍀', '🎍', '🎎', '🎏', '🎐', '🎑', '🦋', '🐛', '🐝', '🐞', '🦗', '🕷️', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🏔️']
  },
  food: {
    name: 'Food',
    icon: '🍕',
    emojis: ['🍕', '🍔', '🍟', '🌭', '🥪', '🥙', '🧆', '🌮', '🌯', '🥗', '🥘', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🥟', '🦪', '🍤', '🍙', '🍚', '🍘', '🍥', '🥠', '🥮', '🍢', '🍡', '🍧', '🍨', '🍦', '🍰', '🎂', '🧁', '🍮', '🍭', '🍬', '🍫', '🍿', '🍩', '🍪', '🌰', '🥜', '🍞', '🥐', '🥖', '🥨', '🧀', '🥓', '🥞', '🧈', '🍳', '🥚', '🍶', '🍷', '🍾', '🍸', '🍹', '🍺', '🍻', '🥂', '🥃', '🥤', '🧃', '🧉', '☕', '🍵', '🍶']
  },
  travel: {
    name: 'Travel',
    icon: '🚀',
    emojis: ['🚀', '🛸', '🛰️', '🚁', '🛶', '⛵', '🚤', '🛳️', '⛴️', '🛥️', '🛩️', '✈️', '🛫', '🛬', '🪂', '💺', '🚲', '🛴', '🛵', '🏍️', '🚨', '🚔', '🚍', '🚘', '🚖', '🚡', '🚠', '🚟', '🚃', '🚋', '🚞', '🚝', '🚄', '🚅', '🚈', '🚂', '🚆', '🚇', '🚊', '🚉', '✈️', '🛫', '🛬', '🛰️']
  }
};

const EmojiPicker = ({ onEmojiSelect, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState('smileys');
  const [searchQuery, setSearchQuery] = useState('');

  const emojis = useMemo(() => {
    const category = EMOJI_CATEGORIES[selectedCategory];
    if (!searchQuery) {
      return category.emojis;
    }
    // Simple emoji search (you can enhance this with emoji names)
    return category.emojis.filter(emoji =>
      emoji.includes(searchQuery) || emoji.match(searchQuery)
    );
  }, [selectedCategory, searchQuery]);

  const handleEmojiClick = (emoji) => {
    onEmojiSelect(emoji);
    // Add to recent (you could persist this)
    if (!EMOJI_CATEGORIES.recent.emojis.includes(emoji)) {
      EMOJI_CATEGORIES.recent.emojis.unshift(emoji);
      if (EMOJI_CATEGORIES.recent.emojis.length > 24) {
        EMOJI_CATEGORIES.recent.emojis = EMOJI_CATEGORIES.recent.emojis.slice(0, 24);
      }
    }
  };

  return (
    <div className="emoji-picker-overlay">
      <div className="emoji-picker-container">
        <div className="emoji-picker-header">
          <h3>Pick an emoji</h3>
          <button className="emoji-picker-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="emoji-picker-search">
          <input
            type="text"
            placeholder="Search emojis..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
        </div>

        <div className="emoji-picker-categories">
          {Object.entries(EMOJI_CATEGORIES).map(([key, category]) => (
            key !== 'recent' || EMOJI_CATEGORIES.recent.emojis.length > 0 ? (
              <button
                key={key}
                className={`emoji-category-btn ${selectedCategory === key ? 'active' : ''}`}
                onClick={() => setSelectedCategory(key)}
                title={category.name}
              >
                {category.icon}
              </button>
            ) : null
          ))}
        </div>

        <div className="emoji-picker-grid">
          {emojis.length > 0 ? (
            emojis.map((emoji, idx) => (
              <button
                key={idx}
                className="emoji-button-grid"
                onClick={() => handleEmojiClick(emoji)}
                title={emoji}
              >
                {emoji}
              </button>
            ))
          ) : (
            <div className="emoji-no-results">No emojis found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmojiPicker;
