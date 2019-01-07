import  React, { useState, useRef } from 'react';
import './App.css';
import { useAudio } from "react-use";
import backward from './backward.png';
import forward from './forward.png';
import play from './play.png';
import pause from './pause.png';
import mute from './volume-off.png';
import up from './volume-mute.png';
import volumeUp from './volume-up.png';
import volumeDown from './volume-down.png';
import fastRewind from './fast-rewind.png';
import goForward from './go-forward.png';
import music from './music-notes.png';



const Player = () => {

  // List of songs (all)
  const songs = [
   {name:"Morning", key:0, artist:"Anton", fullTime:"6:12", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"},
   {name:"Day", key:1, artist:"Mark", fullTime:"7:05", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"},
   {name:"Evening", key:2, artist:"Matvey", fullTime:"5:44", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"},
   {name:"Night", key:3, artist:"Maria", fullTime:"5:44", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"}
  ];

  // UseState (state by default)
  const [count, setCount] = useState(0);
  const [volumePercent, setVolumenPercent] = useState("100%");
  const [autoPlay, setAutoPlay] = useState(false);
  const [songsSearch, setSongsSearch] = useState(songs);

  // Autoplay enabled
  if (count !== 0 && autoPlay === false){
   setAutoPlay(true);
  }

  // UseAudio
  let [audio, state, controls] = useAudio({
   src: songs[count].src,
   name: songs[count].name,
   artist: songs[count].artist,
   autoPlay: autoPlay
  });

  // UseRef
  let nameRef = useRef();

  // Change Time by mouseСlick
  function changeTime(e) {
    let mouseСlick = e.nativeEvent.offsetX;
    controls.seek(state.time = state.duration/400*mouseСlick);
  }

  // Change Volume by mouseСlick
  function changeVolume(e) {
    let mouseСlick = e.nativeEvent.offsetX;
    controls.volume(state.volume = 1/400*mouseСlick);
    setVolumenPercent(Math.floor(1/400*mouseСlick*100)+'%');
  }

  // Change Volume by btn up
  function changeVolumeUp() {
    controls.volume(state.volume = state.volume + 0.2);
    setVolumenPercent(Math.floor(state.volume*100)+'%');
  }

  // Change Volume by btn down
  function changeVolumeDown() {
    controls.volume(state.volume = state.volume - 0.2);
    setVolumenPercent(Math.floor(state.volume*100)+'%');
  }

  // Forward song by btn
  function forwardSong() {
   if (count <= (songs.length-2)){
    setCount(count + 1)
   }
   else{
    setCount(0);
   };
  }

  // Backward song by btn
  function backwardSong() {
   if (count >= 1){
    setCount(count - 1)
   }
   else{
    setCount(songs.length-1);
   };
  }

  // Seconds translate into minutes
  function TimeFormat(time) {
   var hrs = ~~(time / 3600);
   var mins = ~~((time % 3600) / 60);
   var secs = time % 60;
   let ret = "";
   if (hrs > 0) {
     ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
   }
   ret += "" + mins + ":" + (secs < 10 ? "0" : "");
   ret += "" + secs;
   return ret;
  }

  // Filter list of songs (newName)
  const ChangeSearch = () => {
  let newName = nameRef.current.value.toLowerCase();

    function condition(value, index, array) {
      var result = false;
      let long = 0 || newName.length;
      if (value.name.substring(0, long).toLowerCase() === newName  || value.artist.substring(0, long).toLowerCase() === newName) {
          result = true;
      }
      return result;
    }

     setSongsSearch(songs.filter(condition));
  };

  // Background-color class for playing song
  function playingSong(song, count){
    if (song === count){
      return "playingSong";
    } else {
      return "";
    }
  }

  // List of songs (search)
  const SongsListSearch = () => {
    let songsList = songsSearch.map((song) =>
      <div  key={song.key} id={song.key} onClick={() => setCount(song.key)} className={playingSong(song.key, count)}>
        <div> <img src={music} className="play" alt="music"/>{song.artist} - {song.name}</div><div>{song.fullTime}</div>
      </div>
    );
    if (songsList.length !== 0){
      return (
        <div className="boxOneSong">{songsList}</div>
      );
    } else {
      return (
        <p>Сhange search parameters...</p>
      );
    }
  }

  return (
   <div className="container">
    <img src={backward} onClick={backwardSong} alt="backward"/>
    {state.isPlaying ? <img src={pause} onClick={controls.pause} alt="pause"/> : <img src={play} onClick={controls.play} alt="play"/>}
    <img src={forward} onClick={forwardSong} alt="forward"/>
    {state.muted ? <img src={up} onClick={controls.unmute} alt="unmute" className="borderRed"/> : <img src={mute} onClick={controls.mute} alt="mute"/>}

    <img src={volumeDown} onClick={changeVolumeDown} alt="volumeDown"/>
    <img src={volumeUp} onClick={changeVolumeUp} alt="volumeUp"/>
    <img src={fastRewind} onClick={() => controls.seek(state.time - 10)} alt="fastRewind"/>
    <img src={goForward} onClick={() => controls.seek(state.time + 10)} alt="goForward"/>

    <p> {audio.props.name} - {audio.props.artist} - {TimeFormat(Math.floor(state.time))} - {TimeFormat(Math.floor(state.duration))} </p>

    <div className="boxFullTime" onClick={changeTime}>
      <div className="boxActualTime" style={{width: 100/state.duration*state.time + '%'}}>
      </div>
    </div>

    <p> Volume: {Math.floor(state.volume*100)} </p>
    <div className="boxFullVolume" onClick={changeVolume}>
     <div className="boxActualVolume" style={{width: volumePercent}}>
     </div>
    </div>

    <div className="displayNone">
       {audio}
       <pre>{JSON.stringify(state, null, 2)}</pre>
    </div>

    <p> Search: </p>
    <input ref={nameRef} type="text" placeholder="Start typing artist or track" onChange={ChangeSearch}/>

    <p>Songs:</p>
    <div>
      <SongsListSearch />
    </div>
   </div>

  );
  };

  function App() {
  return (
    <div>
      <Player />
    </div>
  )
}

export default App;
