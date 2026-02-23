import React, { useState, useMemo } from 'react';
import { X } from 'lucide-react';

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
  };

  return (
    <div className="bg-surface-primary dark:bg-surface-dark border border-border-default rounded-lg shadow-xl w-80 overflow-hidden z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border-light">
        <h3 className="text-sm font-semibold text-text-primary">Emojis</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition"
          title="Close"
        >
          <X size={16} className="text-text-secondary" />
        </button>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-border-light">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-neutral-100 dark:bg-neutral-800 border border-border-default rounded focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-primary"
          autoFocus
        />
      </div>

      {/* Emojis Grid */}
      <div className="grid grid-cols-6 gap-1 p-3 max-h-48 overflow-y-auto">
        {emojis.length > 0 ? (
          emojis.map((emoji, idx) => (
            <button
              key={idx}
              onClick={() => handleEmojiClick(emoji)}
              className="text-xl p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition text-center"
              title={emoji}
            >
              {emoji}
            </button>
          ))
        ) : (
          <div className="col-span-6 text-center py-4 text-text-secondary text-sm">
            No emojis found
          </div>
        )}
      </div>

      {/* Category Tabs */}
      <div className="flex gap-1 p-2 border-t border-border-light bg-neutral-50 dark:bg-neutral-900 overflow-x-auto">
        {Object.entries(EMOJI_CATEGORIES).map(([key, category]) => (
          <button
            key={key}
            onClick={() => {
              setSelectedCategory(key);
              setSearchQuery('');
            }}
            className={`flex-shrink-0 py-2 px-1 text-lg transition rounded hover:bg-gray-200 ${
              selectedCategory === key
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            title={category.name}
          >
            {category.icon}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmojiPicker;
