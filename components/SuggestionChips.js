"use client";

import styles from './SuggestionChips.module.css';

const DEFAULT_CHIPS = [
  "한글은 왜 만드셨나요?",
  "고기를 정말 좋아하셨나요?",
  "어릴 때 별명이 무엇인가요?"
];

export default function SuggestionChips({ onChipClick, disabled }) {
  return (
    <div className={styles.container}>
      {DEFAULT_CHIPS.map((chip, idx) => (
        <button
          key={idx}
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
