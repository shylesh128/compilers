import React, { useState, useEffect } from "react";
import { saveAs } from "file-saver";
import { Button, MenuItem, Select } from "@mui/material";

export const TextToSpeech = () => {
  const [text, setText] = useState("");
  const [voice, setVoice] = useState("default");
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    // Fetch available voices when the component mounts
    if (window.speechSynthesis) {
      setVoices(window.speechSynthesis.getVoices());
      window.speechSynthesis.onvoiceschanged = () =>
        setVoices(window.speechSynthesis.getVoices());
    }
  }, []);

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleVoiceChange = (e) => {
    setVoice(e.target.value);
  };

  const handleSpeak = () => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    if (voice !== "default") {
      utterance.voice = voices.find((v) => v.name === voice);
    }
    synth.speak(utterance);
  };

  const handleDownload = () => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    if (voice !== "default") {
      utterance.voice = voices.find((v) => v.name === voice);
    }

    utterance.onend = () => {
      // After the speech is done, create an audio blob
      const audioBlob = new Blob([new Uint8Array(0)], { type: "audio/mpeg" });

      // Start an invisible audio element to trigger the speech synthesis
      const audio = new Audio(URL.createObjectURL(audioBlob));
      audio.play();

      // When the audio has finished playing, save the audio as a file
      audio.onended = () => {
        const audioBlob = new Blob([new Uint8Array(0)], { type: "audio/mpeg" });
        saveAs(audioBlob, "text-to-speech.mp3");
      };

      synth.speak(utterance); // Start speech synthesis
    };

    synth.speak(utterance); // Start speech synthesis
  };

  return (
    <div>
      <h2>Text to Speech</h2>
      <div>
        <textarea
          id="code"
          rows="4"
          cols="50"
          value={text}
          onChange={handleTextChange}
        />
      </div>
      <Select value={voice} onChange={handleVoiceChange}>
        <MenuItem value="default">Default</MenuItem>
        {voices.map((v) => (
          <MenuItem key={v.name} value={v.name}>
            {v.name}
          </MenuItem>
        ))}
      </Select>
      <button className="buttons" onClick={handleSpeak}>
        Speak
      </button>
      <button onClick={handleDownload}>Download</button>
    </div>
  );
};
