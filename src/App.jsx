import { useEffect, useRef, useState } from "react";
import "./App.css";
import axios from "axios";
import InfoIcon from '@mui/icons-material/Info';
import IconButton from '@mui/material/IconButton'
import InfoModal from "./InfoModal";

function App() {
  const Ref = useRef(null);

  const [currentWord, setCurrentWord] = useState("");
  const [userInput, setUserInput] = useState("");
  const [message, setMessage] = useState("");
  const [wordList, setWordList] = useState([]);
  const [timer, setTimer] = useState("00:06");
  const [playing, setPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [playedWords, setPlayedWords] = useState([]);
  const [playerLosses, setPlayerLosses] = useState(0);
  const [lastScore, setLastScore] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [highestScore, setHighestScore] = useState(0);

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleInput = (event) => {
    setUserInput(event.target.value);
  };

  const generateRandomWord = () => {
    axios.get(`https://random-word-api.herokuapp.com/word`).then((res) => {
      setCurrentWord(res.data[0]);
    });
  }

  useEffect(() => {
    const storedWords = localStorage.getItem("wordList");
    if (storedWords) {
      setWordList(JSON.parse(storedWords));
    } else {
      axios.get(`https://random-word-api.herokuapp.com/all`).then((res) => {
        const words = res.data;
        setWordList(words);
        localStorage.setItem("wordList", JSON.stringify(words));
      });
    }
    generateRandomWord();
  }, []);

  const handlePlayButtonClicked = () => {
    setPlaying(true);
    clearTimer(getDeadTime());
  };


  const validateInput = () => {
    if (userInput.length === 0) {
      setMessage("Please enter a word.");
    } else if (
      userInput.charAt(0) !== currentWord.charAt(currentWord.length - 1)
    ) {
      setMessage(
        `Word should start with '${currentWord.charAt(
          currentWord.length - 1
        )}'.`
      );
      setUserInput("");
    } else if (!wordList.includes(userInput)) {
      setMessage("Word is not in the list.");
      setUserInput("");
    } else if (playedWords.includes(userInput)) {
      setMessage("Word played already.")
      setUserInput("");
    }
    else {
      setMessage("Correct!");
      setUserInput("");
      clearTimer(getDeadTime());
      setScore(score + 1);
      setPlayedWords([...playedWords, userInput]);
      generateRandomWord();
    }
  };

  const getTimeRemaining = (e) => {
    const total =
      Date.parse(e) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor(
      (total / 1000 / 60) % 60
    );
    const hours = Math.floor(
      (total / 1000 / 60 / 60) % 24
    );
    return {
      total,
      hours,
      minutes,
      seconds,
    };
  };

  const startTimer = (e) => {
    let { total, seconds } = getTimeRemaining(e);
    if (total >= 0) {
      setTimer((seconds > 9 ? "00:" + seconds : "00:0" + seconds));
    }
  };

  const clearTimer = (e) => {

    setTimer("00:06");
    setScore(0);
    setPlayedWords([]);
    setUserInput("");
    setPlayerLosses(playerLosses + 1);

    if (Ref.current) clearInterval(Ref.current);
    const id = setInterval(() => {
      startTimer(e);
    }, 1000);
    Ref.current = id;
  };

  const getDeadTime = () => {
    let deadline = new Date();


    deadline.setSeconds(deadline.getSeconds() + 6);
    return deadline;
  };

  useEffect(() => {
    if (timer === "00:00" && playerLosses > 0) {
      setMessage("Time's up! Game over!")
      setTimeout(() => {
        setMessage("");
      }, 2000);
      setLastScore(score);
      setPlaying(false);
      updateHighestScore(score);
    }
  }, [timer, playerLosses, score]);

  const shareOnTwitter = () => {
    const tweetUrl = `https://twitter.com/intent/tweet?text=My+score+is+${lastScore}+in+Last+Letter+!+Play+now!+https://lstltr.netlify.app&hashtags=lasTletteR`;
    window.open(tweetUrl, '_blank');
  };

  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`;
    window.open(facebookUrl, '_blank');
  };

  const updateHighestScore = (newScore) => {
    if (newScore > highestScore) {
      setHighestScore(newScore);
    }
  };

  return (
    <div className="App">
      <div style={{
        display: "flex",
        flexDirection: "column"
      }}>
        <div className="title-bar">
          <h1>lasT letteR</h1>
          <IconButton aria-label="" onClick={handleModalOpen} disabled={playing}>
            <InfoIcon sx={{
              color: "white",
              "&:disabled": {
                color: "grey",
              }
            }} />
          </IconButton>
        </div>
        <div style={{ marginTop: "3rem" }}>
          {playing && <h3>{currentWord}</h3>}
          <input type="text" value={userInput} onChange={handleInput} disabled={!playing} onKeyDown={(e) => {
            if (e.key === 'Enter') {
              validateInput();
            }
          }} />
          <button onClick={validateInput} disabled={!playing} style={{
            marginLeft: "0.5rem",
          }}>Submit</button>
          <h2>{message}</h2>
          <p>{timer}</p>
          <p><b>Score</b>: {score}</p>
          <p><b>Last score</b>: {lastScore}</p>
          <p><b>Highest score</b>: {highestScore}</p>
          {!playing && (
            <>
              {playerLosses < 1 && <button onClick={handlePlayButtonClicked}>Play!</button>}
              {playerLosses > 0 && <button onClick={handlePlayButtonClicked}>Play Again!</button>}
              <button onClick={shareOnTwitter}>Share on Twitter</button>
              {/*   <button onClick={shareOnFacebook}>Share on Facebook</button> */}
            </>)
          }
        </div>
      </div>
      <InfoModal open={modalOpen} handleClose={handleModalClose} />
    </div>
  );
}

export default App;