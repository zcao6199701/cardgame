import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const icons = ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯"]; // Cartoon-style animal icons

const generateDeck = () => {
  // Generate 60 cards (10 icons, 6 repetitions each)
  const deck = [];
  icons.forEach((icon) => {
    for (let i = 0; i < 6; i++) {
      deck.push({ icon, id: `${icon}-${i}` });
    }
  });

  // Shuffle the cards
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  // Assign random positions and rotations to each card
  return deck.map((card) => ({
    ...card,
    position: {
      top: Math.random() * 80 + 10, // 10% to 90% vertical position
      left: Math.random() * 80 + 10, // 10% to 90% horizontal position
      rotation: Math.random() * 40 - 20, // Random rotation between -20 and 20 degrees
    },
  }));
};

const Card = ({ card, onClick, isSelected, isRemoved }) => {
  return (
    <motion.div
      className={`absolute w-16 h-20 flex items-center justify-center border rounded-md cursor-pointer transition-transform duration-150 ${
        isRemoved ? "bg-gray-200" : "bg-white shadow-md"
      } ${isSelected ? "ring-4 ring-blue-500 scale-110 z-10" : ""}`}
      onClick={onClick}
      style={{
        top: `${card.position.top}%`,
        left: `${card.position.left}%`,
        transform: `rotate(${card.position.rotation}deg)`,
        zIndex: isSelected ? 10 : "auto",
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      whileHover={{ scale: 1.1 }}
    >
      <span className="text-3xl">{card.icon}</span>
    </motion.div>
  );
};

const CardMatchingGame = () => {
  const [deck, setDeck] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [removedCards, setRemovedCards] = useState([]);
  const [winMessage, setWinMessage] = useState("");

  useEffect(() => {
    // Initialize the deck with fixed positions
    setDeck(generateDeck());
  }, []);

  const handleCardClick = (card) => {
    if (selectedCards.length >= 3 || removedCards.includes(card.id)) return;

    const newSelectedCards = [...selectedCards, card];
    setSelectedCards(newSelectedCards);

    // Check for a match after selecting 3 cards
    if (newSelectedCards.length === 3) {
      if (
        newSelectedCards[0].icon === newSelectedCards[1].icon &&
        newSelectedCards[1].icon === newSelectedCards[2].icon
      ) {
        // Valid match
        setTimeout(() => {
          setRemovedCards((prev) => [
            ...prev,
            ...newSelectedCards.map((card) => card.id),
          ]);
          setSelectedCards([]);

          // Check for win condition
          if (removedCards.length + 3 === deck.length) {
            setWinMessage("🎉 Congratulations! You won! 🎉");
          }
        }, 500);
      } else {
        // Invalid match
        setTimeout(() => {
          setSelectedCards([]);
        }, 1000);
      }
    }
  };

  const renderCards = () => {
    return deck.map((card) => (
      <Card
        key={card.id}
        card={card}
        onClick={() => handleCardClick(card)}
        isSelected={selectedCards.includes(card)}
        isRemoved={removedCards.includes(card.id)}
      />
    ));
  };

  const renderBackgroundAnimations = () => {
    // Floating shapes in the background
    const floatingShapes = Array(10)
      .fill(0)
      .map((_, index) => (
        <motion.div
          key={index}
          className="absolute w-16 h-16 bg-yellow-300 rounded-full opacity-50"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, 20, -20, 0], // Floating animation
            x: [0, -10, 10, 0],
          }}
          transition={{
            duration: 6 + Math.random() * 4, // Random duration
            repeat: Infinity,
            ease: "easeInOut",
          }}
        ></motion.div>
      ));
    return floatingShapes;
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-200 via-purple-300 to-pink-400 relative overflow-hidden">
      <h1 className="text-4xl font-bold mb-6 text-white drop-shadow-lg">
        Fancy Cartoon Card Matching Game
      </h1>
      <div className="relative w-full h-full max-w-4xl">
        {renderBackgroundAnimations()}
        {renderCards()}
        {winMessage && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <motion.div
              className="bg-white p-8 rounded-lg shadow-lg"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h2 className="text-3xl font-bold text-purple-500">{winMessage}</h2>
              <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                onClick={() => {
                  setDeck(generateDeck());
                  setSelectedCards([]);
                  setRemovedCards([]);
                  setWinMessage("");
                }}
              >
                Play Again
              </button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardMatchingGame;