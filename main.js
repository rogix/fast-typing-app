import "./style.css";
import words from "./words.js";

class TypingApp {
  constructor(words) {
    this.words = words;
    this.currentWordIndex = 0;
    this.wordsDisplay = document.querySelector(".words-display");
    this.wpmDisplay = document.querySelector(".wpm");
    this.startTime = null;
    this.blockSize = 10;

    document.addEventListener("keydown", (e) => this.checkLetter(e));
    this.pickRandomWords();
    const firstWordElement = this.wordsDisplay.querySelectorAll(".word")[0];
    if (firstWordElement) {
      firstWordElement.querySelector("span").classList.add("cursor");
    }
  }

  pickRandomWords() {
    this.currentWords = [];
    for (let i = 0; i < this.blockSize; i++) {
      const index = Math.floor(Math.random() * this.words.length);
      this.currentWords.push(this.words[index]);
      if (i !== this.blockSize - 1) {
        this.currentWords.push(" "); // Add space between words
      }
    }

    this.wordsDisplay.innerHTML = this.currentWords
      .map((word, i) => {
        if (word === " ") {
          return '<span class="word space">&nbsp;</span>'; // Add a space element
        }
        return `<span class="word">${word
          .split("")
          .map((letter) => `<span>${letter}</span>`)
          .join("")}</span>`;
      })
      .join("");
    if (this.startTime === null) {
      this.startTime = Date.now();
    }
  }

  updateWPM() {
    const currentTime = Date.now();
    const elapsedTime = (currentTime - this.startTime) / 1000 / 60; // in minutes
    const numberOfWords = (this.currentWordIndex + 1) / 2; // Count only actual words
    const wpm = Math.floor(numberOfWords / elapsedTime);
    this.wpmDisplay.textContent = wpm;
  }

  checkLetter(e) {
    const input = e.key === " " ? " " : e.key;
    const currentWord = this.currentWords[this.currentWordIndex];
    const nextCurrentLetterIndexElement = this.wordsDisplay
      .querySelectorAll(".word")
      [this.currentWordIndex].querySelectorAll(
        "span:not(.correct):not(.incorrect)"
      )[0];
    if (nextCurrentLetterIndexElement) {
      nextCurrentLetterIndexElement.classList.add("cursor");
    }
    const currentLetterIndex =
      this.wordsDisplay
        .querySelectorAll(".word")
        [this.currentWordIndex].querySelectorAll(
          "span:not(.correct):not(.incorrect)"
        ).length > 0
        ? this.wordsDisplay
            .querySelectorAll(".word")
            [this.currentWordIndex].querySelectorAll(
              "span:not(.correct):not(.incorrect)"
            )[0].textContent
        : null;

    if (currentWord === " " && input === " ") {
      this.wordsDisplay
        .querySelectorAll(".word")
        [this.currentWordIndex].classList.add("correct");
      this.currentWordIndex++;
      return;
    }

    if (currentLetterIndex !== null && input === currentLetterIndex) {
      this.wordsDisplay
        .querySelectorAll(".word")
        [this.currentWordIndex].querySelectorAll(
          "span:not(.correct):not(.incorrect)"
        )[0]
        .classList.add("correct");
    } else if (currentLetterIndex !== null) {
      this.wordsDisplay
        .querySelectorAll(".word")
        [this.currentWordIndex].querySelectorAll(
          "span:not(.correct):not(.incorrect)"
        )[0]
        .classList.add("incorrect");
    }

    if (
      this.wordsDisplay
        .querySelectorAll(".word")
        [this.currentWordIndex].querySelectorAll(
          "span:not(.correct):not(.incorrect)"
        ).length === 0
    ) {
      this.currentWordIndex++;

      if (this.currentWordIndex === this.blockSize * 2 - 1) {
        // Update this line
        this.updateWPM();
        this.currentWordIndex = 0;
        setTimeout(() => {
          this.pickRandomWords();
          this.startTime = Date.now();
        }, 2000);
      }
    }
  }
}

const typingApp = new TypingApp(words);
