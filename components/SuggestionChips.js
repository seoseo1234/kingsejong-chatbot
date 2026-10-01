"use client";

import styles from './SuggestionChips.module.css';

export const DEFAULT_CHIPS = [
  "한글은 왜 만드셨나요?",
  "측우기로 비를 어떻게 쟀나요?",
  "세종대왕님은 어떤 음식을 좋아하셨나요?"
];

export default function SuggestionChips({ suggestions = DEFAULT_CHIPS, onChipClick, disabled }) {
  return (
    <div className={styles.container}>
      {suggestions.map((chip) => (
        <button
          key={chip}
          className={styles.chip}
          onClick={() => onChipClick(chip)}
          disabled={disabled}
        >
          {chip}
        </button>
      ))}
    </div>
  );
}
